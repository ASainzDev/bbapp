import { Jugador } from "./roster.model";

export interface UserTeamPlayer {
    name?: string,
    playerInfo: Jugador,
    spp: number,
    team_value_count: number,
    stats: Stats
}

export interface Stats {
    pass_attemp: number,
    pass_success: number,
    pass_fail: number,
    interception: number,
    ko_suffered: number,
    ko_provoked: number,
    td: number,
    reception: number,
    injuries: Injuries[]
    caused_injuries: Injuries[]
}

type InjuryType = 'temporal' | 'permanent' | 'fatal'

export interface Injuries {
    type: InjuryType,
    description: string
}
