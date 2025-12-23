export interface TAddCategory {
  name: string;
  description: string;
  active: boolean;
}

export interface TEditCategory {
  name: string;
  description: string;
  active: boolean;
  image?: string | null;
}

export interface TListFilters {
  offset: number;            // Offset for pagination
  limit: number;             // Limit for pagination
  search: string;            // Search term for filtering coupons (e.g., by `code`)
  sorting: string;           // Sorting criteria (e.g., 'createdAt DESC')
}