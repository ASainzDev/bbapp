import { Component, computed, inject, input, OnChanges, Signal, SimpleChanges } from '@angular/core';
import { TeamIdentifiers } from '../../shared/models/team-identifiers.model';
import { rxResource } from '@angular/core/rxjs-interop';
import { RosterService } from '../../shared/services/roster-service/roster.service';
import { Jugador } from '../../shared/models/roster.model';

@Component({
  imports: [],
  selector: 'app-roster-view',
  styleUrl: './roster-view.component.css',
  templateUrl: './roster-view.component.html',
})
export class RosterViewComponent{
  readonly selectedRoster = input.required<TeamIdentifiers>();

  readonly tableColumns: Signal<Jugador[] | undefined> = computed(() => this.roster.value()?.jugadores)

  readonly columnsHeaders: (keyof Jugador)[] = [
  'nombre',
  'cantidad',
  'posicion',
  'raza',
  'coste',
  'mv',
  'fu',
  'ag',
  'ps',
  'ar',
  'habilidades_y_rasgos',
  'habilidades_primarias',
  'habilidades_secundarias',
];

  private rosterService = inject(RosterService)

  readonly roster = rxResource({
    params: () => ({ id: this.selectedRoster().id}),
    stream: ({ params }) => this.rosterService.getRosterInfo(params.id), 
  });

}
