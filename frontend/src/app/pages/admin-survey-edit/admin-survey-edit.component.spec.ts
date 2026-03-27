import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSurveyEditComponent } from './admin-survey-edit.component';

describe('AdminSurveyEditComponent', () => {
  let component: AdminSurveyEditComponent;
  let fixture: ComponentFixture<AdminSurveyEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSurveyEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSurveyEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
