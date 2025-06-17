// components/magicui/animated-list.tsx
"use client";

import React, { ReactElement, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface AnimatedListProps {
  className?: string;
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}

export const AnimatedList = React.memo(
  ({ className, children, delay = 500, duration = 300 }: AnimatedListProps) => {
    const [index, setIndex] = useState(0);
    const childrenArray = React.Children.toArray(children);
    const totalChildren = childrenArray.length;

    useEffect(() => {
      if (index >= totalChildren) return;

      const timer = setTimeout(() => {
        setIndex(prev => Math.min(prev + 1, totalChildren));
      }, delay);

      return () => clearTimeout(timer);
    }, [index, totalChildren, delay]);

    const itemsToShow = useMemo(() => {
      return childrenArray.slice(0, index);
    }, [index, childrenArray]);

    return (
      <div className={`flex flex-col items-center gap-4 ${className}`}>
        <AnimatePresence>
          {itemsToShow.map((item) => (
            <AnimatedListItem key={(item as ReactElement).key} duration={duration}>
              {item}
            </AnimatedListItem>
          ))}
        </AnimatePresence>
      </div>
    );
  }
);

AnimatedList.displayName = "AnimatedList";

interface AnimatedListItemProps {
  children: React.ReactNode;
  duration?: number;
}

export function AnimatedListItem({ children, duration = 300 }: AnimatedListItemProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{
        duration: duration / 1000,
        ease: "easeOut",
        bounce: 0.25
      }}
      layout
      className="mx-auto w-full"
    >
      {children}
    </motion.div>
  );
}