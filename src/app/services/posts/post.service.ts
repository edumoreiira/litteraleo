import { inject, Injectable } from "@angular/core";
import { SupabaseService } from "../supabase/supabase.service";
import { Post } from "app/models/post.interface";

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private supabase = inject(SupabaseService).client;

async getPostBySlug(slug: string) {
    const { data, error } = await this.supabase
      .rpc('get_post_by_slug', { p_slug: slug });

    // 2. Se o banco funcionou, mas não achou nada (404)
    if (!data) {
      return { data: null, error: new Error('Post not found') };
    }

    return { data: data as Post, error };
  }
}