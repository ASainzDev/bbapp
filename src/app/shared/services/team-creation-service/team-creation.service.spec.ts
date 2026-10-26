import { TestBed } from '@angular/core/testing';
import { TeamCreationService } from './team-creation.service';

describe('TeamCreationService', () => {
  let service: TeamCreationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamCreationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
