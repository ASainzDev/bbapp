import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Roster } from '../../shared/models/roster.model';
import { TeamIdentifiers } from '../../shared/models/team-identifiers.model';
import { RosterService } from '../../shared/services/roster-service/roster.service';
import { RosterViewComponent } from './roster-view.component';

describe('RosterViewComponent', () => {
  let fixture: ComponentFixture<RosterViewComponent>;
  let rosterServiceMock: { getRosterInfo: ReturnType<typeof vi.fn> };

  const selectedTeam: TeamIdentifiers = {
    id: 'amazons',
    name: 'Amazonas',
  };

  const rosterFixture: Roster = {
    equipo: 'Amazonas',
    equipos_famosos: ['Amazons'],
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

  beforeEach(async () => {
    rosterServiceMock = {
      getRosterInfo: vi.fn().mockReturnValue(of(rosterFixture)),
    };

    await TestBed.configureTestingModule({
      imports: [RosterViewComponent],
      providers: [{ provide: RosterService, useValue: rosterServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(RosterViewComponent);
    fixture.componentRef.setInput('selectedRoster', selectedTeam);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('loads the selected roster and renders its data', () => {
    expect(rosterServiceMock.getRosterInfo).toHaveBeenCalledWith('amazons');

    const renderedText = (fixture.nativeElement as HTMLElement).textContent;
    expect(renderedText).toContain('Amazonas');
    expect(renderedText).toContain('Amazons');
  });
});
