import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';

@Service()
export class RosterService {
    private httpService = inject(HttpClient)

    public getRosterInfo(team: string) : Observable<Roster> {
        return this.httpService.get<Roster>(team);
    }
}
