import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../supabase/supabase.service';
import { AuthService } from '../auth/auth.service';
import { ToastService } from '../ui/toast.service';
import { PaginatedPosts, Post, PostCategory, PostLike, PostQuery } from 'app/models/post.interface';
import { PostgrestError } from '@supabase/supabase-js';
import { PaginatedReviews, ReviewSearchParams } from 'app/models/review.interface';

@Injectable({
  providedIn: 'root',
})
export class ReviewsService {
  private supabase = inject(SupabaseService).client;
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  public async searchReviews(params: ReviewSearchParams)
  : Promise<{ data: PaginatedReviews; error: PostgrestError | null }>
  {
    const { 
      search_text, 
      rating, 
      category_ids, 
      page = 1, 
      page_size = 8 
    } = params;
  
    const { data, error } = await this.supabase
      .rpc('search_reviews', {
        r_search_text: search_text ?? null,  
        r_rating: rating ?? null,
        r_category_ids: category_ids ?? null,
        r_page : page ?? null,
        r_page_size : page_size ?? null
      });
    
    if (error) {
      this.toast.create({
        variant: 'error',
        message: 'Ocorreu um erro ao buscar as reviews.',
      });
      console.error('Erro ao buscar reviews:', error);
      throw error;
    }
    return { data, error }
  }
}