import { Component, computed, EventEmitter, inject, input, Output, Signal } from '@angular/core';
import { TeamIdentifiers } from '../../shared/models/team-identifiers.model';
import { rxResource } from '@angular/core/rxjs-interop';
import { RosterService } from '../../shared/services/roster-service/roster.service';
import { Jugador } from '../../shared/models/roster.model';


type PlayerColumn = {
  key: keyof Jugador;
  label: string;
}
@Component({
  imports: [],
  selector: 'app-roster-view',
  styleUrl: './roster-view.component.css',
  templateUrl: './roster-view.component.html',
})
export class RosterViewComponent {
  readonly selectedRoster = input.required<TeamIdentifiers>();
  
  readonly tableColumns: Signal<Jugador[] | undefined> = computed(() => this.roster.value()?.jugadores)
  
  readonly columnsHeaders: PlayerColumn[] = [
    { key: 'nombre', label:'Jugador'},
    { key: 'cantidad', label:'Máximo'},
    { key: 'posicion', label:'Posición'},
    { key: 'raza', label: 'Raza'},
    { key: 'coste', label:'Monedas'},
    { key: 'mv', label: 'Movimiento'},
    { key: 'fu', label:'Fuerza'},
    { key: 'ag', label:'Agilidad'},
    { key: 'ps', label:'Pase'},
    { key: 'ar', label:'Armadura'},
    { key: 'habilidades_y_rasgos', label:'Habilidades'},
    { key: 'habilidades_primarias', label:'Grupos Primarias'},
    { key: 'habilidades_secundarias', label:'Grupos Secundarias'}
  ];


  private rosterService = inject(RosterService)

  @Output() creation: EventEmitter<boolean> = new EventEmitter;
  
  readonly roster = rxResource({
    params: () => ({ id: this.selectedRoster().id }),
    stream: ({ params }) => this.rosterService.getRosterInfo(params.id),
  });
  
  navigateToCreation() {
    this.creation.emit(true)
  }
  
}
