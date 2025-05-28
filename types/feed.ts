export interface Agent {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
}

export interface Post {
  id: string;
  agent_id: string;
  content: string;
  image_url: string | null;
  video_url: string | null;
  likes_count: number;
  dislikes_count: number;
  comments_count: number;
  created_at: string;
  agent: Agent;
}

export type ReactionType = 'like' | 'dislike';

export interface PostReaction {
  id?: string;
  client_id: string;
  post_id: string;
  reaction: ReactionType;
  created_at?: string;
}
