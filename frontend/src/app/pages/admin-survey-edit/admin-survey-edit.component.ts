import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../data/admin.service';
import { QuestionnaireDto } from '../../models/questionnaire.dto';

type QuestionType = 'single' | 'multiple' | 'text';

@Component({
  selector: 'app-admin-survey-edit',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './admin-survey-edit.component.html',
})
export class AdminSurveyEditComponent implements OnInit {
  isNew = true;
  id?: number;

  title = '';
  description: string | null = null;
  isPublished = 0;

  // datetime-local（不含秒）
  startTimeInput = '';
  endTimeInput = '';

  loading = false;

  // ===== 題目設計（只用在新增 new）=====
  questions: {
    title: string;
    questionType: QuestionType;
    isRequired: number; // 0/1
    sortOrder: number;
    options: { optionText: string; sortOrder: number }[];
  }[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.isNew = false;
      this.id = Number(idParam);
      this.load();
    } else {
      this.isNew = true;

      const now = new Date();
      this.startTimeInput = this.toDatetimeLocal(now);
      this.endTimeInput = '2026-12-31T23:59';
      this.isPublished = 0;

      this.questions = [this.makeQuestion()];
    }
  }

  private makeQuestion() {
    const idx = this.questions.length + 1;
    return {
      title: '',
      questionType: 'single' as const,
      isRequired: 1,
      sortOrder: idx,
      options: [
        { optionText: '選項1', sortOrder: 1 },
        { optionText: '選項2', sortOrder: 2 },
        { optionText: '選項3', sortOrder: 3 },
      ],
    };
  }

  addQuestion() {
    this.questions.push(this.makeQuestion());
    this.reindex();
  }

  removeQuestion(i: number) {
    this.questions.splice(i, 1);
    this.reindex();
  }

  addOption(qi: number) {
    const opts = this.questions[qi].options;
    opts.push({
      optionText: `選項${opts.length + 1}`,
      sortOrder: opts.length + 1,
    });
    this.reindex();
  }

  removeOption(qi: number, oi: number) {
    this.questions[qi].options.splice(oi, 1);
    this.reindex();
  }

  onTypeChange(qi: number) {
    const q = this.questions[qi];
    if (q.questionType === 'text') {
      q.options = [];
    } else if (!q.options || q.options.length === 0) {
      q.options = [
        { optionText: '選項1', sortOrder: 1 },
        { optionText: '選項2', sortOrder: 2 },
        { optionText: '選項3', sortOrder: 3 },
      ];
    }
    this.reindex();
  }

  private reindex() {
    this.questions.forEach((q, idx) => {
      q.sortOrder = idx + 1;
      q.options?.forEach((o, j) => (o.sortOrder = j + 1));
    });
  }

  load() {
    if (!this.id) return;

    this.loading = true;
    this.adminService.getQuestionnaire(this.id).subscribe({
      next: (q) => {
        this.title = q.title ?? '';
        this.description = q.description ?? null;
        this.isPublished = Number(q.isPublished ?? 0);

        this.startTimeInput = this.stripSeconds(q.startTime);
        this.endTimeInput = this.stripSeconds(q.endTime);

        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert('讀取問卷失敗');
      },
    });
  }

  save() {
    if (!this.title.trim()) return alert('請填問卷標題');
    if (!this.startTimeInput || !this.endTimeInput)
      return alert('請填開始/結束時間');

    // ===== 新增：走 full-create（含題目）=====
    if (this.isNew) {
      if (!this.questions.length) return alert('至少要有一題');

      for (const q of this.questions) {
        if (!q.title.trim()) return alert('題目標題不能空白');
        if (
          q.questionType !== 'text' &&
          (!q.options || q.options.length === 0)
        ) {
          return alert('選擇題至少要有一個選項');
        }
        if (q.questionType !== 'text') {
          for (const o of q.options) {
            if (!o.optionText.trim()) return alert('選項文字不能空白');
          }
        }
      }

      const fullPayload = {
        title: this.title.trim(),
        description: (this.description ?? '').trim() || null,
        startTime: this.ensureSeconds(this.startTimeInput),
        endTime: this.ensureSeconds(this.endTimeInput),
        questions: this.questions.map((q) => ({
          title: q.title.trim(),
          questionType: q.questionType,
          isRequired: q.isRequired ?? 0,
          sortOrder: q.sortOrder ?? 0,
          options:
            q.questionType === 'text'
              ? []
              : q.options.map((o) => ({
                  optionText: o.optionText.trim(),
                  sortOrder: o.sortOrder ?? 0,
                })),
        })),
      };

      this.loading = true;
      this.adminService.createFullQuestionnaire(fullPayload).subscribe({
        next: (res: any) => {
          this.loading = false;
          if (res?.code !== 200) return alert(res?.message || '新增失敗');

          const newId = res?.data?.id;
          this.router.navigate(['/admin/surveys', newId, 'preview']);
        },
        error: (err: any) => {
          this.loading = false;
          const msg = typeof err?.error === 'string' ? err.error : '新增失敗';
          alert(msg);
        },
      });

      return;
    }

    // ===== 編輯：只改基本資料 =====
    const payload: Partial<QuestionnaireDto> = {
      title: this.title.trim(),
      description: (this.description ?? '').trim() || null,
      isPublished: this.isPublished,
      startTime: this.ensureSeconds(this.startTimeInput),
      endTime: this.ensureSeconds(this.endTimeInput),
    };

    this.loading = true;
    this.adminService.updateQuestionnaire(this.id!, payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/admin/surveys']);
      },
      error: () => {
        this.loading = false;
        alert('更新失敗');
      },
    });
  }

  // ===== helpers =====
  private ensureSeconds(v: string) {
    return v.length === 16 ? `${v}:00` : v;
  }

  private stripSeconds(v: string) {
    return v ? v.slice(0, 16) : '';
  }

  private toDatetimeLocal(d: Date) {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
}
