import { Service } from '@angular/core';
import { Jugador, Roster } from '../../models/roster.model';

type Limits = {
    maxNumber: number,
    price: number
}

@Service()
export class TeamCreationService {
    private teamTemplate: Roster | undefined = undefined;

    private teamPositionalLimits: Record<string, Limits> = {}

    setTeamTemplate(roster: Roster): void{
        this.teamTemplate = roster

        this.loadLimits(roster.jugadores)
    }

    private loadLimits(positionals : Jugador[]): void{
        this.teamPositionalLimits = {}
        for(const jugador of positionals){
            const limit: Limits = {
                'maxNumber' : jugador["cantidad"],
                'price' : jugador["coste"]
            }
            this.teamPositionalLimits[jugador["nombre"]] = limit
        }
    }
}
