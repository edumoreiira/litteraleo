import { FormControl } from "@angular/forms";
import { ComboboxOption } from "app/components/shared/combobox/combobox.component";

export interface PostForm {
  title: FormControl<string>;
  content: FormControl<string>;
  book_author: FormControl<string>;
  book_name: FormControl<string>;
  rate: FormControl<number | null>;
  categories: FormControl<ComboboxOption[]>;
}

export interface Post {
  id: string;
  title: string;
  description: string;
  content: string;
  created_at: Date;
  updated_at?: Date;
  author_id: string;
  avatar_url?: string;
  short_name: string;
  full_name: string;
  rate: number;
  book_author: string;
  book_name: string;
  categories: PostCategory[];
  likes: number;
  dislikes: number;
}

export interface PaginatedPosts {
  posts: Post[];
  total_count: number;
  total_pages: number;
}

export interface PostPreview {
  title: string;
  content: string;
  categories: ComboboxOption[];
}

export interface PostCategory {
  "id": string;
  "name": string;
}

export type PostQuery = {
  page: number;
  pageSize?: number;
  search_text?: string;
  bookName?: string;
  minRate?: number;
  categoryIds?: string[];
}