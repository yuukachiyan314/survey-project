import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyConfirmComponent } from './survey-confirm.component';

describe('SurveyConfirmComponent', () => {
  let component: SurveyConfirmComponent;
  let fixture: ComponentFixture<SurveyConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyConfirmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
