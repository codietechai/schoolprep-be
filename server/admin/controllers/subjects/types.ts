export interface TListFilters {
  search?: string;    // Search term for filtering subjects by name or code
  offset: number;     // Pagination offset (starting index)
  limit: number;      // Pagination limit (number of results per page)
  sorting?: string;   // Sorting order, e.g., 'name ASC' or 'code DESC'
}

export interface TAddSubject {
  name: string;         // Name of the subject
  description: string;  // Description of the subject
  active: boolean;      // Whether the subject is active or not
}

export interface TEditSubject {
  name?: string;         // Optional field to update name
  description?: string;  // Optional field to update description
  active?: boolean;      // Optional field to update active status
}



