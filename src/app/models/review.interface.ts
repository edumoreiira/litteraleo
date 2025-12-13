import { FormControl } from "@angular/forms";
import { ComboboxOption } from "app/components/shared/combobox/combobox.component";

export interface ReviewForm {
  title: FormControl<string>;
  content: FormControl<string>;
  book: FormControl<number | null>;
  rating: FormControl<number | null>;
  categories: FormControl<string[]>;
}

export interface CreateReviewDTO {
  title: string;
  content: string;
  rating: number;
  book_id: number;
  category_ids: string[];
}

export interface Review {
  id: string;
  slug: string;
  title: string;
  rating: number;
  content: string;
  author: {
    short_name: string;
    full_name: string;
    avatar_url: string;
  }
  book: {
    title: string;
    author: string;
    cover_image_url: string;
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
  "id": string;
  "name": string;
}


export interface Book {
  id: string;
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