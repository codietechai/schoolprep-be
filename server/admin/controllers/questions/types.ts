export interface TOption {
    text: string;
    isCorrect: boolean;
}

export interface TAddQuestion {
    question_text: string;
    options: TOption[];
    subject_id: string;
    topic_id: string;
    course_id: string;
    explanation_text?: string;
    explanation_image?: string;
    image_url?: string;
    explanation_video?: string;
    difficulty_level: string;
    is_diagnostic: string;
    is_preparatory: string;
    is_real_exam: string;
}

export interface TEditQuestion {
    question_text?: string;
    options?: TOption[];
    subject_id?: string;
    topic_id?: string;
    course_id?: string;
    explanation_text?: string;
    explanation_image?: string;
    explanation_video?: string;
    image_url?: string;
    difficulty_level: string;
    is_diagnostic: string;
    is_preparatory: string;
    is_real_exam: string;
}

export interface TListFilters {
    offset: number;
    limit: number;
    search: string;
    sorting: string;
}
