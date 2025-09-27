import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    console.log('Register component loaded!');
    // Initialize form in constructor
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      age: ['', [Validators.required, Validators.min(1), Validators.max(120)]]
    });
  }

  ngOnInit(): void {
    // Don't redirect if already authenticated - let them register anyway
    console.log('Register component initialized');
  }

  onSubmit(): void {
    console.log('Form submitted!');
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const formData = {
        ...this.registerForm.value,
        age: parseInt(this.registerForm.value.age)
      };

      console.log('Sending registration data:', formData);

      this.authService.register(formData).subscribe({
        next: (response) => {
          this.loading = false;
          console.log('Registration successful:', response);
          alert('Registration successful! You can now login.');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.loading = false;
          console.error('Registration error:', error);
          this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        }
      });
    } else {
      console.log('Form is invalid:', this.registerForm.errors);
    }
  }

  get email() { return this.registerForm?.get('email'); }
  get password() { return this.registerForm?.get('password'); }
  get age() { return this.registerForm?.get('age'); }
}
