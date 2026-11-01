import { Component, computed, EventEmitter, inject, input, OnInit, Output, signal, Signal, WritableSignal } from '@angular/core';
import { Jugador, Roster } from '../../../shared/models/roster.model';
import { UserTeamTemplate } from '../../../shared/models/user-team-template.model';
import { HirePlayerButtonComponent } from '../components/hire-player-button/hire-player-button.component';
import { UserTeamPlayer } from '../../../shared/models/user-team-player.interface';
import { KeyValuePipe } from '@angular/common';
import { NavigationCacheService } from '../../../shared/services/navigation-service/navigation-cache.service';
import { TEAM_CREATION_RULES, TeamCreationRules } from '../domain/team-creation-rules.interface';
import { TeamCreationRulesService } from '../service/team-creation-rules.service';


@Component({
  imports: [HirePlayerButtonComponent, KeyValuePipe],
  selector: 'app-team-creation',
  styleUrl: './team-creation.component.css',
  templateUrl: './team-creation.component.html',
})
export class TeamCreationComponent implements OnInit {

  readonly userSelectedRosterTemplate = input.required<Roster>();
  private readonly navigationCacheService = inject(NavigationCacheService);
  private teamCreationRulesService = inject(TeamCreationRulesService);

  @Output() creationCancelled = new EventEmitter<void>();
  @Output() teamFounded = new EventEmitter<UserTeamTemplate>();

  readonly teamData: WritableSignal<UserTeamTemplate> = signal<UserTeamTemplate>({
    team_name: '',
    gold_reserve: TEAM_CREATION_RULES.initialTeamBudget,
    team_value: 0,
    players_roster: {},
    rerolls: 0,
    fan_factor: TEAM_CREATION_RULES.initialFanFactor,
  });

  readonly validationStatus = computed( () => this.teamCreationRulesService.teamValid());
  readonly individualValidationStatus = computed( () => this.teamCreationRulesService.individualValidations());
  readonly TeamCreationRules = TEAM_CREATION_RULES;
  readonly totalPlayers = computed( ()=> Object.values(this.teamData().players_roster).flat().length);
  ffCost: number = TEAM_CREATION_RULES.fanFactorCost
  readonly apothecaryCost = TEAM_CREATION_RULES.apothecaryCost;
  readonly apothecaryLimit = TEAM_CREATION_RULES.maxApothecary;

  readonly playerButtons: Signal<Pick<Jugador, "nombre" | "cantidad" | "coste">[]> = computed(() => this.userSelectedRosterTemplate().jugadores.map(({ nombre, cantidad, coste }) => ({ nombre, cantidad, coste })));

  ngOnInit(): void {
    const provisionalTeam = this.navigationCacheService.getProvisionalTeam();
    if (provisionalTeam) this.teamData.set(provisionalTeam);
    this.callToValidateService();
  }

  handlePlayerHiring($event: string) {
    this.hiringProcess($event)
  }

  increaseRerolls(): void {
    const rerollInfo = this.userSelectedRosterTemplate().segundas_oportunidades;
    const maxRerolls = Math.min(TEAM_CREATION_RULES.maxRerolls, rerollInfo.cantidad);
    const teamRerollCost = rerollInfo.coste_cada_una;
    const team = this.teamData();
    if (team.rerolls >= maxRerolls || team.gold_reserve < teamRerollCost) return;

    this.teamData.update(current => ({
      ...current,
      rerolls: current.rerolls + 1,
      gold_reserve: current.gold_reserve - teamRerollCost,
      team_value: current.team_value + teamRerollCost,
    }));
    this.provisionalTeamToCahe();
    this.callToValidateService();
  }

  decreaseRerolls(): void {
    const minRerolls = 0;
    const teamRerollCost = this.userSelectedRosterTemplate().segundas_oportunidades.coste_cada_una;
    const team = this.teamData();
    if (team.rerolls <= minRerolls) return;

    this.teamData.update(current => ({
      ...current,
      rerolls: current.rerolls - 1,
      gold_reserve: current.gold_reserve + teamRerollCost,
      team_value: current.team_value - teamRerollCost,
    }));
    this.provisionalTeamToCahe();
    this.callToValidateService();
  }

  increaseFanFactor(): void {
    const team = this.teamData();
    if (team.fan_factor >= 3 || team.gold_reserve < this.ffCost) return;

    this.teamData.update(current => ({
      ...current,
      fan_factor: current.fan_factor + 1,
      gold_reserve: current.gold_reserve - this.ffCost,
    }));
    this.provisionalTeamToCahe();
    this.callToValidateService();
  }

