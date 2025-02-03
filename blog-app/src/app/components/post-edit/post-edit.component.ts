import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../core/services/post.service';
import { Post } from '../../core/interfaces/post.interface';
import { switchMap, take } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-edit',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './post-edit.component.html',
  styleUrl: './post-edit.component.scss'
})
export class PostEditComponent {
  postForm: FormGroup;
  postId: any;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.route.params.pipe(
      take(1),
      switchMap(params => {
        this.postId = +params['id'];
        return this.postService.getPost(this.postId);
      })
    ).subscribe({
      next: (post: Post) => {
        this.postForm.patchValue({
          title: post.title,
          content: post.content
        });
      },
      error: (err) => {
        this.error = 'Failed to load post';
        console.error('Error loading post:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.postForm.valid) {
      this.loading = true;
      this.error = null;

      this.postService.updatePost(this.postId, this.postForm.value).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/post', this.postId]);
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Failed to update post';
          console.error('Error updating post:', err);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/post', this.postId]);
  }
}
