import { Component, inject, input } from '@angular/core';
import { Roster } from '../../../shared/models/roster.model';

@Component({
  imports: [],
  selector: 'app-team-creation',
  styleUrl: './team-creation.component.css',
  templateUrl: './team-creation.component.html',
})
export class TeamCreationComponent {

  userSelectedRosterTemplate = input.required<Roster>;
}
