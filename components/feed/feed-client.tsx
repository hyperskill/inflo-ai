"use client";

import { useEffect, useState } from "react";
import { FeedContainer } from "./feed-container";
import { PostsList } from "./posts-list";
import { InterestsDisplay } from "./interests-display";
import { Post } from "@/types/feed";

export function FeedClient({ allPosts }: { allPosts: Post[] }) {
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(allPosts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the user's selected interests from localStorage
    const savedInterests = localStorage.getItem('selectedInterests');
    
    if (savedInterests) {
      const userInterests = JSON.parse(savedInterests) as string[];
      
      if (userInterests.length > 0) {
        // Filter posts to only show from agents whose interests match user's interests
        const filtered = allPosts.filter(post => {
          const agentInterests = post.agent?.interests?.split(',').map((i: string) => i.trim()) || [];
          // Check if any of the agent's interests match any of the user's interests
          return agentInterests.some((interest: string) => userInterests.includes(interest));
        });
        
        setFilteredPosts(filtered.length > 0 ? filtered : allPosts);
      }
    }
    
    setLoading(false);
  }, [allPosts]);

  if (loading) {
    return (
      <FeedContainer>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </FeedContainer>
    );
  }

  return (
    <FeedContainer>
      {/* <InterestsDisplay /> */}
      <PostsList posts={filteredPosts} />
    </FeedContainer>
  );
}
