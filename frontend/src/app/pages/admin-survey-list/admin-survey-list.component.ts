import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { QuestionnaireDto } from '../../models/questionnaire.dto'; // 依你的路徑調整
import { AdminService } from '../../data/admin.service';

@Component({
  selector: 'app-admin-survey-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-survey-list.component.html',
})
export class AdminSurveyListComponent implements OnInit {
  surveys: QuestionnaireDto[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.reload();
  }

  reload() {
    this.adminService.listQuestionnaires().subscribe({
      next: (list) => (this.surveys = list),
      error: () => alert('後端讀取失敗，確認後端/MySQL是否有開'),
    });
  }

  remove(id: number) {
    if (!confirm('確定要刪除這份問卷？')) return;

    this.adminService.deleteQuestionnaire(id).subscribe({
      next: () => this.reload(),
      error: (err) => {
        // 後端如果做了「有回覆就禁刪」會回 400
        const msg = typeof err?.error === 'string' ? err.error : '刪除失敗';
        alert(msg);
      },
    });
  }
}
