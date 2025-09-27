import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Content } from '../../../models/content.model';

@Component({
  selector: 'app-content-card',
  templateUrl: './content-card.component.html',
  styleUrls: ['./content-card.component.scss']
})
export class ContentCardComponent {
  @Input() content!: Content;

  constructor(private router: Router) {}

  onCardClick(): void {
    this.router.navigate(['/content', this.content._id]);
  }

  getRatingColor(rating: string): string {
    switch (rating) {
      case 'G':
      case 'PG':
        return 'bg-green-600';
      case 'PG-13':
        return 'bg-yellow-600';
      case 'R':
      case 'NC-17':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  }

  getTypeIcon(type: string): string {
    return type === 'Movie' ? '🎬' : '📺';
  }

  truncateText(text: string, length: number): string {
    if (text && text.length > length) {
      return text.substring(0, length) + '...';
    }
    return text || '';
  }
}
