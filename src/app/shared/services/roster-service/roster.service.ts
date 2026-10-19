import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Roster } from '../../models/roster.model';

@Service()
export class RosterService {
    private httpService = inject(HttpClient)

    public getRosterInfo(team: string) : Observable<Roster> {
        const teamLocalUrl = `/assets/data/teams/${team}.json`
        return this.httpService.get<Roster>(teamLocalUrl);
    }
}
