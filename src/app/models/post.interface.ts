import { FormControl } from "@angular/forms";
import { ComboboxOption } from "app/components/shared/combobox/combobox.component";

export interface PostForm {
  title: FormControl<string>;
  content: FormControl<string>;
  categories: FormControl<ComboboxOption[]>;
}

export interface Post {
  id: string;
  title: string;
  description: string;
  content: string | null;
  created_at: string;
  updated_at: string;
  author_id: string;
  avatar_url: string | null;
  categories: { id: string; name: string }[];
  likes: number;
  dislikes: number;
}

export interface PostPreview {
  title: string;
  content: string;
  categories: ComboboxOption[];
}

export interface PostCategory {
  id: string;
  name: string;
  created_at: string;
}