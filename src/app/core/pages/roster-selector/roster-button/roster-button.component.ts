import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TeamIdentifiers } from '../../../../shared/models/team-identifiers.model';

@Component({
  imports: [],
  selector: 'app-roster-button',
  styleUrl: './roster-button.component.css',
  templateUrl: './roster-button.component.html',
})
export class RosterButtonComponent {
  @Input() roster! : TeamIdentifiers;

  @Output() selectedRoster = new EventEmitter<TeamIdentifiers>


  updateSelectedRoster(): void {
    this.selectedRoster.emit(this.roster)
  }
}
