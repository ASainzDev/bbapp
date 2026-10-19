import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { Roster } from '../../models/roster.model';
import { RosterService } from './roster.service';

describe('RosterService', () => {
  let service: RosterService;
  let httpTestingController: HttpTestingController;

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

  beforeEach(() => {
    const storage = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key),
      clear: () => storage.clear(),
    });

    TestBed.configureTestingModule({
      providers: [
        RosterService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(RosterService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    vi.unstubAllGlobals();
  });

  it('requests the roster when it is not cached and saves the response', async () => {
    const resultPromise = firstValueFrom(service.getRosterInfo('amazons'));

    const request = httpTestingController.expectOne(
      '/assets/data/teams/amazons.json',
    );
    expect(request.request.method).toBe('GET');
    request.flush(rosterFixture);

    await expect(resultPromise).resolves.toEqual(rosterFixture);
    expect(JSON.parse(localStorage.getItem('cache-amazons')!)).toEqual(
      rosterFixture,
    );
  });

  it('returns the cached roster without making an HTTP request', async () => {
    localStorage.setItem('cache-amazons', JSON.stringify(rosterFixture));

    await expect(
      firstValueFrom(service.getRosterInfo('amazons')),
    ).resolves.toEqual(rosterFixture);

    httpTestingController.expectNone('/assets/data/teams/amazons.json');
  });

  it('removes invalid cached JSON and requests a fresh roster', async () => {
    localStorage.setItem('cache-amazons', '{invalid json');

    const resultPromise = firstValueFrom(service.getRosterInfo('amazons'));
    const request = httpTestingController.expectOne(
      '/assets/data/teams/amazons.json',
    );
    request.flush(rosterFixture);

    await expect(resultPromise).resolves.toEqual(rosterFixture);
    expect(JSON.parse(localStorage.getItem('cache-amazons')!)).toEqual(
      rosterFixture,
    );
  });
});
