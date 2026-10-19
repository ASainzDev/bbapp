import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RosterViewPage } from './roster-view.page';

describe('RosterViewPage', () => {
  let component: RosterViewPage;
  let fixture: ComponentFixture<RosterViewPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RosterViewPage],
    }).compileComponents();

    fixture = TestBed.createComponent(RosterViewPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
