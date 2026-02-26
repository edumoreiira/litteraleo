import { FormControl } from "@angular/forms";

export interface ReviewForm {
  title: FormControl<string>;
  content: FormControl<string>;
  description: FormControl<string | null>;
  book: FormControl<number | null>;
  rating: FormControl<number | null>;
  categories: FormControl<string[]>;
}

export interface UpdateReviewDTO {
  id: string;
  title?: string;
  content?: string;
  description?: string;
  rating?: number;
  book_id?: number;
  category_ids?: string[];
}
export type CreateReviewDTO = Required<Omit<UpdateReviewDTO, 'id' | 'description'>> & { description?: string };

export type updateReviewDTO = Pick<Review, 'id'> & Partial<Pick<Review, 'title' | 'content' | 'rating'>>;

export interface CreateReviewResponseDTO {
  id: string;
  book_id: number;
  author_id: string;
  title: string;
  description: string | null;
  slug: string;
  rating: number;
  content: string;
  created_at: string;
  updated_at: string | null;
  likes_count: number;
}

export interface Review {
  id: string;
  slug: string;
  title: string;
  rating: number;
  content: string;
  description: string | null;
  author: {
    short_name: string;
    full_name: string;
    avatar_url: string;
    is_owner?: boolean;
  }
  book: {
    id: number;
    title: string;
    author: string;
    cover_image_url: string;
    pages: number;
    publication_year: number;
  }
  likes_count: number;
  categories: ReviewCategory[];
  is_liked?: boolean;
  created_at: Date;
  updated_at: Date | null;
}

export interface PaginatedReviews {
  reviews: Review[];
  total_count: number;
  total_pages: number;
}

export interface ReviewSearchParams {
  search_text?: string;
  rating?: number;
  category_ids?: string[];
  page: number;
  page_size?: number;
}

export interface ReviewCategory {
  id: string;
  name: string;
}


export interface Book {
  id: number;
  title: string;
  author: string;
  cover_image_url: string;
  publication_year: number;
  pages: number;
}

export interface BooksAndCategories {
  books: Book[];
  categories: ReviewCategory[];
}