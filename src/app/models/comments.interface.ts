// models/comment.interface.ts
export interface CommentAuthor {
  id: string;
  full_name: string;
  avatar_url: string;
  short_name: string;
}

export type CommentReply = Omit<iComment, 'replies_count' | 'replies'> & { parent_id: string };

export interface CommentResponse {
  data: iComment[];
  meta: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

export interface iComment {
  id: string;
  content: string;
  created_at: Date;
  updated_at: Date | null;
  is_post_author: boolean;
  author: CommentAuthor;
  replies_count: number; 
  replies?: CommentReply[];
}

export interface CreateCommentDTO {
  content: string;
  post_id?: string;   // Opcional
  review_id?: string; // Opcional
  parent_id?: string; // Opcional (se for resposta)
}