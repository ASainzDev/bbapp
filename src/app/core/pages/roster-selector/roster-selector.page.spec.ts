import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RosterSelectorPage } from './roster-selector.page';

describe('RosterSelectorPage', () => {
  let component: RosterSelectorPage;
  let fixture: ComponentFixture<RosterSelectorPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RosterSelectorPage],
    }).compileComponents();

    fixture = TestBed.createComponent(RosterSelectorPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
