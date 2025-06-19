import { FormControl } from "@angular/forms";

export interface PostForm {
  title: FormControl<string>;
  content: FormControl<string>;
}

export interface Post {
  title: string;
  content: string;
}