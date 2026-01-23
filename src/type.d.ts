export interface SignInFormValues {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  is_verified: boolean;
  created_at?: string;
}

export interface Post {
  id: number;
  user_id: number;
  content: string;
  media_url?: string;
  is_private: boolean;
  likes_count: number;
  created_at: string;
  updated_at: string;
  author_username?: string;

}

export interface Comment {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  created_at: string;
  updated_at: string;
  author?: User;
  username?: string;
}

export interface Like {
  id: number;
  post_id: number;
  user_id: number;
  created_at: string;
}

export interface Follow {
  id: number;
  follower_id: number;
  following_id: number;
  created_at: string;
}

export interface Notification {
  id: number;
  user_id: number;
  actor_id: number;
  type: 'follow' | 'like' | 'comment';
  post_id?: number;
  comment_id?: number;
  is_read: boolean;
  created_at: string;
  message?: string; // Optional: human-readable message from backend
  actor_username?: string; // Optional: username from backend
  actor?: User;
  post?: Post;
  comment?: Comment;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}