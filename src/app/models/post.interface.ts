import { FormControl } from "@angular/forms";

export interface Post {
  title: FormControl<string>;
  content: FormControl<string>;
}