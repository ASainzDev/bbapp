import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RosterButtonComponent } from './roster-button.component';
import { TeamIdentifiers } from '../../../../shared/models/team-identifiers.model';

describe('RosterButtonComponent', () => {
  let fixture: ComponentFixture<RosterButtonComponent>;
  let component: RosterButtonComponent;

  const roster: TeamIdentifiers = {
    id: 'amazons',
    name: 'Amazonas',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RosterButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RosterButtonComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('roster', roster);
    fixture.detectChanges();
  });

  it('emits the selected roster when its button is clicked', () => {
    const selectedRosterSpy = vi.fn();
    component.selectedRoster.subscribe(selectedRosterSpy);

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();

    expect(selectedRosterSpy).toHaveBeenCalledWith(roster);
  });
});
