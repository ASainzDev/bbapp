import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RosterButtonComponent } from './roster-button/roster-button.component';
import type { TeamIdentifiers } from '../../../shared/models/team-identifiers.model';
import teamRosters from '../../../shared/dictionaries/team-rosters.dictionary';
import { RosterViewComponent } from '../../../features/roster-view/roster-view.component';

@Component({
  imports: [RosterButtonComponent, RouterOutlet, RosterViewComponent],
  selector: 'app-roster-selector-page',
  styleUrl: './roster-selector.page.css',
  templateUrl: './roster-selector.page.html',
})
export class RosterSelectorPage {
  readonly teams: TeamIdentifiers[] = Object.values(teamRosters);

  creationMode = signal(false)
  
  readonly selectedRoster = signal<TeamIdentifiers | undefined>(undefined)
  handleCreationMode($event: boolean) {
    this.creationMode.set($event)
  }
}
