import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { SurveyService } from '../../data/survey.service';
import {
  QuestionnaireFullDto,
  QuestionDto,
} from '../../models/questionnaire.dto';

// survey-form 那邊存的 answers：single=number, multiple=number[], text=string
type AnswerValue = number | number[] | string;

@Component({
  selector: 'app-survey-confirm',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './survey-confirm.component.html',
})
export class SurveyConfirmComponent {
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

    // 先讀 answers（沒有也行，畫面會顯示未填）
    const raw = localStorage.getItem(this.storageKey(String(id)));
    if (raw) {
      try {
        this.answers = JSON.parse(raw);
      } catch {}
    }

    // 再打 /full 拿題目與選項文字
    this.surveyService.getQuestionnaireFull(id).subscribe({
      next: (res) => {
        this.survey = res;

        // 排序（保險）
        this.survey.questions.sort((a, b) => a.sortOrder - b.sortOrder);
        this.survey.questions.forEach((q) =>
          q.options.sort((a, b) => a.sortOrder - b.sortOrder),
        );

        this.loading = false;
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

  private optionText(q: QuestionDto, optionId: number) {
    return (
      q.options.find((o) => o.id === optionId)?.optionText ?? String(optionId)
    );
  }

  formatAnswer(q: QuestionDto): string {
    const v = this.answers[String(q.id)];
    if (v == null) return '(未填)';

    if (q.questionType === 'text') {
      const s = String(v).trim();
      return s ? s : '(未填)';
    }

    if (q.questionType === 'single') {
      const id = typeof v === 'number' ? v : Number(v);
      if (!Number.isFinite(id)) return '(未填)';
      return this.optionText(q, id);
    }

    // multiple
    if (Array.isArray(v) && v.length > 0) {
      const ids = v.map((x) => Number(x)).filter((n) => Number.isFinite(n));
      return ids.length
        ? ids.map((id) => this.optionText(q, id)).join('、')
        : '(未填)';
    }

    return '(未填)';
  }

  backEdit() {
    if (!this.survey) return;
    this.router.navigate(['/surveys', this.survey.id]);
  }

  submit() {
    if (!this.survey) return;

    // 先組 payload（之後接後端 POST 就用這包）
    const payload = {
      questionnaireId: this.survey.id,
      submittedAt: new Date().toISOString(),
      answers: this.survey.questions.map((q) => {
        const v = this.answers[String(q.id)];

        if (q.questionType === 'text') {
          return {
            questionId: q.id,
            optionIds: [],
            text: (v ?? '').toString().trim(),
          };
        }

        if (q.questionType === 'single') {
          const id = v == null ? null : Number(v);
          return {
            questionId: q.id,
            optionIds: id && Number.isFinite(id) ? [id] : [],
            text: null,
          };
        }

        // multiple
        const arr = Array.isArray(v) ? v : [];
        const ids = arr.map((x) => Number(x)).filter((n) => Number.isFinite(n));
        return { questionId: q.id, optionIds: ids, text: null };
      }),
    };

    // ✅ 後端 DTO 要的 body（questionnaireId 在 URL，不放 body）
const body = {
  respondentName: null,
  submittedAt: new Date().toISOString(), // 後端如果用 LocalDateTime 會卡就先拿掉這行
  answers: payload.answers,              // 你上面 map 出來那個 answers 陣列
};

this.surveyService.submitResponse(this.survey.id, body).subscribe({
  next: (res) => {
    console.log('POST OK:', res); // 會看到 {responseId: ...}
    localStorage.removeItem(`answers:${this.survey!.id}`);
    this.router.navigate(['/surveys', this.survey!.id, 'done']);
  },
  error: (err) => {
    console.error('POST FAIL:', err);
    alert('送出失敗，去看後端 console 紅字');
  },
});
  }
}

// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ActivatedRoute, Router, RouterLink } from '@angular/router';

// import { SurveyService, Survey, Question } from '../../data/survey.service';

// type AnswerValue = string | string[];

// @Component({
//   selector: 'app-survey-confirm',
//   standalone: true,
//   imports: [CommonModule, RouterLink],
//   templateUrl: './survey-confirm.component.html',
// })
// export class SurveyConfirmComponent {
//   survey?: Survey;
//   answers: Record<string, AnswerValue> = {};

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private surveyService: SurveyService,
//   ) {
//     const id = this.route.snapshot.paramMap.get('id') || '';
//     this.survey = this.surveyService.getSurveyById(id);

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

//   formatAnswer(q: Question): string {
//     const v = this.answers[q.id];
//     if (v == null) return '(未填)';

//     if (q.type === 'text') {
//       return String(v).trim() ? String(v) : '(未填)';
//     }

//     if (!q.options) return '(未填)';

//     const optionText = (id: string) =>
//       q.options!.find((o) => o.id === id)?.text || id;

//     if (q.type === 'single') {
//       return typeof v === 'string' ? optionText(v) : '(未填)';
//     }

//     // multiple
//     if (Array.isArray(v) && v.length > 0) {
//       return v.map(optionText).join('、');
//     }
//     return '(未填)';
//   }

//   backEdit() {
//     if (!this.survey) return;
//     this.router.navigate(['/surveys', this.survey.id]);
//   }

//   submit() {
//     if (!this.survey) return;

//     const payload = {
//       surveyId: this.survey.id,
//       submittedAt: new Date().toISOString(),
//       answers: this.survey.questions.map((q) => ({
//         questionId: q.id,
//         value: this.answers[q.id] ?? null,
//       })),
//     };

//     //  回傳＝先存到 localStorage 當假 DB
//     const key = `responses:${this.survey.id}`;
//     const raw = localStorage.getItem(key);
//     const list = raw ? JSON.parse(raw) : [];
//     list.push(payload);
//     localStorage.setItem(key, JSON.stringify(list));

//     // 原本做的
//     console.log('SUBMIT PAYLOAD:', payload);
//     localStorage.removeItem(`answers:${this.survey.id}`);

//     this.router.navigate(['/surveys', this.survey.id, 'done']);
//   }
// }
