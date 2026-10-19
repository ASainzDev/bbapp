import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RosterButtonComponent } from './roster-button.component';

describe('RosterButtonComponent', () => {
  let component: RosterButtonComponent;
  let fixture: ComponentFixture<RosterButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RosterButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RosterButtonComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
