export interface TEditCourse {
  name: string;        // Name of the course (optional for updates)
  category: string;    // ID of the category (optional for updates)
  description: string; // Description of the course (optional for updates)
  image?: string;    // Duration of the course (optional for updates)
  active: boolean;     // Whether the course is active (optional for updates)
  subjects: string[],
  level: string
}

export interface TAddCourse {
  name: string;        // Name of the course (e.g., "Physics 101")
  category: string;    // ID of the category associated with the course
  description: string; // Description of the course
  active: boolean;     // Whether the course is active (true/false)
  subjects: string[],
  level: string
}

export interface TListFilters {
  offset: number;            // Offset for pagination
  limit: number;             // Limit for pagination
  search: string;            // Search term for filtering coupons (e.g., by `code`)
  sorting: string;           // Sorting criteria (e.g., 'createdAt DESC')
}