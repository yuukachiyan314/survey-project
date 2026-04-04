import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuestionnaireDto } from '../models/questionnaire.dto';

export interface AppResponse<T> {
  code: number;
  message: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private baseUrl = 'http://localhost:8080/api/admin/questionnaires';

  constructor(private http: HttpClient) {}

  listQuestionnaires(): Observable<QuestionnaireDto[]> {
    return this.http.get<QuestionnaireDto[]>(this.baseUrl);
  }

  getQuestionnaire(id: number): Observable<QuestionnaireDto> {
    return this.http.get<QuestionnaireDto>(`${this.baseUrl}/${id}`);
  }

  createQuestionnaire(
    payload: Partial<QuestionnaireDto>,
  ): Observable<QuestionnaireDto> {
    return this.http.post<QuestionnaireDto>(this.baseUrl, payload);
  }

  updateQuestionnaire(
    id: number,
    payload: Partial<QuestionnaireDto>,
  ): Observable<QuestionnaireDto> {
    return this.http.put<QuestionnaireDto>(`${this.baseUrl}/${id}`, payload);
  }

  deleteQuestionnaire(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // ✅ 管理者整包新增（含題目/選項，回 AppResponse）
  createFullQuestionnaire(payload: any): Observable<AppResponse<any>> {
    return this.http.post<AppResponse<any>>(`${this.baseUrl}/full`, payload);
  }
}
