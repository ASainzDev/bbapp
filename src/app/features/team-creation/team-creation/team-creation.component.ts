import { Component, computed, EventEmitter, inject, input, OnInit, Output, Signal } from '@angular/core';
import { Jugador, Roster } from '../../../shared/models/roster.model';
import { UserTeamTemplate } from '../../../shared/models/user-team-template.model';
import { HirePlayerButtonComponent } from '../components/hire-player-button/hire-player-button.component';
import { UserTeamPlayer } from '../../../shared/models/user-team-player.interface';
import { KeyValuePipe } from '@angular/common';
import { NavigationCacheService } from '../../../shared/services/navigation-service/navigation-cache.service';


@Component({
  imports: [HirePlayerButtonComponent, KeyValuePipe],
  selector: 'app-team-creation',
  styleUrl: './team-creation.component.css',
  templateUrl: './team-creation.component.html',
})
export class TeamCreationComponent implements OnInit {

  readonly userSelectedRosterTemplate = input.required<Roster>();
  private readonly navigationCacheService = inject(NavigationCacheService);

  @Output() creationCancelled = new EventEmitter<void>();

  teamData: UserTeamTemplate;
  readonly fan_factor_cost = 10000;

  readonly playerButtons: Signal<Pick<Jugador, "nombre" | "cantidad" | "coste">[]> = computed(() => this.userSelectedRosterTemplate().jugadores.map(({ nombre, cantidad, coste }) => ({ nombre, cantidad, coste })));

  constructor() {
    this.teamData = {
      'team_name': '',
      'gold_reserve': 1000000,
      'team_value': 0,
      'players_roster': {},
      'rerolls': 0,
      'fan_factor': 1
    }
  }


  ngOnInit(): void {
    this.teamData = this.navigationCacheService.getProvisionalTeam() ?? this.teamData;
  }

  handlePlayerHiring($event: string) {
    this.hiringProcess($event)
  }

  increaseRerolls(): void {
    const rerollInfo = this.userSelectedRosterTemplate().segundas_oportunidades;
    if (this.teamData.rerolls >= rerollInfo.cantidad || this.teamData.gold_reserve < rerollInfo.coste_cada_una) return;

    this.teamData.rerolls += 1;
    this.teamData.gold_reserve -= rerollInfo.coste_cada_una;
    this.teamData.team_value += rerollInfo.coste_cada_una;
    this.provisionalTeamToCahe();
  }

  decreaseRerolls(): void {
    const rerollInfo = this.userSelectedRosterTemplate().segundas_oportunidades;
    if (this.teamData.rerolls <= 0) return;

    this.teamData.rerolls -= 1;
    this.teamData.gold_reserve += rerollInfo.coste_cada_una;
    this.teamData.team_value -= rerollInfo.coste_cada_una;
    this.provisionalTeamToCahe();
  }

  increaseFanFactor(): void {
    if (this.teamData.fan_factor >= 3 || this.teamData.gold_reserve < this.fan_factor_cost) return;

    this.teamData.fan_factor += 1;
    this.teamData.gold_reserve -= this.fan_factor_cost;
    this.provisionalTeamToCahe();
  }

  decreaseFanFactor(): void {
    if (this.teamData.fan_factor <= 1) return;

    this.teamData.fan_factor -= 1;
    this.teamData.gold_reserve += this.fan_factor_cost;
    this.provisionalTeamToCahe();
  }

  cancelCreation(): void {
    this.navigationCacheService.clearProvisionalTeam();
    this.creationCancelled.emit();
  }

  provisionalTeamToCahe(): void {
    this.navigationCacheService.cacheProvisionalTeam(this.teamData);
  }

  private hiringProcess(playerName: string): void {

    const playerStats = this.userSelectedRosterTemplate().jugadores.find((player) => player.nombre === playerName);

    if (!playerStats) return;

    const currentPositionLineUp = this.teamData.players_roster[playerName] ?? [];

    if (currentPositionLineUp.length >= playerStats.cantidad) return;

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
    if(this.teamData.gold_reserve < playerStats.coste) return;
    this.teamData.players_roster[playerName] = [...currentPositionLineUp, newProminentStar];
    this.teamData.gold_reserve -= playerStats.coste;
    this.teamData.team_value += newProminentStar.team_value_count;
    this.provisionalTeamToCahe();
  }
}
