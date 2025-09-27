import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService, Content } from '../../../services/content.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-content-detail',
  templateUrl: './content-detail.component.html',
  styleUrls: ['./content-detail.component.scss']
})
export class ContentDetailComponent implements OnInit {
  content: Content | null = null;
  loading = true;
  error = '';
  currentUser: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contentService: ContentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadContentDetail(id);
      }
    });
  }

  loadContentDetail(id: string): void {
    this.loading = true;
    this.error = '';

    this.contentService.getContentById(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.content = response.content;
        } else {
          this.error = 'Content not found';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading content detail:', error);
        if (error.status === 403) {
          this.error = 'This content is restricted for users under 18 years old';
        } else if (error.status === 404) {
          this.error = 'Content not found';
        } else {
          this.error = 'Failed to load content details';
        }
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
