import { Component, Input } from '@angular/core';

import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-roster-button',
  styleUrl: './roster-button.component.css',
  templateUrl: './roster-button.component.html',
})
export class RosterButtonComponent {
  @Input() rosterId! : string;
  @Input() rosterName! : string;
}
