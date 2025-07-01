import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../supabase/supabase.service';
import { AuthService } from '../auth/auth.service';
import { ToastService } from '../ui/toast.service';
import { Post, PostCategory } from 'app/models/post.interface';
import { PostgrestError } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class UserPostsService {
  private supabase = inject(SupabaseService).client;
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  async createPost(
    title: string,
    description: string,
    content: string,
    categoryIds: string[],
    rate: number,
    bookAuthor: string
  ) {
    const authorId = this.auth.$userId();
    const { data, error } = await this.supabase.rpc(
      'create_post_with_categories',
      {
        p_title: title,
        p_description: description,
        p_content: content,
        p_author_id: authorId,
        p_category_ids: categoryIds,
        p_rate: rate,
        p_book_author: bookAuthor,
      }
    );

    if (error) {
      this.toast.create({
        variant: 'error',
        message: 'Ocorreu um erro ao tentar criar o post.',
      });
    } else {
      this.toast.create({
        variant: 'success',
        message: 'Post criado com sucesso!',
      });
    }

    return { data, error };
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
          console.error('Erro ao editar post:', error);
          this.toast.create({
            variant: 'error',
            message: 'Ocorreu um erro ao tentar editar o post',
          });
        } else {
          this.toast.create({
            variant: 'success',
            message: 'Post editado com sucesso',
          });
        }
      });
  }

  async searchPostsPage(
    page: number,
    pageSize = 8,
    title?: string,
    minRate?: number,
    categoryIds?: string[]
  ): Promise<{
    error?: PostgrestError | null;
    data?: {
      posts: Post[];
      totalCount: number;
      totalPages: number;
    }
  }> {
    const { data, error } = await this.supabase.rpc('search_posts_paginated', {
      p_title: title ?? null,
      p_min_rate: minRate ?? null,
      p_category_ids: categoryIds ?? null,
      p_page: page,
      p_page_size: pageSize,
    });

    if (error) {
      this.toast.create({ variant: 'error', message: 'Erro ao buscar posts.' });
      return { error, data: { posts: [], totalCount: 0, totalPages: 0 } }
    }
    const posts = data || [];
    const totalCount = posts.length ? posts[0].total_count : 0;
    const totalPages = posts.length ? posts[0].total_pages : 0;

    const treatedPosts = this.transformPostsData(posts);


    return { data: { posts: treatedPosts, totalCount, totalPages } };
  }

  private transformPostsData(posts: Post[]): Post[] {
    return posts.map((post) => ({
      ...post,
      created_at: new Date(post.created_at),
      updated_at: post.updated_at ? new Date(post.updated_at) : undefined,
    }));
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
        message: 'Erro ao buscar seus posts.',
      });
      return [];
    }

    return data;
  }

  async getPostReactions(postId: string) {
    const { data, error } = await this.supabase.rpc(
      'get_post_reaction_counts',
      { post_id: postId }
    );

    if (error) {
      this.toast.create({
        variant: 'error',
        message: 'Erro ao buscar reações do post.',
      });
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
      .insert([
        { post_id: postId, user_id: userId, reaction_type: 'reactionType' },
      ]);

    if (error) {
      console.error('Erro ao reagir ao post:', error);
      this.toast.create({
        variant: 'error',
        message: 'Ocorreu um erro ao tentar reagir ao post',
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
        message: 'Erro ao buscar seus posts.',
      });
      return [];
    }

    // cada item já vem com { ..., likes: number, dislikes: number }
    return data;
  }

  async getAllCategories() {
    const { data, error } = await this.supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Erro ao buscar categorias:', error);
      this.toast.create({
        variant: 'error',
        message: 'Ocorreu um erro ao tentar buscar as categorias',
      });
      return [];
    }

    return data as PostCategory[];
  }
}
