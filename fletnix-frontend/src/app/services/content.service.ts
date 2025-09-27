import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

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
    genre?: string;
    sortBy: string;
    sortOrder: string;
  };
}

export interface GenresResponse {
  success: boolean;
  genres: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private apiUrl = 'http://localhost:5000/api/content';

  constructor(private http: HttpClient) {}

  getContent(page: number = 1, limit: number = 15, search: string = '', type: string = '', genre: string = ''): Observable<ContentResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    if (search.trim()) {
      params = params.set('search', search.trim());
    }
    
    if (type.trim()) {
      params = params.set('type', type.trim());
    }

    if (genre.trim()) {
      params = params.set('genre', genre.trim());
    }

    return this.http.get<ContentResponse>(this.apiUrl, { params });
  }

  getGenres(): Observable<GenresResponse> {
    return this.http.get<GenresResponse>(`${this.apiUrl}/genres`);
  }

  getContentById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}
