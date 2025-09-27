import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ContentService, Content, ContentResponse } from '../../../services/content.service';

@Component({
  selector: 'app-content-list',
  templateUrl: './content-list.component.html',
  styleUrls: ['./content-list.component.scss']
})
export class ContentListComponent implements OnInit {
  content: Content[] = [];
  genres: string[] = [];
  loading = true;
  error = '';
  currentUser: any = null;
  searchTerm = '';
  selectedType = '';
  selectedGenre = '';
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private contentService: ContentService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadGenres();
    this.loadContent();
  }

  loadGenres(): void {
    this.contentService.getGenres().subscribe({
      next: (response) => {
        if (response.success) {
          this.genres = response.genres;
          console.log('Loaded genres:', this.genres.length);
        }
      },
      error: (error) => {
        console.error('Error loading genres:', error);
      }
    });
  }

  loadContent(): void {
    this.loading = true;
    this.error = '';
    
    this.contentService.getContent(this.currentPage, 15, this.searchTerm, this.selectedType, this.selectedGenre).subscribe({
      next: (response: ContentResponse) => {
        this.content = response.content;
        this.totalPages = response.pagination.totalPages;
        this.totalItems = response.pagination.totalItems;
        this.loading = false;
        console.log(`Loaded ${response.content.length} items from ${this.totalItems} total`);
      },
      error: (error) => {
        console.error('Error loading content:', error);
        this.error = 'Failed to load Netflix content. Please try again.';
        this.loading = false;
      }
    });
  }

  onSearch(event: any): void {
    this.searchTerm = event.target.value;
    this.currentPage = 1;
    this.loadContent();
    console.log('Searching for:', this.searchTerm);
  }

  onTypeFilter(event: any): void {
    this.selectedType = event.target.value;
    this.currentPage = 1;
    this.loadContent();
    console.log('Filtering by type:', this.selectedType);
  }

  onGenreFilter(event: any): void {
    this.selectedGenre = event.target.value;
    this.currentPage = 1;
    this.loadContent();
    console.log('Filtering by genre:', this.selectedGenre);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadContent();
    console.log('Changed to page:', page);
  }

  viewDetail(contentId: string): void {
    console.log('Navigating to content detail:', contentId);
    this.router.navigate(['/content', contentId]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
