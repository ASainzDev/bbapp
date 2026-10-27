import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RosterButtonComponent } from './roster-button/roster-button.component';
import type { TeamIdentifiers } from '../../../shared/models/team-identifiers.model';
import teamRosters from '../../../shared/dictionaries/team-rosters.dictionary';
import { RosterViewComponent } from '../../../features/roster-view/roster-view.component';
import { Roster } from '../../../shared/models/roster.model';
import { TeamCreationComponent } from '../../../features/team-creation/team-creation/team-creation.component';

@Component({
  imports: [RosterButtonComponent, RouterOutlet, RosterViewComponent, TeamCreationComponent],
  selector: 'app-roster-selector-page',
  styleUrl: './roster-selector.page.css',
  templateUrl: './roster-selector.page.html',
})
export class RosterSelectorPage {
  readonly teams: TeamIdentifiers[] = Object.values(teamRosters);
  
  creationMode = signal(false);
  
  selectedRoster = signal<TeamIdentifiers | undefined>(undefined);

  userRosterTemplate = signal<Roster | undefined>(undefined);
  
  handleCreationMode($event: boolean): void {
    this.creationMode.set($event)
  }
  
  handleRosterReset($event: undefined): void {
    this.selectedRoster.set($event)
  }

  handleCreationSelectRoster($event: Roster): void {
    this.selectedRoster.set(undefined);
    this.userRosterTemplate.set($event);
  }
}
