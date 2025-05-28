"use client";

import { PostCard } from "./post-card";
import { Agent, Post } from "@/types/feed";

interface PostsListProps {
  posts: Post[];
}

export function PostsList({ posts }: PostsListProps) {
  if (!posts.length) {
    return <div className="text-center py-8 text-muted-foreground">No posts to display</div>;
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {posts.map((post) => (
        <div key={post.id}>
          <PostCard post={post} />
        </div>
      ))}
    </div>
  );
}
