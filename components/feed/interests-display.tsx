"use client";

import { useState, useEffect } from 'react';

export function InterestsDisplay() {
  const [interests, setInterests] = useState<string[]>([]);
  
  useEffect(() => {
    // Get selected interests from localStorage
    if (typeof window !== 'undefined') {
      const storedInterests = localStorage.getItem('selectedInterests');
      if (storedInterests) {
        try {
          const parsedInterests = JSON.parse(storedInterests);
          setInterests(Array.isArray(parsedInterests) ? parsedInterests : []);
        } catch (e) {
          console.error('Error parsing stored interests:', e);
          setInterests([]);
        }
      }
    }
  }, []);
  
  // Don't render anything if no interests are selected
  if (interests.length === 0) {
    return null;
  }
  
  return (
    <div className="w-full mb-6 pb-4">
      <h2 className="text-base font-medium mb-1">Interests selected:</h2>
      <p className="text-muted-foreground text-sm italic">
        {interests.join(', ')}
      </p>
    </div>
  );
}
