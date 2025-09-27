import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ContentService } from './content.service';

describe('ContentService', () => {
  let service: ContentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ContentService]
    });
    service = TestBed.inject(ContentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch content with pagination', () => {
    const mockResponse = {
      success: true,
      content: [
        { _id: '1', title: 'Test Movie', type: 'Movie', release_year: 2023 }
      ],
      pagination: {
        currentPage: 1,
        totalPages: 5,
        totalItems: 100,
        itemsPerPage: 15,
        hasNextPage: true,
        hasPrevPage: false
      },
      filters: {
        search: '',
        type: '',
        genre: '',
        sortBy: 'title',
        sortOrder: 'asc'
      }
    };

    service.getContent(1, 15, 'test', 'Movie', '').subscribe(response => {
      expect(response.success).toBeTruthy();
      expect(response.content.length).toBe(1);
      expect(response.pagination.currentPage).toBe(1);
    });

    const req = httpMock.expectOne(request => 
      request.url.includes('/api/content') && 
      request.params.get('page') === '1'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch genres', () => {
    const mockResponse = {
      success: true,
      genres: ['Action', 'Comedy', 'Drama']
    };

    service.getGenres().subscribe(response => {
      expect(response.success).toBeTruthy();
      expect(response.genres.length).toBe(3);
    });

    const req = httpMock.expectOne('http://localhost:5000/api/content/genres');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
