'use client';

import { useEffect, useState } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export default function TypewriterText({ text, speed = 30, className = '', onComplete }: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setDisplayed('');
    setIndex(0);
  }, [text]);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayed(prev => prev + text[index]);
        setIndex(i => i + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (index === text.length && text.length > 0) {
      onComplete?.();
    }
  }, [index, text, speed, onComplete]);

  return (
    <span className={className}>
      {displayed}
      {index < text.length && <span className="animate-blink text-neon-cyan">|</span>}
    </span>
  );
}
