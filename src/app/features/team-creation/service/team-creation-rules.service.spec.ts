import { TestBed } from '@angular/core/testing';
import { Jugador, Roster } from '../../../shared/models/roster.model';
import { UserTeamPlayer } from '../../../shared/models/user-team-player.interface';
import { UserTeamTemplate } from '../../../shared/models/user-team-template.model';
import { TEAM_CREATION_RULES } from '../domain/team-creation-rules.interface';
import { TeamCreationRulesService } from './team-creation-rules.service';

describe('TeamCreationRulesService', () => {
  let service: TeamCreationRulesService;

  const createTeam = (overrides: Partial<UserTeamTemplate> = {}): UserTeamTemplate => ({
    team_name: 'Equipo de prueba',
    gold_reserve: TEAM_CREATION_RULES.initialTeamBudget,
    team_value: 0,
    players_roster: {
      Lineman: Array.from({ length: 11 }, () => ({ playerInfo: { posicion: 'Línea' } as Jugador } as UserTeamPlayer)),
    },
    rerolls: 0,
    fan_factor: TEAM_CREATION_RULES.initialFanFactor,
    ...overrides,
  });

  const roster: Roster = {
    equipo: 'Roster de prueba',
    equipos_famosos: [],
    liga: 'Liga de prueba',
    reglas_especiales: [],
    jugadores: [],
    segundas_oportunidades: { cantidad: 8, coste_cada_una: 50_000 },
    apotecario: false,
    metadata: { pagina_pdf: 1, pagina_txt: 1, pagina_impresa: 1, validado: true, faqs_revisadas: true },
  };

  const evaluate = (team: UserTeamTemplate, selectedRoster = roster): void => {
    service.evaluateTeamRules(team, selectedRoster);
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamCreationRulesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it.each([
    [10, false],
    [11, true],
    [16, true],
    [17, false],
  ])('validates the initial team player limit: %i players -> %s', (count, expected) => {
    evaluate(createTeam({
      players_roster: {
        Lineman: Array.from({ length: count }, () => ({ playerInfo: { posicion: 'Línea' } as Jugador } as UserTeamPlayer)),
      },
    }));

    expect(service.individualValidations().numberOfPlayers).toBe(expected);
    expect(service.teamValid()).toBe(expected);
  });

  it.each([
    [0, true],
    [8, true],
    [9, false],
  ])('validates the 0–8 team reroll limit: %i rerolls -> %s', (rerolls, expected) => {
    evaluate(createTeam({ rerolls }));

    expect(service.individualValidations().numberOfRerolls).toBe(expected);
    expect(service.teamValid()).toBe(expected);
  });

  it.each([
    [1, true],
    [3, true],
    [0, false],
    [4, false],
  ])('validates dedicated fans: %i -> %s', (fanFactor, expected) => {
    evaluate(createTeam({ fan_factor: fanFactor }));

    expect(service.individualValidations().numberOfFanFactor).toBe(expected);
    expect(service.teamValid()).toBe(expected);
  });

  it.each([
    [0, true],
    [1, true],
    [2, false],
  ])('validates the 0–1 apothecary limit: %i -> %s', (apothecary, expected) => {
    evaluate(createTeam({ apothecary }));

    expect(service.individualValidations().numberOfApothecary).toBe(expected);
    expect(service.teamValid()).toBe(expected);
  });

  it.each([
    [0, true],
    [6, true],
    [7, false],
  ])('validates the 0–6 cheerleader limit: %i -> %s', (cheerleaders, expected) => {
    evaluate(createTeam({ cheerleaders }));

    expect(service.individualValidations().numberOfCheerleaders).toBe(expected);
    expect(service.teamValid()).toBe(expected);
  });

  it.each([
    [0, true],
    [6, true],
    [7, false],
  ])('validates the 0–6 assistant coach limit: %i -> %s', (coach_assistant, expected) => {
    evaluate(createTeam({ coach_assistant }));

    expect(service.individualValidations().numberOfCoachAssistant).toBe(expected);
    expect(service.teamValid()).toBe(expected);
  });

  it.each([
    [0, true],
    [TEAM_CREATION_RULES.initialTeamBudget, true],
    [-1, false],
    [TEAM_CREATION_RULES.initialTeamBudget + 1, false],
  ])('validates the team treasury: %i gold pieces -> %s', (gold_reserve, expected) => {
    evaluate(createTeam({ gold_reserve }));

    expect(service.individualValidations().goldReserveValidation).toBe(expected);
    expect(service.teamValid()).toBe(expected);
  });

  it.each([
    [1, true],
    [2, false],
  ])('enforces the one-player Grandullón group limit: %i players -> %s', (bigGuyCount, expected) => {
    const bigGuy = (position: string) => ({
      playerInfo: { posicion: position } as Jugador,
    } as UserTeamPlayer);

    const selectedRoster: Roster = {
      ...roster,
      restricciones_plantilla: [{ playerPositions: ['Grandullón'], maxPlayers: 1 }],
    };
    const players = Array.from({ length: bigGuyCount }, (_, index) => bigGuy(index === 0 ? 'Grandullón' : 'Defensor, Grandullón'));

    evaluate(createTeam({
      players_roster: {
        Lineman: Array.from({ length: 11 }, () => bigGuy('Línea')),
        BigGuys: players,
      },
    }), selectedRoster);

    expect(service.individualValidations().rosterGroupLimits).toBe(expected);
    expect(service.teamValid()).toBe(expected);
  });

  it('allows up to three players in a group when the roster limit is three', () => {
    const bigGuy = (name: string) => ({
      playerInfo: { nombre: name, posicion: 'Grandullón' } as Jugador,
    } as UserTeamPlayer);
    const selectedRoster: Roster = {
      ...roster,
      restricciones_plantilla: [{ playerPositions: ['Grandullón'], maxPlayers: 3 }],
    };

    evaluate(createTeam({
      players_roster: {
        Lineman: Array.from({ length: 11 }, () => ({ playerInfo: { posicion: 'Línea' } as Jugador } as UserTeamPlayer)),
        BigGuys: [bigGuy('Troll'), bigGuy('Ogre'), bigGuy('Minotaur')],
      },
    }), selectedRoster);
    expect(service.teamValid()).toBe(true);

    evaluate(createTeam({
      players_roster: {
        Lineman: Array.from({ length: 11 }, () => ({ playerInfo: { posicion: 'Línea' } as Jugador } as UserTeamPlayer)),
        BigGuys: [bigGuy('Troll'), bigGuy('Ogre'), bigGuy('Minotaur'), bigGuy('Rat Ogre')],
      },
    }), selectedRoster);
    expect(service.individualValidations().rosterGroupLimits).toBe(false);
    expect(service.teamValid()).toBe(false);
  });
});
