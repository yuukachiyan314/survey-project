import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyDoneComponent } from './survey-done.component';

describe('SurveyDoneComponent', () => {
  let component: SurveyDoneComponent;
  let fixture: ComponentFixture<SurveyDoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyDoneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
