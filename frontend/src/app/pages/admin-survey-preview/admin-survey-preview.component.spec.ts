import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSurveyPreviewComponent } from './admin-survey-preview.component';

describe('AdminSurveyPreviewComponent', () => {
  let component: AdminSurveyPreviewComponent;
  let fixture: ComponentFixture<AdminSurveyPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSurveyPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSurveyPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
