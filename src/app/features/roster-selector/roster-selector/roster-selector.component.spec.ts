import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RosterSelectorComponent } from './roster-selector.component';

describe('RosterSelectorComponent', () => {
  let component: RosterSelectorComponent;
  let fixture: ComponentFixture<RosterSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RosterSelectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RosterSelectorComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
