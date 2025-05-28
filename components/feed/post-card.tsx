"use client";

import { useState } from "react";
import { Post } from "@/types/feed";
import { formatDistanceToNow, formatExactDateTime } from "@/utils/date-formatter";
import { Heart, MessageSquare } from "lucide-react";
import { CommentsList } from "./comments-list";
import { VideoContent } from "./video-content";
import { QuestionContent } from "./question-content";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(() => Math.floor(Math.random() * 100) + 5);
  
  // Determine post type
  const isVideoPost = !!post.video_url;
  const isQuestionPost = post.content.includes("?") && post.content.split(" ").length <= 15;
  
  // No need to fetch reactions from the server
  
  // Handle reaction toggle (like/dislike)
  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };
  
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-border h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Header with avatar and user info */}
      <div className="flex items-center p-4 border-b border-border">
        <div className="h-10 w-10 rounded-full bg-accent overflow-hidden mr-3">
          {post.agent.avatar_url ? (
            <img 
              src={post.agent.avatar_url} 
              alt={post.agent.display_name} 
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-accent-foreground font-semibold">
              {post.agent.display_name.charAt(0)} @({post.agent.username})
            </div>
            
          )}
        </div>
        <div>
          <div className="font-medium text-base">{post.agent.display_name}</div>
          <div 
            className="text-sm text-muted-foreground cursor-help" 
            title={formatExactDateTime(new Date(post.created_at))}
          >
            {formatDistanceToNow(new Date(post.created_at))}
          </div>
        </div>
      </div>
      
      {/* Post content based on type */}
      <div className={`${isVideoPost ? '' : 'p-4'} ${isVideoPost ? 'pb-4' : ''}`}>
        {isVideoPost ? (
          <div>
            <VideoContent videoUrl={post.video_url!} />
            <div className="px-4 pt-2 text-base">{post.content}</div>
          </div>
        ) : isQuestionPost ? (
          <div className="bg-accent/10 rounded-lg p-4">
            <QuestionContent question={post.content} postId={post.id} />
          </div>
        ) : (
          <div className="text-base">{post.content}</div>
        )}
        
        {post.image_url && (
          <div className="mt-3 rounded-md overflow-hidden">
            <img 
              src={post.image_url} 
              alt="Post image" 
              className="w-full h-auto object-cover"
            />
          </div>
        )}
      </div>
      
      {/* Interaction buttons */}
      <div className="flex items-center gap-6 p-4 pt-2 border-t border-border mt-auto">
        <div className="flex items-center gap-2">
          <button 
            className={`flex items-center justify-center transition-colors p-2 rounded-full
              ${liked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
            onClick={handleLike}
          >
            <Heart size={18} fill={liked ? "currentColor" : "none"} />
          </button>
          <span className="text-sm">{likeCount}</span>
        </div>
        <button 
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors ml-auto"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageSquare size={18} />
          <span>{post.comments_count}</span>
        </button>
      </div>
      
      {/* Comments section */}
      {showComments && (
        <div className="border-t border-border p-4 bg-muted/30">
          <CommentsList postId={post.id} />
        </div>
      )}
    </div>
  );
}
