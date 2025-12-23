
export interface TEditPlan {
  name: string,
  description: string,
  price: number,
  duration: number,
  active: boolean,
  course: string
}

export interface TAddPlan {
  name: string,
  description: string,
  price: number,
  duration: number,
  active: boolean,
  course: string
}

export interface TListFilters {
  offset: number;
  limit: number;
  search: string;
  sorting: string;
}