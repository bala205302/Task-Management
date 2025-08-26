import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container">
      <h2>Login</h2>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <label>Email</label>
        <input type="email" formControlName="email" />
        <div class="error" *ngIf="form.controls.email.invalid && form.controls.email.touched">
          Valid email required
        </div>

        <label>Password</label>
        <input type="password" formControlName="password" />
        <div class="error" *ngIf="form.controls.password.invalid && form.controls.password.touched">
          Password required
        </div>

        <button type="submit" [disabled]="form.invalid || loading">{{ loading ? 'Signing in...' : 'Login' }}</button>
      </form>
      <p>Don't have an account? <a routerLink="/register">Register</a></p>
      <p class="error" *ngIf="error">{{ error }}</p>
    </div>
  `,
  styles: [
    `
    .container { max-width: 420px; margin: 48px auto; display: block; }
    form { display: grid; gap: 12px; }
    input { padding: 8px; }
    button { padding: 10px 14px; }
    .error { color: #c00; }
  `],
})
export class LoginComponent {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  loading = false;
  error = '';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    this.http.post<{ token: string }>(`${this.apiBase}/login`, this.form.value).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.router.navigateByUrl('/tasks');
      },
      error: (err) => {
        this.error = err?.error?.message || 'Login failed';
        this.loading = false;
      }
    });
  }

  get apiBase() {
    return '/api';
  }
}

