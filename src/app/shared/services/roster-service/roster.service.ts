import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Roster } from '../../models/roster.model';

@Service()
export class RosterService {
    private httpService = inject(HttpClient)

    public getRosterInfo(team: string) : Observable<Roster> {
        const teamKey = `cache-${team}`
        const storedRoster = localStorage.getItem(teamKey)

        if(storedRoster){
            try {
                return of(JSON.parse(storedRoster))
            }catch{
                localStorage.removeItem(teamKey)
            }
        }

        const teamLocalUrl = `/assets/data/teams/${team}.json`
        
        return this.httpService.get<Roster>(teamLocalUrl).pipe(
            tap(roster => {
                localStorage.setItem(teamKey,JSON.stringify(roster))
            })
        );
    }
}
