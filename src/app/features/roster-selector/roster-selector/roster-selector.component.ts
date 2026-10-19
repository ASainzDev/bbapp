import { Component } from '@angular/core';

import { TeamIdentifiers } from '../../../shared/models/team-identifiers.model';
import TeamRosters from '../../../shared/dictionaries/team-rosters.dictionary';
import { RosterButtonComponent } from '../roster-button/roster-button.component';

@Component({
  imports: [RosterButtonComponent],
  selector: 'app-roster-selector',
  styleUrl: './roster-selector.component.css',
  templateUrl: './roster-selector.component.html',
})
export class RosterSelectorComponent {
    public teams: TeamIdentifiers[] = []


  ngOnInit(): void {
    this.initTeamsCollection(); 
  }

  initTeamsCollection(): void{
    for (const team in TeamRosters) {
      this.teams.push(TeamRosters[team])
    }
  }
}
