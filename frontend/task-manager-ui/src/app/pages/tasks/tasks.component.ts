import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

type Task = {
  _id?: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  totalTask?: number;
  status?: 'todo' | 'in_progress' | 'done';
};

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
  <div class="container">
    <h2>Tasks</h2>
    <div class="actions">
      <input placeholder="Search..." [(ngModel)]="query" (ngModelChange)="fetch()" />
      <select [(ngModel)]="status" (ngModelChange)="fetch()">
        <option value="">All</option>
        <option value="todo">Todo</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>
    </div>

    <form [formGroup]="form" (ngSubmit)="save()" class="task-form">
      <input placeholder="Title" formControlName="name" />
      <input placeholder="Description" formControlName="description" />
      <input type="date" formControlName="startDate" />
      <input type="date" formControlName="endDate" />
      <input type="number" formControlName="totalTask" />
      <select formControlName="status">
        <option value="todo">Todo</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <button type="submit">{{ editing ? 'Update' : 'Add' }} Task</button>
      <button type="button" (click)="reset()" *ngIf="editing">Cancel</button>
    </form>

    <table class="table">
      <thead>
        <tr><th>Title</th><th>Status</th><th>Dates</th><th>Total</th><th>Actions</th></tr>
      </thead>
      <tbody>
        <tr *ngFor="let t of items">
          <td>{{ t.name }}</td>
          <td>
            <select [ngModel]="t.status" (ngModelChange)="updateStatus(t, $event)">
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </td>
          <td>{{ t.startDate | date }} - {{ t.endDate | date }}</td>
          <td>{{ t.totalTask }}</td>
          <td>
            <button (click)="edit(t)">Edit</button>
            <button (click)="remove(t)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="pagination">
      <button (click)="prev()" [disabled]="page<=1">Prev</button>
      <span>Page {{ page }} / {{ pages }}</span>
      <button (click)="next()" [disabled]="page>=pages">Next</button>
    </div>

    <p class="error" *ngIf="error">{{ error }}</p>
  </div>
  `,
  styles: [` .container{max-width:900px;margin:20px auto;display:block} .actions{display:flex;gap:10px;margin-bottom:12px} .task-form{display:grid;gap:8px;grid-template-columns:repeat(6,1fr)} .table{width:100%;border-collapse:collapse} td,th{border:1px solid #ddd;padding:6px} .pagination{display:flex;gap:12px;align-items:center;margin-top:12px} .error{color:#c00}`]
})

export class TasksComponent implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  items: Task[] = [];
  page = 1; pages = 1; limit = 10; total = 0;
  query = '';
  status = '';
  editing: string | null = null;
  error = '';

  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    startDate: [''],
    endDate: [''],
    totalTask: [1],
    status: ['todo']
  });

  ngOnInit() { this.fetch(); }

  get headers() {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
  get apiBase() { return '/api'; }

  fetch() {
    const params: any = { page: this.page, limit: this.limit };
    if (this.query) params.q = this.query;
    if (this.status) params.status = this.status;
    this.http.get<{items: Task[]; page:number; pages:number; total:number}>(`${this.apiBase}/tasks`, { params, headers: this.headers })
      .subscribe({
        next: (res) => { this.items = res.items; this.page = res.page; this.pages = res.pages; this.total = res.total; },
        error: (err) => { this.error = err?.error?.message || 'Failed to fetch'; }
      });
  }

  save() {
    if (this.form.invalid) return;
    const body = { ...this.form.value } as Task;
    const req = this.editing
      ? this.http.put<Task>(`${this.apiBase}/tasks/${this.editing}`, body, { headers: this.headers })
      : this.http.post<Task>(`${this.apiBase}/tasks`, body, { headers: this.headers });
    req.subscribe({ next: () => { this.reset(); this.fetch(); }, error: err => this.error = err?.error?.message || 'Save failed' });
  }

  edit(t: Task) {
    this.editing = t._id || null;
    this.form.patchValue({
      name: t.name,
      description: t.description || '',
      startDate: t.startDate ? t.startDate.substring(0,10) : '',
      endDate: t.endDate ? t.endDate.substring(0,10) : '',
      totalTask: t.totalTask || 1,
      status: t.status || 'todo',
    });
  }

  reset() {
    this.editing = null;
    this.form.reset({ name: '', description: '', startDate: '', endDate: '', totalTask: 1, status: 'todo' });
  }

  remove(t: Task) {
    if (!t._id) return;
    this.http.delete(`${this.apiBase}/tasks/${t._id}`, { headers: this.headers })
      .subscribe({ next: () => this.fetch(), error: err => this.error = err?.error?.message || 'Delete failed' });
  }

  updateStatus(t: Task, status: Task['status']) {
    if (!t._id) return;
    this.http.put(`${this.apiBase}/tasks/${t._id}`, { status }, { headers: this.headers })
      .subscribe({ next: () => this.fetch(), error: err => this.error = err?.error?.message || 'Update failed' });
  }

  prev() { if (this.page > 1) { this.page--; this.fetch(); } }
  next() { if (this.page < this.pages) { this.page++; this.fetch(); } }
}

