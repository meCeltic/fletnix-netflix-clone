export interface Content {
    _id: string;
    show_id: string;
    type: 'Movie' | 'TV Show';
    title: string;
    director: string;
    cast: string;
    country: string;
    date_added: string;
    release_year: number;
    rating: string;
    duration: string;
    listed_in: string;
    description: string;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface ContentResponse {
    success: boolean;
    content: Content[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
    filters: {
      search: string;
      type: string;
      sortBy: string;
      sortOrder: string;
    };
  }
  
  export interface ContentDetailResponse {
    success: boolean;
    content: Content;
  }
  
  export interface ContentFilters {
    page?: number;
    limit?: number;
    search?: string;
    type?: 'Movie' | 'TV Show' | '';
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }
  