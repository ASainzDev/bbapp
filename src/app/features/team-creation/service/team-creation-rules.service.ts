import { Service, Signal, signal, WritableSignal } from '@angular/core';
import { UserTeamTemplate } from '../../../shared/models/user-team-template.model';
import { Roster } from '../../../shared/models/roster.model';
import { UserTeamPlayer } from '../../../shared/models/user-team-player.interface';
import { TEAM_CREATION_RULES } from '../domain/team-creation-rules.interface';

type IndividualValidationsInfo = {
    numberOfPlayers: boolean,
    numberOfRerolls: boolean,
    numberOfFanFactor: boolean,
    numberOfApothecary: boolean,
    numberOfCheerleaders: boolean,
    numberOfCoachAssistant: boolean,
    goldReserveValidation: boolean,
    rosterGroupLimits: boolean,
}
@Service()
export class TeamCreationRulesService {

    teamValid: WritableSignal<boolean> = signal(false);

    individualValidations: WritableSignal<IndividualValidationsInfo> = signal({
        numberOfPlayers: false,
        numberOfRerolls: false,
        numberOfFanFactor: true,
        numberOfApothecary: true,
        numberOfCheerleaders: true,
        numberOfCoachAssistant: true,
        goldReserveValidation: true,
        rosterGroupLimits: true,
    });

    public evaluateTeamRules(team: UserTeamTemplate, selectedRoster: Roster): void{

        const playerCount = this.evaluateTeamPlayersCount(team.players_roster);

        const rerollCount = this.evaluateTeamRerollCount(team.rerolls, selectedRoster.segundas_oportunidades.cantidad);

        const fanFactorCount = this.evaluateTeamFanFactorCount(team.fan_factor);

        const apothecaryCount = this.evaluateTeamApothecary(team.apothecary ?? 0, selectedRoster.apotecario);
        const cheerleadersCount = this.evaluateCheerleadersCount(team.cheerleaders ?? 0);
        const coachAssistantCount = this.evaluateCoachAssistantCount(team.coach_assistant ?? 0);

        const goldReserveCount = this.evaluateGoldReserveCount(team.gold_reserve);
        const rosterGroupLimits = this.evaluateRosterGroupLimits(team.players_roster, selectedRoster);

        const teamValidationStatus = playerCount && rerollCount && fanFactorCount && apothecaryCount && cheerleadersCount && coachAssistantCount && goldReserveCount && rosterGroupLimits

        this.individualValidations.update(current => ({
            ...current,
            numberOfPlayers: playerCount,
            numberOfRerolls: rerollCount,
            numberOfFanFactor: fanFactorCount,
            numberOfApothecary: apothecaryCount,
            numberOfCheerleaders: cheerleadersCount,
            numberOfCoachAssistant: coachAssistantCount,
            goldReserveValidation: goldReserveCount,
            rosterGroupLimits,
        }))

        this.teamValid.set(teamValidationStatus);
    }

    private evaluateTeamPlayersCount(players: Record<string, UserTeamPlayer[]>): boolean {
        const playerCollection: UserTeamPlayer[] = Object.values(players).flat();

        return (playerCollection.length >= TEAM_CREATION_RULES.minPlayers) && (playerCollection.length <= TEAM_CREATION_RULES.maxPlayers);
    }

    private evaluateTeamRerollCount(rerolls: number, rosterMaxRerolls: number): boolean {
        const maxRerolls = Math.min(TEAM_CREATION_RULES.maxRerolls, rosterMaxRerolls);
        return (rerolls >= 0) && (rerolls <= maxRerolls);
    }

    private evaluateTeamFanFactorCount(fanFactor: number): boolean {
        return (fanFactor >= TEAM_CREATION_RULES.minFanFactor) && (fanFactor <= TEAM_CREATION_RULES.maxFanFactor);
    }

    private evaluateTeamApothecary(apothecary: number, rosterAllowsApothecary: boolean): boolean{
        return (apothecary <= TEAM_CREATION_RULES.maxApothecary) && (apothecary >= 0) && (rosterAllowsApothecary || apothecary === 0)
    }

    private evaluateCheerleadersCount(cheerleaders: number): boolean{
        return (cheerleaders >= TEAM_CREATION_RULES.minCheerleaders) && (cheerleaders <= TEAM_CREATION_RULES.maxCheerleaders)
    }

    private evaluateCoachAssistantCount(coachAssistant: number): boolean{
        return (coachAssistant>= TEAM_CREATION_RULES.minCoachAssistant) && (coachAssistant <= TEAM_CREATION_RULES.maxCoachAssistant)
    }

    private evaluateGoldReserveCount(goldReserve: number): boolean{
        return (goldReserve >= 0) && (goldReserve <= TEAM_CREATION_RULES.initialTeamBudget);
    }

    private evaluateRosterGroupLimits(
        players: Record<string, UserTeamPlayer[]>,
        selectedRoster: Roster,
    ): boolean {
        const hiredPlayers = Object.values(players).flat();

        return (selectedRoster.restricciones_plantilla ?? []).every(restriction => {
            const playerCount = hiredPlayers.filter(player =>
                this.playerMatchesPositionGroup(player.playerInfo.posicion, restriction.playerPositions),
            ).length;

            return playerCount <= restriction.maxPlayers;
        });
    }

    private playerMatchesPositionGroup(position: string, positionGroup: string[]): boolean {
        const playerPositions = position.split(',').map(positionName => positionName.trim());
        return positionGroup.some(positionName => playerPositions.includes(positionName));
    }
}
