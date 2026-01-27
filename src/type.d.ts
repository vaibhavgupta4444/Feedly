import type { ReactNode } from "react";

export interface SignInFormValues {
  username: string;
  password: string;
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
  message?: string;
  actor_username?: string;
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

export interface PostItemProps {
  post: Post;
  onUpdate?: (post: Post) => void;
}


export interface PostComposerProps {
  onCreated?: (post: Post) => void;
}

export interface Props{
    children: ReactNode
}

export interface User{
    id: string
    email: string
    username: string
    posts_count?: number
    following?: string[]
    followers?: string[]
    is_active?: boolean;
    is_verified?: boolean;
    created_at?: string;
}

export interface UserContextType{
    user: User | null
    setUser: React.Dispatch<React.SetStateAction<User | null>>
    backendUrl: string
}

export interface IStatus{
  color: 'default' | 'success' | 'processing' | 'error' | 'warning';
  text: string;
  icon: string;
}

export interface NotificationsResponse {
  unread_count?: number;
  notifications?: Notification[];
  items?: Notification[];
}