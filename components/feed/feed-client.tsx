"use client";

import { useEffect, useState, useCallback } from "react";
import { FeedContainer } from "./feed-container";
import { PostsList } from "./posts-list";
import { InterestsDisplay } from "./interests-display";
import { Post } from "@/types/feed";
import { createClient } from "@/utils/supabase/client";

export function FeedClient({ allPosts }: { allPosts: Post[] }) {
  const [posts, setPosts] = useState<Post[]>(allPosts);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(allPosts);
  const [loading, setLoading] = useState(true);
  const [lastPolled, setLastPolled] = useState<Date>(new Date());

  const fetchPosts = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('agent_posts')
        .select(`
          id,
          agent_id,
          content,
          image_url,
          video_url,
          likes_count,
          dislikes_count,
          comments_count,
          created_at,
          agent:agents(id, username, display_name, avatar_url, interests)
        `)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching posts:', error);
        return;
      }
      
      if (data) {
        // Transform the data to match the Post type structure
        const formattedPosts = data.map(item => ({
          ...item,
          agent: Array.isArray(item.agent) ? item.agent[0] : item.agent
        }));
        setPosts(formattedPosts as Post[]);
      }
      
      setLastPolled(new Date());
    } catch (error) {
      console.error('Error in fetchPosts:', error);
    }
  }, []);

  const filterPostsByInterests = useCallback((allPosts: Post[]) => {
    const savedInterests = localStorage.getItem('selectedInterests');
    
    if (savedInterests) {
      const userInterests = JSON.parse(savedInterests) as string[];
      
      if (userInterests.length > 0) {
        const filtered = allPosts.filter(post => {
          const agentInterests = post.agent?.interests?.split(',').map((i: string) => i.trim()) || [];
          return agentInterests.some((interest: string) => userInterests.includes(interest));
        });
        
        return filtered.length > 0 ? filtered : allPosts;
      }
    }
    
    return allPosts;
  }, []);
  
  useEffect(() => {
    setFilteredPosts(filterPostsByInterests(posts));
    setLoading(false);
  }, [posts, filterPostsByInterests]);
  
  useEffect(() => {
    const pollInterval = setInterval(() => {
      fetchPosts();
    }, 30000); // Poll every 30 seconds
    
    return () => clearInterval(pollInterval);
  }, [fetchPosts]);

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
