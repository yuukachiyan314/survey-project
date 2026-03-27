import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { QuestionType } from '../../models/questionnaire.dto';
import { SurveyService, Survey } from '../../data/survey.service';

@Component({
  selector: 'app-admin-survey-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-survey-edit.component.html',
})
export class AdminSurveyEditComponent {
  isNew = true;

  // 基本資料
  id = '';
  title = '';
  description = '';
  startDate = '';
  endDate = '';

  // 先做 1 題（能交）
  qText = '';
  qType: QuestionType = 'single';

  // 選項（單選/複選才用）
  op1 = '選項1';
  op2 = '選項2';
  op3 = '選項3';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private surveyService: SurveyService,
  ) {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      // edit
      this.isNew = false;
      const s = this.surveyService.getSurveyById(id);
      if (s) {
        this.id = s.id;
        this.title = s.title;
        this.description = s.description;
        this.startDate = s.startDate;
        this.endDate = s.endDate;

        const q = s.questions[0];
        if (q) {
          this.qText = q.text;
          this.qType = q.type;

          if (q.options && q.options.length > 0)
            this.op1 = q.options[0].text ?? this.op1;
          if (q.options && q.options.length > 1)
            this.op2 = q.options[1].text ?? this.op2;
          if (q.options && q.options.length > 2)
            this.op3 = q.options[2].text ?? this.op3;
        }
      }
    } else {
      // new
      this.isNew = true;
      this.id = `s${Date.now()}`; // 簡單產生一個不重複 id
      this.title = '';
      this.description = '';
      this.startDate = new Date().toISOString().slice(0, 10);
      this.endDate = '2026-12-31';
      this.qText = '';
      this.qType = 'single';
    }
  }

  save() {
    // 最小驗證
    if (!this.title.trim()) {
      alert('請填問卷標題');
      return;
    }
    if (!this.startDate || !this.endDate) {
      alert('請填開始/結束日期');
      return;
    }
    if (!this.qText.trim()) {
      alert('請填第一題題目');
      return;
    }

    const survey: Survey = {
      id: this.id,
      title: this.title.trim(),
      description: this.description.trim(),
      startDate: this.startDate,
      endDate: this.endDate,
      questions: [this.buildFirstQuestion()],
    };

    this.surveyService.upsertSurvey(survey);
    this.router.navigate(['/admin/surveys']);
  }

  private buildFirstQuestion() {
    if (this.qType === 'text') {
      return { id: 'q1', text: this.qText.trim(), type: 'text' as const };
    }
    return {
      id: 'q1',
      text: this.qText.trim(),
      type: this.qType,
      options: [
        { id: 'o1', text: this.op1.trim() || '選項1' },
        { id: 'o2', text: this.op2.trim() || '選項2' },
        { id: 'o3', text: this.op3.trim() || '選項3' },
      ],
    };
  }
}
