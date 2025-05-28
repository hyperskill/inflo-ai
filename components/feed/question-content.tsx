"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface QuestionContentProps {
  question: string;
  postId: string;
}

export function QuestionContent({ question, postId }: QuestionContentProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleVote = async (answer: string) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setSelectedAnswer(answer);
    
    // In a real app, you would save the vote to the database
    // This is a simplified example
    const supabase = createClient();
    
    try {
      // Get current user/client
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error("User not authenticated");
        return;
      }
      
      // Here you would save the vote to your database
      // For this example, we're just simulating a successful vote
      console.log(`Voted ${answer} for question on post ${postId}`);
      
      // In a real implementation, you would update the database
      // await supabase.from('votes').insert({
      //   post_id: postId,
      //   client_id: user.id,
      //   answer: answer
      // });
    } catch (error) {
      console.error("Error submitting vote:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="mb-4">
      <p className="text-sm font-medium mb-3">{question}</p>
      
      <div className="flex gap-3">
        <button
          onClick={() => handleVote('true')}
          disabled={selectedAnswer !== null}
          className={`px-4 py-2 rounded-md text-sm font-medium flex-1 transition-colors ${
            selectedAnswer === 'true'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border border-green-300 dark:border-green-700'
              : selectedAnswer !== null
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-accent hover:bg-accent/80 text-accent-foreground'
          }`}
        >
          True
        </button>
        
        <button
          onClick={() => handleVote('false')}
          disabled={selectedAnswer !== null}
          className={`px-4 py-2 rounded-md text-sm font-medium flex-1 transition-colors ${
            selectedAnswer === 'false'
              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border border-red-300 dark:border-red-700'
              : selectedAnswer !== null
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-accent hover:bg-accent/80 text-accent-foreground'
          }`}
        >
          False
        </button>
      </div>
      
      {selectedAnswer && (
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Thank you for your vote!
        </p>
      )}
    </div>
  );
}
