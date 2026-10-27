import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Jugador } from '../../../../shared/models/roster.model';

@Component({
  imports: [],
  selector: 'app-hire-player-button',
  styleUrl: './hire-player-button.component.css',
  templateUrl: './hire-player-button.component.html',
})
export class HirePlayerButtonComponent {
  @Input() player! : Pick<Jugador, "nombre" | "cantidad" | "coste">
  
  @Input() atLimit! : boolean;

  @Output() playerHired: EventEmitter<string> = new EventEmitter;
  
  hirePlayer(playerName: string) {
    this.playerHired.emit(playerName);
  }
}
