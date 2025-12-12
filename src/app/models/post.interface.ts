import { FormControl } from "@angular/forms";
import { ComboboxOption } from "app/components/shared/combobox/combobox.component";

export interface Post {
  id: string;
  title: string;
  content: string;
  likes_count: number;
  slug: string;
  author: {
    full_name: string;
    short_name: string;
    avatar_url: string;
  }
  created_at: Date;
  updated_at: Date | null;
}
