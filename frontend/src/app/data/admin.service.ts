import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  QuestionnaireDto,
  QuestionnaireFullDto,
  QuestionnaireFullUpsertReq,
} from '../models/questionnaire.dto';

export interface AppResponse<T> {
  code: number;
  message: string;
  data: T | null;
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

  // ✅ 取得整包（含題目）
  getFullQuestionnaire(id: number): Observable<QuestionnaireFullDto> {
    return this.http.get<QuestionnaireFullDto>(`${this.baseUrl}/${id}/full`);
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

  // ✅ 新增整包（full-create）
  createFullQuestionnaire(
    payload: QuestionnaireFullUpsertReq,
  ): Observable<AppResponse<QuestionnaireFullDto>> {
    return this.http.post<AppResponse<QuestionnaireFullDto>>(
      `${this.baseUrl}/full`,
      payload,
    );
  }

  // ✅ 更新整包（responses=0 才會成功）
  updateFullQuestionnaire(
    id: number,
    payload: QuestionnaireFullUpsertReq,
  ): Observable<AppResponse<QuestionnaireFullDto>> {
    return this.http.put<AppResponse<QuestionnaireFullDto>>(
      `${this.baseUrl}/${id}/full`,
      payload,
    );
  }
}
