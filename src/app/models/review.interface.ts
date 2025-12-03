export interface Review {
  id: string;
  slug: string;
  title: string;
  rating: number;
  content: string;
  author: {
    name: string;
    avatar_url: string;
  }
  book: {
    title: string;
    author: string;
    cover_image_url: string;
  }
  categories: {
    id: string;
    name: string;
  }[];
  created_at: Date;
  updated_at: Date | null;
}

export interface PaginatedReviews {
  reviews: Review[];
  total_count: number;
  total_pages: number;
}

export interface ReviewSearchParams {
  search_text?: string;
  rating?: number;
  category_ids?: string[];
  page: number;
  page_size?: number;
}