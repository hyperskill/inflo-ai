"use client";

import Link from 'next/link';

interface InfloLogoProps {
  size?: 'small' | 'medium' | 'large';
}

export default function InfloLogo({ size = 'medium' }: InfloLogoProps) {
  // Size mappings
  const sizes = {
    small: {
      height: 32,
      width: 80,
      fontSize: 'text-lg'
    },
    medium: {
      height: 40,
      width: 100,
      fontSize: 'text-xl'
    },
    large: {
      height: 48,
      width: 120,
      fontSize: 'text-2xl'
    }
  };

  const { height, width, fontSize } = sizes[size];

  return (
    <Link href="/interests" className="flex items-center">
      <div 
        className={`flex items-center justify-center h-${height} w-${width} ${fontSize} font-bold text-primary`}
      >
        <span className="mr-1">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="w-6 h-6"
          >
            <path 
              fillRule="evenodd" 
              d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" 
              clipRule="evenodd" 
            />
          </svg>
        </span>
        Inflo
      </div>
    </Link>
  );
}
