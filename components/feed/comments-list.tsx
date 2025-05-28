"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { formatDistanceToNow } from "@/utils/date-formatter";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  author_type: 'agent' | 'client';
  author_id: string;
  author_name: string;
  author_avatar?: string;
}

interface CommentsListProps {
  postId: string;
}

export function CommentsList({ postId }: CommentsListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      const supabase = createClient();
      
      try {
        // Fetch comments for the post
        const { data, error } = await supabase
          .from('comments')
          .select(`
            id,
            content,
            created_at,
            author_type,
            author_id
          `)
          .eq('post_id', postId)
          .order('created_at', { ascending: true });
          
        if (error) {
          console.error('Error fetching comments:', error);
          return;
        }
        
        // For each comment, fetch the author information
        const commentsWithAuthors = await Promise.all(
          data.map(async (comment) => {
            if (comment.author_type === 'agent') {
              const { data: agent } = await supabase
                .from('agents')
                .select('display_name, avatar_url')
                .eq('id', comment.author_id)
                .single();
                
              return {
                ...comment,
                author_name: agent?.display_name || 'Unknown Agent',
                author_avatar: agent?.avatar_url
              };
            } else {
              const { data: client } = await supabase
                .from('clients')
                .select('nickname')
                .eq('id', comment.author_id)
                .single();
                
              return {
                ...comment,
                author_name: client?.nickname || 'Unknown User'
              };
            }
          })
        );
        
        setComments(commentsWithAuthors);
      } catch (error) {
        console.error('Error processing comments:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchComments();
  }, [postId]);
  
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    const supabase = createClient();
    let clientId = null;
    let authorName = 'Anonymous';
    
    // Try to get authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Get client record if user is authenticated
      const { data: clientData } = await supabase
        .from('clients')
        .select('id, nickname')
        .eq('user_id', user.id)
        .maybeSingle();
        
      // Use client ID from database or user ID if client record doesn't exist
      clientId = clientData?.id || user.id;
      authorName = clientData?.nickname || 'You';
    }
    
    // Add the comment
    const { data: newCommentData, error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        author_type: 'client',
        author_id: clientId,
        content: newComment
      })
      .select('id, content, created_at, author_type, author_id')
      .single();
      
    if (error) {
      console.error('Error adding comment:', error);
      setIsSubmitting(false);
      return;
    }
    
    // Add the new comment to the list with author information
    setComments([...comments, {
      ...newCommentData,
      author_name: authorName
    }]);
    
    // Clear the input
    setNewComment("");
    setIsSubmitting(false);
  };
  
  return (
    <div className="mt-4 pt-3 border-t border-border">
      <h4 className="text-sm font-medium mb-3">Comments</h4>
      
      {isLoading ? (
        <div className="text-center py-2 text-sm text-muted-foreground">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-2 text-sm text-muted-foreground">No comments yet</div>
      ) : (
        <div className="space-y-3 mb-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-2">
              <div className="h-7 w-7 rounded-full bg-accent overflow-hidden flex-shrink-0">
                {comment.author_avatar ? (
                  <img 
                    src={comment.author_avatar} 
                    alt={comment.author_name} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-xs text-accent-foreground font-semibold">
                    {comment.author_name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="bg-accent/30 rounded-lg p-2 text-xs">
                  <div className="font-medium text-xs">{comment.author_name}</div>
                  <div>{comment.content}</div>
                </div>
                <div className="flex items-center gap-3 mt-1 pl-1">
                  <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                    <ThumbsUp size={12} />
                  </button>
                  <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                    <ThumbsDown size={12} />
                  </button>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.created_at))}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Add comment form */}
      <form onSubmit={handleSubmitComment} className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 text-sm px-3 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button 
          type="submit"
          disabled={!newComment.trim() || isSubmitting}
          className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Comment
        </button>
      </form>
    </div>
  );
}
