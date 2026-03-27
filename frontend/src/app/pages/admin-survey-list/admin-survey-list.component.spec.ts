import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSurveyListComponent } from './admin-survey-list.component';

describe('AdminSurveyListComponent', () => {
  let component: AdminSurveyListComponent;
  let fixture: ComponentFixture<AdminSurveyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSurveyListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSurveyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
