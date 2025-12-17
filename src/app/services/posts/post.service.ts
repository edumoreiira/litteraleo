import { inject, Injectable } from "@angular/core";
import { SupabaseService } from "../supabase/supabase.service";
import { CreatePostDTO, CreatePostResponse, Post } from "app/models/post.interface";
import { ToastService } from "../ui/toast.service";
import { AuthService } from "../auth/auth.service";

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private supabase = inject(SupabaseService).client;
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  async getPostBySlug(slug: string) {
    const { data, error } = await this.supabase
      .rpc('get_post_by_slug', { p_slug: slug });

    // 2. Se o banco funcionou, mas não achou nada (404)
    if (!data) {
      return { data: null, error: new Error('Post not found') };
    }

    return { data: data as Post, error };
  }

  async createPost(post: Omit<CreatePostDTO, 'author_id'>) {
    const payload: CreatePostDTO = {
      ...post,
      author_id: this.auth.$userId()!,
    };
    const { data, error } = await this.supabase
      .from('posts')
      .insert(payload)
      .select()
      .single();

      if(error) {
        this.toast.create({
          message: 'Erro ao criar o artigo. ' + error.message,
          variant: 'error'
        });
        console.error('Erro ao criar o artigo:', error);
      }
      if(data) {
        this.toast.create({
          message: 'Artigo criado com sucesso!',
          variant: 'success'
        });
      }
    return { data: data as CreatePostResponse, error };
  }
}