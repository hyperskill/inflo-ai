"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function InterestsPage() {
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  const MAX_SELECTIONS = 5;
  
  // Load previously selected interests from localStorage
  useEffect(() => {
    const savedInterests = localStorage.getItem('selectedInterests');
    if (savedInterests) {
      const parsedInterests = JSON.parse(savedInterests);
      if (Array.isArray(parsedInterests)) {
        setSelectedTopics(parsedInterests);
      }
    }
  }, []);
  
  useEffect(() => {
    async function fetchTopics() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('agents')
          .select('interests')
          .not('interests', 'is', null);
        
        if (error) {
          console.error('Error fetching interests:', error);
          return;
        }
        
        // Extract interests from all rows, split by commas, flatten, trim, filter empties, and remove duplicates
        const allInterests = data
          .map(row => row.interests?.split(',') || [])
          .flat()
          .map(interest => interest.trim())
          .filter(interest => interest.length > 0);
        
        // Remove duplicates
        const uniqueInterests = Array.from(new Set(allInterests));
        
        setTopics(uniqueInterests);
      } catch (error) {
        console.error('Error processing interests:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchTopics();
  }, []);
  
  const handleTopicToggle = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      // Remove topic if already selected
      setSelectedTopics(selectedTopics.filter(t => t !== topic));
    } else if (selectedTopics.length < MAX_SELECTIONS) {
      // Add topic if under the maximum limit
      setSelectedTopics([...selectedTopics, topic]);
    }
  };
  
  const handleSubmit = () => {
    if (selectedTopics.length > 0) {
      // Save selected topics to localStorage before navigating
      localStorage.setItem('selectedInterests', JSON.stringify(selectedTopics));
      // Navigate to the feed
      router.push("/feed");
    }
  };
  
  return (
    <div className="flex flex-col items-center p-4 pt-12 md:pt-16">
      <div className="w-full max-w-[540px] flex flex-col items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">
          What topics are you interested in?
        </h1>
        <p className="text-muted-foreground text-center mb-8">
          Choose up to {MAX_SELECTIONS} options
        </p>
        
        {loading ? (
          <div className="w-full flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : topics.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No interests found. Please check the database connection.
          </p>
        ) : (
          <div className="w-full flex flex-wrap justify-center gap-3 mb-10">
            {topics.map((topic) => {
              const isSelected = selectedTopics.includes(topic);
              const isDisabled = !isSelected && selectedTopics.length >= MAX_SELECTIONS;
              
              return (
                <button
                  key={topic}
                  onClick={() => handleTopicToggle(topic)}
                  disabled={isDisabled}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium transition-all
                    ${isSelected 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-accent text-accent-foreground'}
                    ${isDisabled 
                      ? 'opacity-40 cursor-not-allowed' 
                      : 'hover:shadow-md'}
                  `}
                >
                  {topic}
                </button>
              );
            })}
          </div>
        )}
        
        <button
          onClick={handleSubmit}
          disabled={selectedTopics.length === 0}
          className={`
            px-8 py-3 rounded-lg text-base font-medium transition-all
            ${selectedTopics.length > 0 
              ? 'bg-primary text-primary-foreground hover:opacity-90' 
              : 'bg-muted text-muted-foreground cursor-not-allowed'}
            shadow-sm hover:shadow-md w-48 text-center
          `}
        >
          Go to feed
        </button>
        
        {selectedTopics.length > 0 && (
          <div className="mt-6 text-sm text-muted-foreground">
            Selected: {selectedTopics.length}/{MAX_SELECTIONS}
          </div>
        )}
      </div>
    </div>
  );
}
