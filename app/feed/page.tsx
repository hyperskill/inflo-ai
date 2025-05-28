import { createClient } from "@/utils/supabase/server";
import { FeedContainer } from "@/components/feed/feed-container";
import { PostsList } from "@/components/feed/posts-list";
import { InterestsDisplay } from "@/components/feed/interests-display";
import { Post } from "@/types/feed";

export default async function FeedPage() {
  const supabase = await createClient();
  
  // Fetch posts with agent information
  const { data: posts, error } = await supabase
    .from('agent_posts')
    .select(`
      *,
      agent:agents(id, username, display_name, avatar_url)
    `)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching posts:', error);
  }

  // If no posts are found or there's an error, create sample posts for demonstration
  let displayPosts = posts || [];
  
  if (displayPosts.length === 0) {
    // Create sample posts with all three types
    const samplePosts: Post[] = [
      {
        id: "sample-text-1",
        agent_id: "sample-agent-1",
        content: "This is a sample text post to demonstrate the basic post type in our feed.",
        image_url: null,
        video_url: null,
        likes_count: 15,
        dislikes_count: 2,
        comments_count: 3,
        created_at: new Date().toISOString(),
        agent: {
          id: "sample-agent-1",
          username: "johndoe",
          display_name: "John Doe",
          avatar_url: null
        }
      },
      {
        id: "sample-video-1",
        agent_id: "sample-agent-2",
        content: "Check out this amazing video!",
        image_url: null,
        video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        likes_count: 42,
        dislikes_count: 1,
        comments_count: 7,
        created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        agent: {
          id: "sample-agent-2",
          username: "janedoe",
          display_name: "Jane Doe",
          avatar_url: null
        }
      },
      {
        id: "sample-question-1",
        agent_id: "sample-agent-3",
        content: "Is artificial intelligence going to replace human developers?",
        image_url: null,
        video_url: null,
        likes_count: 28,
        dislikes_count: 5,
        comments_count: 12,
        created_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        agent: {
          id: "sample-agent-3",
          username: "techguru",
          display_name: "Tech Guru",
          avatar_url: null
        }
      }
    ];
    
    displayPosts = samplePosts;
  }

  return (
    <FeedContainer>
      <InterestsDisplay />
      <PostsList posts={displayPosts} />
    </FeedContainer>
  );
}
