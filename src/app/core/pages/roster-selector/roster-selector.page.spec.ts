import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { Roster } from '../../../shared/models/roster.model';
import { RosterService } from '../../../shared/services/roster-service/roster.service';
import { RosterSelectorPage } from './roster-selector.page';

describe('RosterSelectorPage', () => {
  const rosterFixture: Roster = {
    equipo: 'Roster de prueba',
    equipos_famosos: [],
    liga: 'general',
    reglas_especiales: [],
    jugadores: [],
    segundas_oportunidades: {
      cantidad: 8,
      coste_cada_una: 50000,
    },
    apotecario: true,
    metadata: {
      pagina_pdf: 1,
      pagina_txt: 1,
      pagina_impresa: 1,
      validado: true,
      faqs_revisadas: true,
    },
  };

  let rosterServiceMock: { getRosterInfo: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    rosterServiceMock = {
      getRosterInfo: vi.fn().mockReturnValue(of(rosterFixture)),
    };

    await TestBed.configureTestingModule({
      imports: [RosterSelectorPage],
      providers: [
        provideRouter([]),
        { provide: RosterService, useValue: rosterServiceMock },
      ],
    }).compileComponents();
  });

  it('selects a roster and passes its ID to the roster view', async () => {
    const fixture = TestBed.createComponent(RosterSelectorPage);
    const page = fixture.componentInstance;
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll(
      'app-roster-button button',
    ) as NodeListOf<HTMLButtonElement>;
    expect(buttons.length).toBe(page.teams.length);

    buttons[0].click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(page.selectedRoster()).toEqual(page.teams[0]);
    expect(rosterServiceMock.getRosterInfo).toHaveBeenCalledWith(
      page.teams[0].id,
    );
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'Roster de prueba',
    );
  });
});
