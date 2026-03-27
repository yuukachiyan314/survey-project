import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SurveyService } from '../../data/survey.service';
import { QuestionnaireDto } from '../../models/questionnaire.dto';

@Component({
  selector: 'app-survey-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './survey-list.component.html',
})
export class SurveyListComponent implements OnInit {
  surveys: QuestionnaireDto[] = [];

  constructor(private surveyService: SurveyService) {}

  ngOnInit(): void {
    this.surveyService.getPublishedQuestionnaires().subscribe((list) => {
      this.surveys = list;
    });
  }

  isClosed(s: QuestionnaireDto): boolean {
    const now = new Date();
    // endTime 是字串，轉成 Date 比較
    return new Date(s.endTime) < now;
  }
}

// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterLink } from '@angular/router';
// import { SurveyService, Survey } from '../../data/survey.service';

// @Component({
//   selector: 'app-survey-list',
//   standalone: true,
//   imports: [CommonModule, RouterLink],
//   templateUrl: './survey-list.component.html',
// })
// export class SurveyListComponent {
//   surveys: Survey[] = [];

//   constructor(private surveyService: SurveyService) {
//     this.surveys = this.surveyService.getSurveys();
//   }

//   isClosed(s: Survey): boolean {
//     const today = new Date().toISOString().slice(0, 10);
//     if (today > s.endDate) {
//       return true;
//     } else {
//       return false;
//     }
//   }
// }
