import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SurveyService } from '../../data/survey.service';
import {
  QuestionnaireFullDto,
  QuestionDto,
} from '../../models/questionnaire.dto';
import Chart from 'chart.js/auto';

interface QuestionnaireStatsDto {
  questionnaireId: number;
  totalResponses: number;
  optionCounts: { questionId: number; optionId: number; count: number }[];
  textAnswers: { questionId: number; text: string; submittedAt?: string }[];
}

@Component({
  selector: 'app-survey-results',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './survey-results.component.html',
})
export class SurveyResultsComponent {
  survey?: QuestionnaireFullDto;
  total = 0;
  loading = true;
  isAdminFrom = false;
  // questionId -> (optionId -> count)
  counts: Record<string, Record<string, number>> = {};
  // questionId -> text answers
  texts: Record<string, string[]> = {};

  constructor(
    private route: ActivatedRoute,
    private surveyService: SurveyService,
  ) {}

  ngOnInit() {
    this.isAdminFrom =
    this.route.snapshot.queryParamMap.get('from') === 'admin';

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isFinite(id) || id <= 0) {
      this.loading = false;
      return;
    }

    // 先拿 full（題目+選項文字）
    this.surveyService.getQuestionnaireFull(id).subscribe({
      next: (full) => {
        this.survey = full;

        // 排序（保險）
        this.survey.questions.sort((a, b) => a.sortOrder - b.sortOrder);
        this.survey.questions.forEach((q) =>
          q.options.sort((a, b) => a.sortOrder - b.sortOrder),
        );

        // 初始化 counts/texts（先全部 0）
        this.initContainers();

        // 再拿 stats（票數）
        this.surveyService.getQuestionnaireStats(id).subscribe({
          next: (stats: any) => {
            const s = stats as QuestionnaireStatsDto;
            this.total = s.totalResponses ?? 0;

            // 填票數
            for (const oc of s.optionCounts || []) {
              const qid = String(oc.questionId);
              const oid = String(oc.optionId);
              if (!this.counts[qid]) this.counts[qid] = {};
              this.counts[qid][oid] = oc.count;
            }

            // 填簡答
            for (const ta of s.textAnswers || []) {
              const qid = String(ta.questionId);
              if (!this.texts[qid]) this.texts[qid] = [];
              const text = (ta.text || '').trim();
              if (text) this.texts[qid].push(text);
            }
            this.loading = false;
            setTimeout(() => this.drawCharts(), 50);
          },
          error: (err) => {
            console.error(err);
            this.loading = false;
          },
        });
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  private initContainers() {
    if (!this.survey) return;
    this.counts = {};
    this.texts = {};

    for (const q of this.survey.questions) {
      const qid = String(q.id);

      if (q.questionType !== 'text') {
        this.counts[qid] = {};
        for (const op of q.options) {
          this.counts[qid][String(op.id)] = 0;
        }
      } else {
        this.texts[qid] = [];
      }
    }
  }

  optionText(q: QuestionDto, optionId: string): string {
    const oid = Number(optionId);
    return q.options.find((o) => o.id === oid)?.optionText || optionId;
  }

  optionIds(q: QuestionDto): string[] {
    return Object.keys(this.counts[String(q.id)] || {});
  }

  private charts: Chart[] = [];

  private drawCharts() {
    // 清掉舊圖（避免重繪疊在一起）
    for (const c of this.charts) c.destroy();
    this.charts = [];

    if (!this.survey) return;

    for (const q of this.survey.questions) {
      if (q.questionType === 'text') continue;

      const canvasId = 'chart-' + q.id;
      const ctx = document.getElementById(canvasId) as HTMLCanvasElement | null;
      if (!ctx) continue;

      const labels: string[] = [];
      const data: number[] = [];

      // 依 option 排序，把 count 塞進去
      for (const op of q.options) {
        labels.push(op.optionText);
        const cnt = this.counts[String(q.id)]?.[String(op.id)] ?? 0;
        data.push(cnt);
      }

      // single 用 pie，multiple 用 bar
      const chartType = q.questionType === 'single' ? 'pie' : 'bar';

      const chart = new Chart(ctx, {
        type: chartType as any,
        data: {
          labels,
          datasets: [
            {
              label: q.title,
              data,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: q.questionType === 'single' },
          },
        },
      });

      this.charts.push(chart);
    }
  }
}

// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ActivatedRoute, RouterLink } from '@angular/router';

// import { SurveyService, Survey, Question } from '../../data/survey.service';

// type AnswerValue = string | string[] | null;

// @Component({
//   selector: 'app-survey-results',
//   standalone: true,
//   imports: [CommonModule, RouterLink],
//   templateUrl: './survey-results.component.html',
// })
// export class SurveyResultsComponent {
//   survey?: Survey;
//   total = 0;

//   // questionId -> (optionId -> count)
//   counts: Record<string, Record<string, number>> = {};
//   // questionId -> text answers
//   texts: Record<string, string[]> = {};

//   constructor(
//     private route: ActivatedRoute,
//     private surveyService: SurveyService,
//   ) {
//     const id = this.route.snapshot.paramMap.get('id') || '';
//     this.survey = this.surveyService.getSurveyById(id);

//     const raw = localStorage.getItem(`responses:${id}`);
//     const responses: any[] = raw ? JSON.parse(raw) : [];
//     this.total = responses.length;

//     if (!this.survey) return;

//     // 初始化容器
//     for (const q of this.survey.questions) {
//       if (q.type !== 'text') {
//         this.counts[q.id] = {};
//         for (const op of q.options || []) {
//           this.counts[q.id][op.id] = 0;
//         }
//       } else {
//         this.texts[q.id] = [];
//       }
//     }

//     // 統計
//     for (const r of responses) {
//       for (const a of r.answers || []) {
//         const q = this.survey.questions.find((x) => x.id === a.questionId);
//         if (!q) continue;

//         const v: AnswerValue = a.value ?? null;

//         if (q.type === 'single' && typeof v === 'string') {
//           if (this.counts[q.id]?.[v] !== undefined) this.counts[q.id][v] += 1;
//         }

//         if (q.type === 'multiple' && Array.isArray(v)) {
//           for (const optionId of v) {
//             if (this.counts[q.id]?.[optionId] !== undefined)
//               this.counts[q.id][optionId] += 1;
//           }
//         }

//         if (q.type === 'text' && typeof v === 'string') {
//           const s = v.trim();
//           if (s) this.texts[q.id].push(s);
//         }
//       }
//     }
//   }

//   optionText(q: Question, optionId: string): string {
//     return q.options?.find((o) => o.id === optionId)?.text || optionId;
//   }

//   optionIds(q: Question): string[] {
//     return Object.keys(this.counts[q.id] || {});
//   }
// }
