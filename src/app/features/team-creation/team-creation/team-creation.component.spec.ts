import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Jugador, Roster } from '../../../shared/models/roster.model';
import { NavigationCacheService } from '../../../shared/services/navigation-service/navigation-cache.service';
import { UserTeamPlayer } from '../../../shared/models/user-team-player.interface';
import { UserTeamTemplate } from '../../../shared/models/user-team-template.model';
import { TeamCreationRulesService } from '../service/team-creation-rules.service';
import { TeamCreationComponent } from './team-creation.component';

describe('TeamCreationComponent', () => {
  let component: TeamCreationComponent;
  let fixture: ComponentFixture<TeamCreationComponent>;
  let navigationCacheService: NavigationCacheService;
  let teamCreationRulesService: TeamCreationRulesService;

  const lineman: Jugador = {
    nombre: 'Lineman',
    cantidad: 16,
    posicion: 'Línea',
    raza: 'Humano',
    coste: 50_000,
    mv: 6,
    fu: 3,
    ag: '3+',
    ps: '4+',
    ar: '9+',
    habilidades_y_rasgos: [],
    habilidades_primarias: ['G'],
    habilidades_secundarias: ['A'],
  };

  const roster: Roster = {
    equipo: 'Equipo de prueba',
    equipos_famosos: [],
    liga: 'Liga de prueba',
    reglas_especiales: [],
    jugadores: [lineman],
    segundas_oportunidades: { cantidad: 8, coste_cada_una: 50_000 },
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
    sessionStorage.removeItem('bbapp-provisional-team');

    await TestBed.configureTestingModule({
      imports: [TeamCreationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TeamCreationComponent);
    component = fixture.componentInstance;
    navigationCacheService = TestBed.inject(NavigationCacheService);
    teamCreationRulesService = TestBed.inject(TeamCreationRulesService);
    fixture.componentRef.setInput('userSelectedRosterTemplate', roster);
    fixture.detectChanges();
  });

  afterEach(() => {
    sessionStorage.removeItem('bbapp-provisional-team');
  });

  it('initializes and evaluates a new team as invalid until it has 11 players', () => {
    expect(component.totalPlayers()).toBe(0);
    expect(component.validationStatus()).toBe(false);
    expect(teamCreationRulesService.individualValidations().numberOfPlayers).toBe(false);
    expect(fundTeamButton().disabled).toBe(true);
  });

  it('shows the current values and validation for the roster creation rules', () => {
    const validationPanel = fixture.nativeElement.querySelector('[aria-labelledby="team-validation-title"]') as HTMLElement;

    expect(validationPanel.textContent).toContain('Jugadores: 0');
    expect(validationPanel.textContent).toContain('Segundas oportunidades: 0 / 8');
    expect(validationPanel.textContent).toContain('Factor fan: 1');
    expect(validationPanel.textContent).toContain('Apotecario: 0 / 1');
    expect(validationPanel.textContent).toContain('Animadoras: 0');
    expect(validationPanel.textContent).toContain('Ayudantes de entrenador: 0');
    expect(validationPanel.textContent).toContain('Reserva de oro: 1000000');
    expect(validationPanel.textContent).toContain('Valor del equipo actual: 0');
  });

  it('restores a provisional team and validates it on initialization', () => {
    const provisionalTeam: UserTeamTemplate = {
      team_name: 'Equipo recuperado',
      gold_reserve: 450_000,
      team_value: 550_000,
      players_roster: { Lineman: Array.from({ length: 11 }, () => ({ playerInfo: lineman } as UserTeamPlayer)) },
      rerolls: 0,
      fan_factor: 1,
    };
    navigationCacheService.cacheProvisionalTeam(provisionalTeam);

    fixture.destroy();
    fixture = TestBed.createComponent(TeamCreationComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('userSelectedRosterTemplate', roster);
    fixture.detectChanges();

    expect(component.teamData()).toEqual(provisionalTeam);
    expect(component.validationStatus()).toBe(true);
    expect(fundTeamButton().disabled).toBe(false);
  });

  it('allows founding after hiring 11 players and emits the completed team', () => {
    for (let index = 0; index < 11; index += 1) {
      component.handlePlayerHiring('Lineman');
    }
    fixture.detectChanges();

    expect(component.validationStatus()).toBe(true);
    expect(fundTeamButton().disabled).toBe(false);

    let emittedTeam: UserTeamTemplate | undefined;
    component.teamFounded.subscribe(team => emittedTeam = team);
    fundTeamButton().click();

    expect(emittedTeam).toEqual(component.teamData());
    expect(navigationCacheService.getProvisionalTeam()).toBeUndefined();
  });

  it('blocks hiring beyond 16 players in both the UI and component method', () => {
    for (let index = 0; index < 16; index += 1) {
      component.handlePlayerHiring('Lineman');
    }
    fixture.detectChanges();

    const hireButton = fixture.nativeElement.querySelector('app-hire-player-button button') as HTMLButtonElement;
    expect(component.totalPlayers()).toBe(16);
    expect(hireButton.disabled).toBe(true);

    component.handlePlayerHiring('Lineman');

    expect(component.totalPlayers()).toBe(16);
  });

  it('blocks a second Grandullón when the roster allows only one across the group', () => {
    const grandGuyOptions: Jugador[] = [
      { ...lineman, nombre: 'Ogre', posicion: 'Grandullón', cantidad: 1 },
      { ...lineman, nombre: 'Treeman', posicion: 'Defensor, Grandullón', cantidad: 1 },
    ];
    const restrictedRoster: Roster = {
      ...roster,
      jugadores: [lineman, ...grandGuyOptions],
      restricciones_plantilla: [{ playerPositions: ['Grandullón'], maxPlayers: 1 }],
    };
    fixture.componentRef.setInput('userSelectedRosterTemplate', restrictedRoster);

    component.handlePlayerHiring('Ogre');
    component.handlePlayerHiring('Treeman');

    expect(component.totalPlayers()).toBe(1);
    expect(component.teamData().players_roster['Ogre']).toHaveLength(1);
    expect(component.teamData().players_roster['Treeman']).toBeUndefined();
    expect(component.isPlayerAtLimit({ nombre: 'Treeman', cantidad: 1, coste: 50_000 })).toBe(true);

    fixture.detectChanges();
    const validationPanel = fixture.nativeElement.querySelector('[aria-labelledby="team-validation-title"]') as HTMLElement;
    expect(validationPanel.textContent).toContain('Grandullón: 1 / 1.');
  });

  it('allows exactly three Grandullones when the roster limit is three', () => {
    const grandGuyOptions: Jugador[] = ['Troll', 'Ogre', 'Minotaur', 'Rat Ogre'].map(nombre => ({
      ...lineman,
      nombre,
      posicion: 'Grandullón',
      cantidad: 1,
    }));
    const restrictedRoster: Roster = {
      ...roster,
      jugadores: [lineman, ...grandGuyOptions],
      restricciones_plantilla: [{ playerPositions: ['Grandullón'], maxPlayers: 3 }],
    };
    fixture.componentRef.setInput('userSelectedRosterTemplate', restrictedRoster);

    for (const playerName of ['Troll', 'Ogre', 'Minotaur', 'Rat Ogre']) {
      component.handlePlayerHiring(playerName);
    }

    expect(component.totalPlayers()).toBe(3);
    expect(component.teamData().players_roster['Troll']).toHaveLength(1);
    expect(component.teamData().players_roster['Ogre']).toHaveLength(1);
    expect(component.teamData().players_roster['Minotaur']).toHaveLength(1);
    expect(component.teamData().players_roster['Rat Ogre']).toBeUndefined();
  });

  it('updates reroll count, treasury and team value, and enforces the maximum of eight', () => {
    for (let index = 0; index < 8; index += 1) {
      component.increaseRerolls();
    }

    expect(component.teamData().rerolls).toBe(8);
    expect(component.teamData().gold_reserve).toBe(600_000);
    expect(component.teamData().team_value).toBe(400_000);

    component.increaseRerolls();
    expect(component.teamData().rerolls).toBe(8);

    for (let index = 0; index < 8; index += 1) {
      component.decreaseRerolls();
    }

    expect(component.teamData().rerolls).toBe(0);
    expect(component.teamData().gold_reserve).toBe(1_000_000);
    expect(component.teamData().team_value).toBe(0);
  });

  it('charges dedicated fans to the treasury but not to team value, with a maximum of three', () => {
    component.increaseFanFactor();
    component.increaseFanFactor();
    component.increaseFanFactor();

    expect(component.teamData().fan_factor).toBe(3);
    expect(component.teamData().gold_reserve).toBe(990_000);
    expect(component.teamData().team_value).toBe(0);

    component.decreaseFanFactor();
    component.decreaseFanFactor();
    component.decreaseFanFactor();

    expect(component.teamData().fan_factor).toBe(1);
    expect(component.teamData().gold_reserve).toBe(1_000_000);
  });

  it('charges for at most one apothecary and respects roster eligibility', () => {
    component.hireApothecary();
    component.hireApothecary();

    expect(component.teamData().apothecary).toBe(1);
    expect(component.teamData().gold_reserve).toBe(950_000);
    expect(component.teamData().team_value).toBe(50_000);

    fixture.componentRef.setInput('userSelectedRosterTemplate', { ...roster, apotecario: false });
    component.hireApothecary();
    expect(component.teamData().apothecary).toBe(1);
  });

  it('does not hire a player when the team cannot afford the hiring fee', () => {
    component.teamData.update(team => ({ ...team, gold_reserve: 0 }));

    component.handlePlayerHiring('Lineman');

    expect(component.totalPlayers()).toBe(0);
    expect(component.teamData().team_value).toBe(0);
  });

  it('does not emit a founded team when called directly while the team is invalid', () => {
    let emitted = false;
    component.teamFounded.subscribe(() => emitted = true);

    component.foundTeam();

    expect(emitted).toBe(false);
  });

  function fundTeamButton(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button[type="button"]:nth-of-type(2)') as HTMLButtonElement;
  }
});
