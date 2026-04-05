export interface QuestionnaireDto {
  id: number;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  isPublished: number;
  createdAt?: string;
  viewCount?: number;
}
export type QuestionType = 'single' | 'multiple' | 'text';


export type OptionUpsertReq = Omit<OptionDto, 'id'>;

export type QuestionUpsertReq = Omit<QuestionDto, 'id' | 'options'> & {
  options: OptionUpsertReq[];
};

export type QuestionnaireFullUpsertReq = Omit<
  QuestionnaireFullDto,
  'id' | 'questions'
> & {
  questions: QuestionUpsertReq[];
};



export interface OptionDto {
  id: number;
  optionText: string;
  sortOrder: number;
}

export interface QuestionDto {
  id: number;
  title: string;
  questionType: QuestionType;
  isRequired: number; // 0/1
  sortOrder: number;
  options: OptionDto[];
}

export interface QuestionnaireFullDto {
  id: number;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  questions: QuestionDto[];
}
