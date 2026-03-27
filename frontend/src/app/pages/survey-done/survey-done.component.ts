import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-survey-done',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './survey-done.component.html',
})
export class SurveyDoneComponent {
  id = '';

  constructor(private route: ActivatedRoute) {
    this.id = this.route.snapshot.paramMap.get('id') || '';
  }
}
