import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimeCalendarComponent } from './prime-calendar.component';

describe('PrimeCalendarComponent', () => {
  let component: PrimeCalendarComponent;
  let fixture: ComponentFixture<PrimeCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrimeCalendarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimeCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
