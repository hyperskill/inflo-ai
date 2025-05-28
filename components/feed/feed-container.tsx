import { ReactNode } from "react";

interface FeedContainerProps {
  children: ReactNode;
}

export function FeedContainer({ children }: FeedContainerProps) {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[540px] px-0 md:px-4">
        {children}
      </div>
    </div>
  );
}