  decreaseFanFactor(): void {
    const team = this.teamData();
    if (team.fan_factor <= 1) return;

    this.teamData.update(current => ({
      ...current,
      fan_factor: current.fan_factor - 1,
      gold_reserve: current.gold_reserve + this.ffCost,
    }));
    this.provisionalTeamToCahe();
    this.callToValidateService();
  }

  hireApothecary(): void {
    const rosterAllowsApothecary = this.userSelectedRosterTemplate().apotecario;
    const team = this.teamData();
    const apothecariesHired = team.apothecary ?? 0;

    if (!rosterAllowsApothecary || apothecariesHired >= this.apothecaryLimit || team.gold_reserve < this.apothecaryCost) return;

    this.teamData.update(current => ({
      ...current,
      apothecary: apothecariesHired + 1,
      gold_reserve: current.gold_reserve - this.apothecaryCost,
      team_value: current.team_value + this.apothecaryCost,
    }));
    this.provisionalTeamToCahe();
    this.callToValidateService();
  }

  cancelCreation(): void {
    this.navigationCacheService.clearProvisionalTeam();
    this.creationCancelled.emit();
  }

  foundTeam(): void {
    if (!this.teamCreationRulesService.teamValid()) return;

    const foundedTeam = this.teamData();
    this.navigationCacheService.clearProvisionalTeam();
    this.teamFounded.emit(foundedTeam);
  }

  provisionalTeamToCahe(): void {
    this.navigationCacheService.cacheProvisionalTeam(this.teamData());
  }

  isPlayerAtLimit(player: Pick<Jugador, 'nombre' | 'cantidad' | 'coste'>): boolean {
    const rosterPlayer = this.userSelectedRosterTemplate().jugadores.find(candidate => candidate.nombre === player.nombre);
    if (!rosterPlayer || this.totalPlayers() >= TEAM_CREATION_RULES.maxPlayers) return true;

    const team = this.teamData();
    const currentPositionCount = (team.players_roster[player.nombre] ?? []).length;
    if (currentPositionCount >= rosterPlayer.cantidad) return true;

    return (this.userSelectedRosterTemplate().restricciones_plantilla ?? []).some(restriction => {
      const candidateMatchesGroup = this.playerMatchesPositionGroup(rosterPlayer.posicion, restriction.playerPositions);
      if (!candidateMatchesGroup) return false;

      const groupPlayerCount = Object.values(team.players_roster).flat().filter(hiredPlayer =>
        this.playerMatchesPositionGroup(hiredPlayer.playerInfo.posicion, restriction.playerPositions),
      ).length;

      return groupPlayerCount >= restriction.maxPlayers;
    });
  }

  private hiringProcess(playerName: string): void {
    const playerStats = this.userSelectedRosterTemplate().jugadores.find((player) => player.nombre === playerName);

    if (!playerStats) return;

    if (this.isPlayerAtLimit(playerStats)) return;

    const team = this.teamData();
    const currentPositionLineUp = team.players_roster[playerName] ?? [];

    const newProminentStar: UserTeamPlayer = {
      'playerInfo': playerStats,
      spp: 0,
      team_value_count: playerStats.coste,
      stats: {
        pass_attemp: 0,
        pass_success: 0,
        pass_fail: 0,
        interception: 0,
        ko_suffered: 0,
        ko_provoked: 0,
        td: 0,
        reception: 0,
        injuries: [],
        caused_injuries: [],
      }
    }
    if(team.gold_reserve < playerStats.coste) return;
    this.teamData.update(current => ({
      ...current,
      players_roster: {
        ...current.players_roster,
        [playerName]: [...currentPositionLineUp, newProminentStar],
      },
      gold_reserve: current.gold_reserve - playerStats.coste,
      team_value: current.team_value + newProminentStar.team_value_count,
    }));
    this.provisionalTeamToCahe();
    this.callToValidateService();
  }

  private callToValidateService(): void{
    this.teamCreationRulesService.evaluateTeamRules(this.teamData(), this.userSelectedRosterTemplate());
  }

  private playerMatchesPositionGroup(position: string, positionGroup: string[]): boolean {
    const playerPositions = position.split(',').map(positionName => positionName.trim());
    return positionGroup.some(positionName => playerPositions.includes(positionName));
  }
}
