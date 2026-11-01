import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Jugador } from '../../../../shared/models/roster.model';
import { HirePlayerButtonComponent } from './hire-player-button.component';

describe('HirePlayerButtonComponent', () => {
  let component: HirePlayerButtonComponent;
  let fixture: ComponentFixture<HirePlayerButtonComponent>;

  const player: Pick<Jugador, 'nombre' | 'cantidad' | 'coste'> = {
    nombre: 'Lineman',
    cantidad: 16,
    coste: 50_000,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HirePlayerButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HirePlayerButtonComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('player', player);
    fixture.componentRef.setInput('atLimit', false);
    fixture.componentRef.setInput('canAfford', true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('disables hiring at the positional limit or when unaffordable', () => {
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(button.disabled).toBe(false);

    fixture.componentRef.setInput('atLimit', true);
    fixture.detectChanges();
    expect(button.disabled).toBe(true);

    fixture.componentRef.setInput('atLimit', false);
    fixture.componentRef.setInput('canAfford', false);
    fixture.detectChanges();
    expect(button.disabled).toBe(true);
  });

  it('emits the selected player name when hiring is enabled', () => {
    let hiredPlayer: string | undefined;
    component.playerHired.subscribe(name => hiredPlayer = name);

    (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();

    expect(hiredPlayer).toBe(player.nombre);
  });
});
