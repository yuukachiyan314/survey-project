import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SurveyService, Survey } from '../../data/survey.service';

@Component({
  selector: 'app-admin-survey-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-survey-list.component.html',
})
export class AdminSurveyListComponent {
  surveys: Survey[] = [];

  constructor(private surveyService: SurveyService) {
    this.reload();
  }

  reload() {
    this.surveys = this.surveyService.getSurveys();
  }

  remove(id: string) {
    if (!confirm('確定要刪除這份問卷？')) return;
    this.surveyService.deleteSurvey(id);
    this.reload();
  }
}
