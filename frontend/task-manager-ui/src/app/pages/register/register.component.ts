import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container">
      <h2>Register</h2>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <label>Name</label>
        <input type="text" formControlName="name" />
        <label>Email</label>
        <input type="email" formControlName="email" />
        <label>Mobile Number</label>
        <input type="text" formControlName="mobileNumber" />
        <label>Password</label>
        <input type="password" formControlName="password" />
        <label>County</label>
        <input type="text" formControlName="county" />
        <label>City</label>
        <input type="text" formControlName="city" />
        <label>State</label>
        <input type="text" formControlName="state" />
        <label>Gender</label>
        <select formControlName="gender">
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <button type="submit" [disabled]="form.invalid || loading">{{ loading ? 'Creating...' : 'Register' }}</button>
      </form>
      <p>Already have an account? <a routerLink="/login">Login</a></p>
      <p class="error" *ngIf="error">{{ error }}</p>
    </div>
  `,
  styles: [` .container { max-width: 560px; margin: 32px auto; display: block; } form { display: grid; gap: 10px; } .error{color:#c00}`]
})
export class RegisterComponent {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  loading = false;
  error = '';

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    mobileNumber: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    county: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    gender: ['male', Validators.required],
  });

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    this.http.post<{ token: string }>(`${this.apiBase}/register`, this.form.value).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.router.navigateByUrl('/tasks');
      },
      error: (err) => {
        this.error = err?.error?.message || 'Registration failed';
        this.loading = false;
      }
    });
  }

  get apiBase() {
    return '/api';
  }
}

