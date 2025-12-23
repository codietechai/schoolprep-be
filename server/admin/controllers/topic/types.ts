export interface TListFilters {
  search?: string;
  offset: number;
  limit: number;
  sorting?: string;
}

export interface TAddTopic {
  title: string;
  subject: string;
  active: boolean;
}

export interface TEditTopic {
  title: string;
  subject: string;
  active: boolean;
}

export interface TAddTopicAllowedCount{
  topic_id:string;
  allowed_questions:number;
}