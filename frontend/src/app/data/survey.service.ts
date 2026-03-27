import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  QuestionnaireDto,
  QuestionnaireFullDto,
  QuestionType,
} from '../models/questionnaire.dto';





/** 舊前端假資料型別：先留著避免你其他 admin page 直接爆炸 */
export interface Option {
  id: string;
  text: string;
}
export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: Option[];
}
export interface Survey {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  questions: Question[];
}

@Injectable({ providedIn: 'root' })
export class SurveyService {
  constructor(private http: HttpClient) {}

  private baseUrl = 'http://localhost:8080/api/questionnaires';

  /** ✅ 前台：列表用 */
  getPublishedQuestionnaires(): Observable<QuestionnaireDto[]> {
    return this.http.get<QuestionnaireDto[]>(`${this.baseUrl}/published`);
  }

  /** ✅ 前台：填寫頁用 */
  getQuestionnaireFull(id: number): Observable<QuestionnaireFullDto> {
    return this.http.get<QuestionnaireFullDto>(`${this.baseUrl}/${id}/full`);
  }
  // -------------------------
  // 舊的 localStorage 假資料（先保留，不然你的 admin 頁可能還在用）
  // 之後你確認 admin 全改成打後端，再整段刪掉。
  // -------------------------

  private surveys: Survey[] = [];
  private storeKey = 'surveys';

  getSurveys(): Survey[] {
    return this.loadSurveys();
  }

  getSurveyById(id: string): Survey | undefined {
    return this.loadSurveys().find((s) => s.id === id);
  }

  loadSurveys(): Survey[] {
    const raw = localStorage.getItem(this.storeKey);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {}
    }
    // 沒資料就回空，避免又塞回假資料干擾你測 API
    localStorage.setItem(this.storeKey, JSON.stringify([]));
    return [];
  }

  saveSurveys(list: Survey[]) {
    this.surveys = list;
    localStorage.setItem(this.storeKey, JSON.stringify(list));
  }

  deleteSurvey(id: string) {
    const list = this.loadSurveys().filter((s) => s.id !== id);
    this.saveSurveys(list);
  }

  addSurvey(s: Survey) {
    const list = this.loadSurveys();
    list.push(s);
    this.saveSurveys(list);
  }

  upsertSurvey(s: Survey) {
    const list = this.loadSurveys();
    const idx = list.findIndex((x) => x.id === s.id);
    if (idx >= 0) list[idx] = s;
    else list.push(s);
    this.saveSurveys(list);
  }
  submitResponse(questionnaireId: number, payload: any) {
    return this.http.post(
      `${this.baseUrl}/${questionnaireId}/responses`,
      payload,
    );
  }

  // 統計
  getQuestionnaireStats(id: number) {
    return this.http.get(
      `http://localhost:8080/api/questionnaires/${id}/stats`,
    );
  }
}

// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { QuestionnaireDto } from '../models/questionnaire.dto';
// export type QuestionType = 'single' | 'multiple' | 'text';

// export interface Option {
//   id: string;
//   text: string;
// }
// export interface Question {
//   id: string;
//   text: string;
//   type: QuestionType;
//   options?: Option[];
// }
// export interface Survey {
//   id: string;
//   title: string;
//   description: string;
//   startDate: string;
//   endDate: string;
//   questions: Question[];
// }

// @Injectable({ providedIn: 'root' })
// export class SurveyService {
//   constructor(private http: HttpClient) {}
//   private surveys: Survey[] = [
//     {
//       id: 's1',
//       title: '飲料調查',
//       description: '喜歡的飲料',
//       startDate: '2026-02-01',
//       endDate: '2026-12-31',
//       questions: [
//         {
//           id: 'q1',
//           text: '你最常喝什麼？（單選）',
//           type: 'single',
//           options: [
//             { id: 'o1', text: '紅茶' },
//             { id: 'o2', text: '奶茶' },
//             { id: 'o3', text: '白開水' },
//           ],
//         },
//         {
//           id: 'q2',
//           text: '你會加什麼？（複選）',
//           type: 'multiple',
//           options: [
//             { id: 'o1', text: '糖' },
//             { id: 'o2', text: '冰' },
//             { id: 'o3', text: '檸檬' },
//           ],
//         },
//         { id: 'q3', text: '備註（簡答）', type: 'text' },
//       ],
//     },

//     {
//       id: 's2',
//       title: '通勤習慣小調查',
//       description: '你每天怎麼移動、花多久時間',
//       startDate: '2026-03-01',
//       endDate: '2026-12-31',
//       questions: [
//         {
//           id: 'q1',
//           text: '主要交通方式？（單選）',
//           type: 'single',
//           options: [
//             { id: 'o1', text: '捷運' },
//             { id: 'o2', text: '公車' },
//             { id: 'o3', text: '機車/汽車' },
//             { id: 'o4', text: '走路/自行車' },
//           ],
//         },
//         {
//           id: 'q2',
//           text: '通勤會做什麼？（複選）',
//           type: 'multiple',
//           options: [
//             { id: 'o1', text: '聽音樂' },
//             { id: 'o2', text: '滑手機' },
//             { id: 'o3', text: '看書/學習' },
//             { id: 'o4', text: '發呆' },
//           ],
//         },
//         { id: 'q3', text: '通勤平均多久？（簡答）', type: 'text' },
//       ],
//     },

