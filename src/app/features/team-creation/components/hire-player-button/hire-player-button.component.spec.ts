import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HirePlayerButtonComponent } from './hire-player-button.component';

describe('HirePlayerButtonComponent', () => {
  let component: HirePlayerButtonComponent;
  let fixture: ComponentFixture<HirePlayerButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HirePlayerButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HirePlayerButtonComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
