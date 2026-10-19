import { Component, inject, input } from '@angular/core';
import { TeamIdentifiers } from '../../shared/models/team-identifiers.model';
import { rxResource } from '@angular/core/rxjs-interop';
import { RosterService } from '../../shared/services/roster-service/roster.service';

@Component({
  imports: [],
  selector: 'app-roster-view',
  styleUrl: './roster-view.component.css',
  templateUrl: './roster-view.component.html',
})
export class RosterViewComponent {
  readonly selectedRoster = input.required<TeamIdentifiers>();

  private rosterService = inject(RosterService)

  readonly roster = rxResource({
    params: () => ({ id: this.selectedRoster().id}),
    stream: ({ params }) => this.rosterService.getRosterInfo(params.id), 
  });
}
