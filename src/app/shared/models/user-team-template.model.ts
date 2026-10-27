import { UserTeamPlayer } from "./user-team-player.interface";

export interface UserTeamTemplate {
    team_name: string,
    gold_reserve: number,
    team_value: number,
    players_roster: Record<string, UserTeamPlayer[]>,
    rerolls: number,
    fan_factor: number,
    cheerleaders?: number,
    coach_assistant?: number,
    logo?: string,
}