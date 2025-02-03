import { Component } from '@angular/core';
import { PostService } from '../../core/services/post.service';
import { Observable } from 'rxjs';
import { Post } from '../../core/interfaces/post.interface';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
})
export class PostListComponent {
  posts$: Observable<Post[]>;

  constructor(private postService: PostService) {
    this.posts$ = this.postService.getPosts();
  }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.posts$ = this.postService.getPosts();
  }

  deletePost(id: number): void {
    this.postService.deletePost(id).subscribe(() => {
      this.loadPosts();
    });
  }
}
