import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, StorageService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successfully', () => {
    const mockResponse = {
      message: 'Login successful', // Fixed: Added message property
      token: 'fake-jwt-token',
      user: { id: '1', email: 'test@example.com', age: 25 }
    };

    service.login({ email: 'test@example.com', password: 'password123' }).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:5000/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should register successfully', () => {
    const mockResponse = {
      message: 'User registered successfully',
      token: 'fake-jwt-token',
      user: { id: '1', email: 'test@example.com', age: 25 }
    };

    const userData = { email: 'test@example.com', password: 'password123', age: 25 };

    service.register(userData).subscribe(response => {
      expect(response.message).toContain('registered');
    });

    const req = httpMock.expectOne('http://localhost:5000/api/auth/register');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should logout user', () => {
    // Mock localStorage
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'removeItem');
    spyOn(localStorage, 'getItem').and.returnValue('fake-token');
    
    service.logout();
    
    expect(localStorage.removeItem).toHaveBeenCalled();
  });
});
