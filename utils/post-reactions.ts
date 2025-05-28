import { createClient } from './supabase/client';
import { PostReaction, ReactionType } from '@/types/feed';

// Get client ID from local storage or create a new one if it doesn't exist
const getClientId = (): string => {
  if (typeof window === 'undefined') return '';
  
  let clientId = localStorage.getItem('client_id');
  if (!clientId) {
    clientId = crypto.randomUUID();
    localStorage.setItem('client_id', clientId);
  }
  return clientId;
};

// Fallback to localStorage if Supabase is not working
const getLocalStorageKey = (postId: string) => `post_reaction_${postId}`;

// Get user's reaction to a specific post
export const getUserReaction = async (postId: string): Promise<ReactionType | null> => {
  const clientId = getClientId();
  
  if (!clientId) return null;
  
  // First check localStorage for cached reaction
  if (typeof window !== 'undefined') {
    const localReaction = localStorage.getItem(getLocalStorageKey(postId));
    if (localReaction) {
      return localReaction as ReactionType;
    }
  }
  
  try {
    // Try to get reaction from Supabase
    const supabase = createClient();
    
    // Use RPC call instead of direct table access
    const { data, error } = await supabase
      .rpc('get_client_reaction', {
        p_client_id: clientId,
        p_post_id: postId
      });
    
    if (error) {
      console.error('Error fetching user reaction:', error);
      return null;
    }
    
    if (!data || data.length === 0) return null;
    
    // Store in localStorage for future use
    if (typeof window !== 'undefined' && data.reaction) {
      localStorage.setItem(getLocalStorageKey(postId), data.reaction);
    }
    
    return data.reaction as ReactionType;
  } catch (e) {
    console.error('Exception in getUserReaction:', e);
    return null;
  }
};

// Toggle user's reaction to a post (add, remove, or change reaction)
export const toggleReaction = async (postId: string, reactionType: ReactionType): Promise<ReactionType | null> => {
  const clientId = getClientId();
  
  if (!clientId) return null;
  
  // Always update localStorage immediately for responsive UI
  const key = getLocalStorageKey(postId);
  const currentReaction = localStorage.getItem(key) as ReactionType | null;
  
  // If same reaction, remove it
  if (currentReaction === reactionType) {
    localStorage.removeItem(key);
  } else {
    // Otherwise set the new reaction
    localStorage.setItem(key, reactionType);
  }
  
  try {
    const supabase = createClient();
    
    // Use RPC call to toggle reaction
    const { data, error } = await supabase
      .rpc('toggle_client_reaction', {
        p_client_id: clientId,
        p_post_id: postId,
        p_reaction: reactionType
      });
    
    if (error) {
      console.error('Error toggling reaction:', error);
      // Return the localStorage state since that's what the UI is showing
      return currentReaction === reactionType ? null : reactionType;
    }
    
    // Return the result from the server
    return data ? data.reaction as ReactionType : null;
  } catch (e) {
    console.error('Exception in toggleReaction:', e);
    // Return the localStorage state since that's what the UI is showing
    return currentReaction === reactionType ? null : reactionType;
  }
};
