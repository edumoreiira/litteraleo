import { Component, ChangeDetectionStrategy, ElementRef, effect, inject, input, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { CommentComponent } from 'app/components/shared/comment/comment.component';
import { iComment } from 'app/models/comments.interface';
import { CommentsService } from 'app/services/posts/comments.service';

@Component({
  selector: 'app-comments-section',
  host: {
    class: 'flex flex-col'
  },
  template: `
  @for(comment of comments(); track comment.id) {
    <app-comment [type]="type()" class="py-5 border-b border-border/50 last-of-type:border-0"
    [data]="comment"
    [resourceId]="postId()"
    ></app-comment>
  }

  @if (isLoading()) {
    <div class="flex justify-center py-4 w-full">
       <div class="size-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
    </div>
  }

  <!-- Sentinel element observed to load more when visible -->
  <div #sentinel class="h-1"></div>
  `,
  imports: [CommentComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentsSectionComponent implements OnInit, OnDestroy {
  private commentService = inject(CommentsService);
  // 
  postId = input.required<string>();
  type = input.required<'post' | 'review'>();
  protected comments = signal<iComment[]>([]);
  protected isLoading = signal<boolean>(false);
  protected meta = signal<{ total: number; page: number; limit: number; total_pages: number } | null>(null);
  protected page = signal<number>(1);
  private observer: IntersectionObserver | null = null;
  private readonly sentinel = viewChild<ElementRef>('sentinel');


  constructor() {
    // Setup observer when sentinel is available
    effect(() => {
      const elRef = this.sentinel();
      if (!elRef) return;
      this.setupObserver(elRef.nativeElement as HTMLElement);
    });
  }
  ngOnInit(): void {
    this.fetchPage(1);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  private async fetchPage(page: number) {
    if (this.isLoading()) return;
    this.isLoading.set(true);
    try {
      const res = await this.commentService.getComments('post', this.postId(), page);
      if (page === 1) {
        this.comments.set(res.data);
      } else {
        this.comments.update(list => [...list, ...res.data]);
      }
      this.meta.set(res.meta);
      this.page.set(res.meta.page);
    } finally {
      this.isLoading.set(false);
    }
  }

  private setupObserver(sentinelEl: HTMLElement) {
    // Recreate observer to avoid duplicate callbacks
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    this.observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          this.tryLoadNext();
        }
      }
    }, {
      root: null,
      rootMargin: '50px',
      threshold: 0.1
    });

    this.observer.observe(sentinelEl);
  }

  private tryLoadNext() {
    const info = this.meta();
    if (!info) return;
    const hasNext = info.page < info.total_pages;
    if (!hasNext) return;
    if (this.isLoading()) return;
    const nextPage = this.page() + 1;
    this.fetchPage(nextPage);
  }
}