//     {
//       id: 's3',
//       title: '課程回饋表',
//       description: '匿名回饋：節奏、難度、作業量',
//       startDate: '2026-03-01',
//       endDate: '2026-12-31',
//       questions: [
//         {
//           id: 'q1',
//           text: '課程節奏？（單選）',
//           type: 'single',
//           options: [
//             { id: 'o1', text: '太慢' },
//             { id: 'o2', text: '剛好' },
//             { id: 'o3', text: '太快' },
//           ],
//         },
//         {
//           id: 'q2',
//           text: '你希望加強哪些部分？（複選）',
//           type: 'multiple',
//           options: [
//             { id: 'o1', text: '範例更多' },
//             { id: 'o2', text: '作業講解' },
//             { id: 'o3', text: '小測驗' },
//             { id: 'o4', text: '專題拆解' },
//           ],
//         },
//         { id: 'q3', text: '其他建議（簡答）', type: 'text' },
//       ],
//     },

//     {
//       id: 's4',
//       title: '飲食習慣',
//       description: '一餐中吃最多的是什麼?',
//       startDate: '2026-03-01',
//       endDate: '2026-12-31',
//       questions: [
//         {
//           id: 'q1',
//           text: '今天吃幾餐？（單選）',
//           type: 'single',
//           options: [
//             { id: 'o1', text: '1' },
//             { id: 'o2', text: '2' },
//             { id: 'o3', text: '3' },
//             { id: 'o4', text: '3+（含點心）' },
//           ],
//         },
//         {
//           id: 'q2',
//           text: '今天有吃到哪些？（複選）',
//           type: 'multiple',
//           options: [
//             { id: 'o1', text: '蛋白質' },
//             { id: 'o2', text: '蔬菜' },
//             { id: 'o3', text: '澱粉' },
//             { id: 'o4', text: '含糖飲料' },
//           ],
//         },
//         { id: 'q3', text: '備註（簡答）', type: 'text' },
//       ],
//     },

//     {
//       id: 's5',
//       title: '網站使用體驗回饋',
//       description: 'UI 是否清楚、流程是否順',
//       startDate: '2026-03-01',
//       endDate: '2026-12-31',
//       questions: [
//         {
//           id: 'q1',
//           text: '整體流程是否清楚？（單選）',
//           type: 'single',
//           options: [
//             { id: 'o1', text: '很清楚' },
//             { id: 'o2', text: '還可以' },
//             { id: 'o3', text: '不太清楚' },
//           ],
//         },
//         {
//           id: 'q2',
//           text: '你遇到的問題？（複選）',
//           type: 'multiple',
//           options: [
//             { id: 'o1', text: '不知道下一步' },
//             { id: 'o2', text: '按鈕不好找' },
//             { id: 'o3', text: '字太小' },
//             { id: 'o4', text: '頁面太亂' },
//           ],
//         },
//         { id: 'q3', text: '你最想改哪裡？（簡答）', type: 'text' },
//       ],
//     },
//   ];

//   getSurveys(): Survey[] {
//     return this.loadSurveys();
//   }

//   getSurveyById(id: string): Survey | undefined {
//     return this.loadSurveys().find((s) => s.id === id);
//   }

//   private storeKey = 'surveys';

//   loadSurveys(): Survey[] {
//     const raw = localStorage.getItem(this.storeKey);
//     if (raw) {
//       try {
//         return JSON.parse(raw);
//       } catch {}
//     }
//     // 第一次沒資料：把目前這份假資料當種子存起來
//     localStorage.setItem(this.storeKey, JSON.stringify(this.surveys));
//     return this.surveys;
//   }

//   saveSurveys(list: Survey[]) {
//     this.surveys = list;
//     localStorage.setItem(this.storeKey, JSON.stringify(list));
//   }

//   deleteSurvey(id: string) {
//     const list = this.loadSurveys().filter((s) => s.id !== id);
//     this.saveSurveys(list);
//   }
//   addSurvey(s: Survey) {
//     const list = this.loadSurveys();
//     list.push(s);
//     this.saveSurveys(list);
//   }

//   upsertSurvey(s: Survey) {
//     const list = this.loadSurveys();
//     const idx = list.findIndex((x) => x.id === s.id);
//     if (idx >= 0) list[idx] = s;
//     else list.push(s);
//     this.saveSurveys(list);
//   }

//   private baseUrl = 'http://localhost:8080/api/questionnaires';

//   getPublishedQuestionnaires(): Observable<QuestionnaireDto[]> {
//     return this.http.get<QuestionnaireDto[]>(`${this.baseUrl}/published`);
//   }
// }
