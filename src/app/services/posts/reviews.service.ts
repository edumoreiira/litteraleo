import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../supabase/supabase.service';
import { AuthService } from '../auth/auth.service';
import { ToastService } from '../ui/toast.service';
import { PostgrestError } from '@supabase/supabase-js';
import { BooksAndCategories, CreateReviewDTO, PaginatedReviews, ReviewSearchParams } from 'app/models/review.interface';

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
  public async getAllBooksAndCategories()
  : Promise<{ data: BooksAndCategories; error: PostgrestError | null }>
  {
    const { data, error } = await this.supabase.rpc('get_books_and_categories');
    if (error) {
      this.toast.create({
        variant: 'error',
        message: 'Ocorreu um erro ao buscar os livros e categorias.',
      });
      console.error('Erro ao buscar livros e categorias:', error);
      throw error;
    }
    return { data, error }
  }

  public async createReview(dto: CreateReviewDTO) {
   const { data, error } = await this.supabase
     .rpc('create_review', {
       p_title: dto.title,
       p_content: dto.content,
       p_rating: dto.rating,
       p_book_id: dto.book_id,
       p_author_id: this.auth.$userId(),
       p_category_ids: dto.category_ids,
     });

   if (error) {
     console.error('Erro ao criar review:', error);
     throw error;
   }
   
   this.toast.create({
     variant: 'success',
     message: 'Resenha criada com sucesso!',
   });

   return data; // Retorna o objeto da review criada
  }
}