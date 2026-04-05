import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../data/admin.service';
import {
  QuestionnaireDto,
  QuestionnaireFullDto,
} from '../../models/questionnaire.dto';

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

  // ✅ 是否在「題目設計」頁
  isQuestionsMode = false;

  title = '';
  description: string | null = null;
  isPublished = 0;

  // datetime-local（不含秒）
  startTimeInput = '';
  endTimeInput = '';

  loading = false;

  // ===== 題目設計 =====
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
    const lastSeg = this.route.snapshot.url.at(-1)?.path; // 'new' | 'edit' | 'questions'

    this.isQuestionsMode = lastSeg === 'questions';

    if (idParam) {
      this.isNew = false;
      this.id = Number(idParam);

      // 基本資料一定載入
      this.loadBasic();

      // 題目設計頁：再載入 full 題目
      if (this.isQuestionsMode) {
        this.loadFullForQuestions();
      }

      return;
    }

    // new 模式
    this.isNew = true;

    const now = new Date();
    this.startTimeInput = this.toDatetimeLocal(now);
    this.endTimeInput = '2026-12-31T23:59';
    this.isPublished = 0;

    this.questions = [this.makeQuestion()];
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

  // ========= LOAD =========
  private loadBasic() {
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

  private loadFullForQuestions() {
    if (!this.id) return;

    this.loading = true;
    this.adminService.getFullQuestionnaire(this.id).subscribe({
      next: (full: any) => {
        // 基本資料
        this.title = full?.title ?? '';
        this.description = full?.description ?? null;
        this.startTimeInput = this.stripSeconds(full?.startTime);
        this.endTimeInput = this.stripSeconds(full?.endTime);

        // 題目（照後端實際 key：isRequired / sortOrder / optionText）
        this.questions = (full?.questions ?? []).map((q: any, idx: number) => ({
          title: q?.title ?? '',
          questionType: q?.questionType,
          isRequired: Number(q?.isRequired ?? 0),
          sortOrder: Number(q?.sortOrder ?? idx + 1),
          options: (q?.options ?? []).map((o: any, j: number) => ({
            optionText: o?.optionText ?? '',
            sortOrder: Number(o?.sortOrder ?? j + 1),
          })),
        }));

        this.reindex();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        alert('讀取題目失敗');
      },
    });
  }

  // ========= SAVE =========
  save(goPreview = false) {
    if (!this.title.trim()) return alert('請填問卷標題');
    if (!this.startTimeInput || !this.endTimeInput)
      return alert('請填開始/結束時間');

    // ===== 新增：走 full-create（含題目）=====
    if (this.isNew) {
      if (!this.questions.length) return alert('至少要有一題');

      for (const q of this.questions) {
        if (!q.title.trim()) return alert('題目標題不能空白');
        if (q.questionType !== 'text' && (!q.options || q.options.length === 0))
          return alert('選擇題至少要有一個選項');
        if (q.questionType !== 'text') {
          for (const o of q.options) {
            if (!o.optionText.trim()) return alert('選項文字不能空白');
          }
        }
      }

      const fullPayload = this.buildFullPayloadForQuestions();

      this.loading = true;
      this.adminService.createFullQuestionnaire(fullPayload).subscribe({
        next: (res: any) => {
          this.loading = false;
          if (res?.code !== 200) return alert(res?.message || '新增失敗');

          const newId = res?.data?.id;
          if (!newId) return this.router.navigate(['/admin/surveys']);

          if (goPreview)
            return this.router.navigate(['/admin/surveys', newId, 'preview']);
          return this.router.navigate(['/admin/surveys']);
        },
        error: (err: any) => {
          this.loading = false;
          const msg = typeof err?.error === 'string' ? err.error : '新增失敗';
          alert(msg);
        },
      });

      return;
    }

    // ===== 編輯基本資料（edit / questions 都共用）=====
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

        // ✅ 編輯模式支援「儲存並預覽」
        if (goPreview)
          return this.router.navigate(['/admin/surveys', this.id, 'preview']);

        // 如果在 questions 頁，存完不要踢回列表，留在本頁
        if (this.isQuestionsMode)
          return this.router.navigate(['/admin/surveys', this.id, 'questions']);

        return this.router.navigate(['/admin/surveys']);
      },
      error: () => {
        this.loading = false;
        alert('更新失敗');
      },
    });
  }

  saveQuestions(goPreview = true) {
    if (this.isNew) return alert('新增模式請用「儲存草稿／儲存並預覽」');
    if (!this.id) return;

    if (!this.questions.length) return alert('沒有題目可更新');

    // 題目卡控
    for (const q of this.questions) {
      if (!q.title.trim()) return alert('題目標題不能空白');
      if (q.questionType !== 'text' && (!q.options || q.options.length === 0))
        return alert('選擇題至少要有一個選項');
      if (q.questionType !== 'text') {
        for (const o of q.options) {
          if (!o.optionText.trim()) return alert('選項文字不能空白');
        }
      }
    }

    const fullPayload = this.buildFullPayloadForQuestions();

    this.loading = true;
    this.adminService.updateFullQuestionnaire(this.id!, fullPayload).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res?.code !== 200) return alert(res?.message || '更新題目失敗');

        if (goPreview)
          return this.router.navigate(['/admin/surveys', this.id, 'preview']);
        // 不預覽就留在題目頁，避免你又找不到在哪改
        return this.router.navigate(['/admin/surveys', this.id, 'questions']);
      },
      error: () => {
        this.loading = false;
        alert('更新題目失敗');
      },
    });
  }
  private buildFullPayloadForQuestions() {
    return {
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
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate(),
    )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
}
