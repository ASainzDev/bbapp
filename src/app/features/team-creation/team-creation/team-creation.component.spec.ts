import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeamCreationComponent } from './team-creation.component';

describe('TeamCreationComponent', () => {
  let component: TeamCreationComponent;
  let fixture: ComponentFixture<TeamCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamCreationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TeamCreationComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
