// models/comment.interface.ts

import { UserProfile } from "./user.interface";

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  updated_at?: string;
  parent_id?: string;
  
  // Relação Deep Select
  author: UserProfile;
  // Propriedades auxiliares para a UI (não vêm do Insert)
  replies_count: number; 
  replies?: Comment[];
}

export interface CreateCommentDTO {
  content: string;
  post_id?: string;   // Opcional
  review_id?: string; // Opcional
  parent_id?: string; // Opcional (se for resposta)
}