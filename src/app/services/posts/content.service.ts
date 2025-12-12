import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../supabase/supabase.service';
import { AuthService } from '../auth/auth.service';
import { ToastService } from '../ui/toast.service';
import { Review } from 'app/models/review.interface';
import { Post } from 'app/models/post.interface';

export interface FeedSearchParams {
  search_text?: string;
  rating?: number;
  category_ids?: string[];
  page_size: number;
  page: number;
  search_type: 'posts' | 'reviews' | 'both'; // Novo campo
}

export interface Feed {
  reviews: Review[];
  posts: Post[];
  total_count: number;
  total_pages: number;
}

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  private supabase = inject(SupabaseService).client;
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  async searchContent(params: FeedSearchParams) {
    const { data, error } = await this.supabase
      .rpc('search_content', {
        r_search_text: params.search_text || null,
        r_rating: params.rating || null,
        r_category_ids: params.category_ids || null,
        r_page: params.page || 1,
        r_page_size: params.page_size || 8,
        r_search_type: params.search_type // 'posts', 'reviews' ou 'both'
      });

    if (error) {
      this.toast.create({
        message: 'Erro ao buscar conteúdo.  ' + error.message,
        variant: 'error'
      })
    }
    // data virá exatamente como { posts: [], reviews: [], ... }
    return { data: data as Feed, error };
  }

}
