import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SurveyService } from '../../data/survey.service';
import {
  QuestionnaireFullDto,
  QuestionDto,
} from '../../models/questionnaire.dto';

// answers：single=number, multiple=number[], text=string
type AnswerValue = number | number[] | string;

@Component({
  selector: 'app-survey-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './survey-form.component.html',
})
export class SurveyFormComponent {
  survey?: QuestionnaireFullDto;
  answers: Record<string, AnswerValue> = {};
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private surveyService: SurveyService,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isFinite(id) || id <= 0) {
      this.loading = false;
      return;
    }

    this.surveyService.getQuestionnaireFull(id).subscribe({
      next: (res: QuestionnaireFullDto) => {
        this.survey = res;
        // ✅ 題目排序
        this.survey.questions.sort((a, b) => a.sortOrder - b.sortOrder);
        // ✅ 每題的選項排序
        this.survey.questions.forEach((q) =>
          q.options.sort((a, b) => a.sortOrder - b.sortOrder),
        );
        this.loading = false;

        // 還原暫存
        const raw = localStorage.getItem(this.storageKey(String(res.id)));
        if (raw) {
          try {
            this.answers = JSON.parse(raw);
          } catch {}
        }
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.survey = undefined;
      },
    });
  }

  private storageKey(surveyId: string) {
    return `answers:${surveyId}`;
  }

  isChecked(q: QuestionDto, optionId: number): boolean {
    const v = this.answers[String(q.id)];
    return Array.isArray(v) ? v.includes(optionId) : false;
  }

  toggleCheckbox(q: QuestionDto, optionId: number, checked: boolean) {
    const key = String(q.id);
    const current = this.answers[key];
    const arr = Array.isArray(current) ? ([...current] as number[]) : [];

    if (checked) {
      if (!arr.includes(optionId)) arr.push(optionId);
    } else {
      const idx = arr.indexOf(optionId);
      if (idx >= 0) arr.splice(idx, 1);
    }
    this.answers[key] = arr;
  }

  private normalizeAnswersBeforeSave() {
    if (!this.survey) return;

    for (const q of this.survey.questions) {
      const key = String(q.id);
      const v = this.answers[key];

      if (q.questionType === 'single') {
        // radio 很常拿到字串 "1"
        if (typeof v === 'string') this.answers[key] = Number(v);
      }

      if (q.questionType === 'multiple') {
        // 保險：如果混到字串陣列，轉成 number[]
        if (Array.isArray(v)) this.answers[key] = v.map((x) => Number(x));
      }

      if (q.questionType === 'text') {
        // 保險：不是字串就清掉
        if (v != null && typeof v !== 'string') this.answers[key] = String(v);
      }
    }
  }

  goConfirm() {
    if (!this.survey) return;
    this.normalizeAnswersBeforeSave();
    localStorage.setItem(
      this.storageKey(String(this.survey.id)),
      JSON.stringify(this.answers),
    );

    this.router.navigate(['/surveys', this.survey.id, 'confirm']);
  }
}

// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ActivatedRoute, Router, RouterLink } from '@angular/router';
// import { FormsModule } from '@angular/forms';

// import {
//   SurveyService,
//   Survey,
//   Question,
//   Option,
// } from '../../data/survey.service';

// type AnswerValue = string | string[];

// @Component({
//   selector: 'app-survey-form',
//   standalone: true,
//   imports: [CommonModule, FormsModule, RouterLink],
//   templateUrl: './survey-form.component.html',
// })
// export class SurveyFormComponent {
//   survey?: Survey;
//   answers: Record<string, AnswerValue> = {};

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private surveyService: SurveyService,
//   ) {
//     const id = this.route.snapshot.paramMap.get('id') || '';
//     this.survey = this.surveyService.getSurveyById(id);

//     // 若有暫存，載入暫存（同一份問卷）
//     const raw = localStorage.getItem(this.storageKey(id));
//     if (raw) {
//       try {
//         this.answers = JSON.parse(raw);
//       } catch {}
//     }
//   }

//   private storageKey(surveyId: string) {
//     return `answers:${surveyId}`;
//   }

//   isChecked(q: Question, optionId: string): boolean {
//     const v = this.answers[q.id];
//     return Array.isArray(v) ? v.includes(optionId) : false;
//   }

//   toggleCheckbox(q: Question, optionId: string, checked: boolean) {
//     const current = this.answers[q.id];
//     const arr = Array.isArray(current) ? [...current] : [];

//     if (checked) {
//       if (!arr.includes(optionId)) arr.push(optionId);
//     } else {
//       const idx = arr.indexOf(optionId);
//       if (idx >= 0) arr.splice(idx, 1);
//     }
//     this.answers[q.id] = arr;
//   }

//   goConfirm() {
//     if (!this.survey) return;
//     localStorage.setItem(
//       this.storageKey(this.survey.id),
//       JSON.stringify(this.answers),
//     );
//     this.router.navigate(['/surveys', this.survey.id, 'confirm']);
//   }
// }
