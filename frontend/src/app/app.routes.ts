import { Routes } from '@angular/router';

import { SurveyListComponent } from './pages/survey-list/survey-list.component';
import { SurveyFormComponent } from './pages/survey-form/survey-form.component';
import { SurveyConfirmComponent } from './pages/survey-confirm/survey-confirm.component';
import { SurveyDoneComponent } from './pages/survey-done/survey-done.component';
import { SurveyResultsComponent } from './pages/survey-results/survey-results.component';
import { AdminSurveyListComponent } from './pages/admin-survey-list/admin-survey-list.component';
import { AdminSurveyEditComponent } from './pages/admin-survey-edit/admin-survey-edit.component';
import { AdminSurveyPreviewComponent } from './pages/admin-survey-preview/admin-survey-preview.component';

export const routes: Routes = [
  { path: '', redirectTo: 'surveys', pathMatch: 'full' },
  { path: 'surveys', component: SurveyListComponent },
  { path: 'surveys/:id', component: SurveyFormComponent },
  { path: 'surveys/:id/confirm', component: SurveyConfirmComponent },
  { path: 'surveys/:id/done', component: SurveyDoneComponent },
  { path: 'surveys/:id/results', component: SurveyResultsComponent },
  { path: 'admin/surveys', component: AdminSurveyListComponent },
  { path: 'admin/surveys/new', component: AdminSurveyEditComponent },
  { path: 'admin/surveys/:id/edit', component: AdminSurveyEditComponent },
  { path: 'admin/surveys/:id/preview', component: AdminSurveyPreviewComponent },
];
