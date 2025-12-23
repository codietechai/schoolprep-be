export interface TAddTest {
  user_id:string,
  type:string,
  duration_of_exam:number,
  topics:any,
  tutor:boolean,
  question_mode:string,
  total_questions:number,
  questions:string[],
  course_id:string,
  status:string;
}

export interface getUserTest {
  offset: number;            
  limit: number;             
  search: string;            
  sorting: string;           
  user_id:string,
  _id?:string,
  type:string,
  course_id?:string,
}


export interface submitQuestionType {
  question_id?:string,
  test_id:string,

  selected_option_id?:string | null,
}


export interface submitTestType{
  test_id:string,
  user_id:string,
}

export interface handlePerQuestionTimeType{
  action:string,
  current_question_id:string,
  new_question_id?:string,
  upcoming_question_id?:string,
  test_id:string,
}