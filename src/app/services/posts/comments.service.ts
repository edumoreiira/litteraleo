import { inject, Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { CreateCommentDTO, iComment, CommentResponse, CommentReply } from 'app/models/comments.interface';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private supabase = inject(SupabaseService).client;
  private auth = inject(AuthService);


  async getComments(type: 'post' | 'review', postId: string, page: number = 1): Promise<CommentResponse> {
    const typeParam = type === 'post' ? 'p_post_id' : 'p_review_id';
    const { data, error } = await this.supabase
      .rpc('get_comments', {
        [typeParam]: postId,
        p_page: page,
        p_page_size: 4
      });

    if (error) throw error;
    return data as CommentResponse;
  }

  async getReplies(parentId: string) {
    const { data, error } = await this.supabase
      .from('comments')
      .select(`
        id, content, created_at, updated_at, parent_id, is_post_author,
        author:author_id ( id, full_name, avatar_url, short_name )
      `)
      .eq('parent_id', parentId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data as unknown as CommentReply[];
  }

  async createComment(payload: CreateCommentDTO): Promise<CommentReply | iComment> {
    const userId = this.auth.$userId();
    if (!userId) throw new Error('Usuário não autenticado');

    const insertPayload = {
      content: payload.content,
      author_id: userId,
      post_id: payload.post_id || null,
      review_id: payload.review_id || null,
      parent_id: payload.parent_id || null
    };


    const { data, error } = await this.supabase
      .from('comments')
      .insert(insertPayload)
      .select(`
        id,
        content,
        created_at,
        updated_at,
        parent_id,
        is_post_author,
        author:author_id (
          id,
          full_name,
          avatar_url,
          short_name
        )
      `)
      .single();

    if (error) throw error;
    
    if (payload.parent_id) {
      return data as unknown as CommentReply;
    } else {
      const commentData = data;
      delete commentData.parent_id; // root comments don't have parent_id
      return commentData as unknown as iComment;
    }
  }

  // =================================================================
  // 2. UPDATE (Com Deep Select para garantir dados frescos)
  // =================================================================
  async updateComment(commentId: string, newContent: string): Promise<iComment | CommentReply> {
    const { data, error } = await this.supabase
      .from('comments')
      .update({ 
        content: newContent,
      })
      .eq('id', commentId)
      .select(`
        id,
        content,
        created_at,
        updated_at,
        parent_id,
        author:author_id (
          id,
          full_name,
          avatar_url,
          short_name
        )
      `)
      .single();

    if (error) throw error;
    
    if ('parent_id' in data && data.parent_id) {
      return data as unknown as CommentReply;
    }
    else {
      const commentData = data;
      delete commentData.parent_id;
      return commentData as unknown as iComment;
    }
  }

  // =================================================================
  // 3. DELETE
  // =================================================================
  async deleteComment(commentId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('comments')
      .delete()
      .eq('id', commentId) // A RLS checa dono ou admin automaticamente
      .single(); // force return single row to trigger error if user cannot delete
      

    if (error) throw error;
    return true;
  }
}