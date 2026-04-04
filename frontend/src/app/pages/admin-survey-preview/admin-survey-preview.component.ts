import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SurveyService } from '../../data/survey.service'; // 依你實際路徑調整
import { QuestionnaireFullDto } from '../../models/questionnaire.dto'; // 依你實際路徑調整

@Component({
  selector: 'app-admin-survey-preview',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-survey-preview.component.html',
})
export class AdminSurveyPreviewComponent implements OnInit {
  id!: number;
  loading = true;
  full?: QuestionnaireFullDto;

  constructor(
    private route: ActivatedRoute,
    private surveyService: SurveyService,
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.surveyService.getQuestionnaireFull(this.id).subscribe({
      next: (f) => {
        this.full = f;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert('預覽讀取失敗');
      },
    });
  }
}
