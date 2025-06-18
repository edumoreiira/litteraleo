import { inject, Injectable } from "@angular/core";
import { SupabaseService } from "../supabase/supabase.service";
import { AuthService } from "../auth/auth.service";
import { ToastService } from "../ui/toast.service";

@Injectable( {
  providedIn: 'root'
})
export class UserPostsService {
  private supabase = inject(SupabaseService).client;
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  
  async createPost(title: string, description: string, content: string) {
    const userId = this.auth.$userId();
    const { data, error } = await this.supabase
    .from('posts')
    .insert([{
      title,
      description,
      content,
      author_id: userId
    }])

    if(error) {
      console.error("Erro ao criar post:", error);
      this.toast.create({
        variant: 'error',
        message: "Ocorreu um erro ao tentar criar o post"
      })
    } else {
      this.toast.create({
        variant: 'success',
        message: "Post criado com sucesso"
      })
    }
  }

  updatePost(id: string, title: string, description: string, content: string) {
    return this.supabase
      .from('posts')
      .update({
        title,
        description,
        content,
      })
      .eq('id', id)
      .then(({ data, error }) => {
        if (error) {
          console.error("Erro ao editar post:", error);
          this.toast.create({
            variant: 'error',
            message: "Ocorreu um erro ao tentar editar o post"
          });
        } else {
          this.toast.create({
            variant: 'success',
            message: "Post editado com sucesso"
          });
        }
      });
  }

  async getMyPosts() {
    const userId = this.auth.$userId();
    const { data, error } = await this.supabase
      .from('posts')
      .select('*')
      .eq('author_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      this.toast.create({
        variant: 'error',
        message: 'Erro ao buscar seus posts.'
      });
      return [];
    }

    return data;
  }

  async getPostReactions(postId: string) {
    const { data, error } = await this.supabase
      .rpc('get_post_reaction_counts', { post_id: postId });

    if (error) {
      this.toast.create({ variant: 'error', message: 'Erro ao buscar reações do post.' });
      return { likes: 0, dislikes: 0 };
    }

    // data vem como array de linhas. Pega a primeira (ou setta default caso não retorne nada)
    const counts = data?.[0] ?? { likes: 0, dislikes: 0 };
    return { likes: counts.likes, dislikes: counts.dislikes };
  }

  async reactToPost(postId: string, reactionType: 'like' | 'dislike') {
    const userId = this.auth.$userId();
    const { error } = await this.supabase
      .from('post_reactions')
      .insert([{ post_id: postId, user_id: userId, reaction_type: 'reactionType' }]);

    if (error) {
      console.error("Erro ao reagir ao post:", error);
      this.toast.create({
        variant: 'error',
        message: "Ocorreu um erro ao tentar reagir ao post"
      });
    }
  }

  async getMyPostsWithReactions() {
  const userId = this.auth.$userId();

  const { data, error } = await this.supabase
    .from('posts_with_reactions')
    .select('*')
    .eq('author_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    this.toast.create({
      variant: 'error',
      message: 'Erro ao buscar seus posts.'
    });
    return [];
  }

  // cada item já vem com { ..., likes: number, dislikes: number }
  return data;
}
    
}