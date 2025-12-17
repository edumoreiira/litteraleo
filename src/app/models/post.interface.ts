import { FormControl } from "@angular/forms";
import { ComboboxOption } from "app/components/shared/combobox/combobox.component";

export interface PostForm {
  title: FormControl<string | null>;
  content: FormControl<string | null>;
}

export interface CreatePostDTO {
  title: string;
  content: string;
  author_id: string;
}

export interface CreatePostResponse {
  title: string;
  content: string;
  slug: string;
  author_id: string;
  created_at: Date;
  updated_at: Date | null;
  likes_count: number;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  likes_count: number;
  slug: string;
  is_liked?: boolean;
  author: {
    full_name: string;
    short_name: string;
    avatar_url: string;
  }
  created_at: Date;
  updated_at: Date | null;
}
