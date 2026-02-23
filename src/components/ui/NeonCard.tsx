'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface NeonCardProps {
  children: ReactNode;
  glow?: 'cyan' | 'magenta' | 'green' | 'amber' | 'none';
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

const glows = {
  cyan: 'hover:shadow-[0_0_20px_rgba(0,255,255,0.15)] border-cyan-500/20',
  magenta: 'hover:shadow-[0_0_20px_rgba(255,0,255,0.15)] border-purple-500/20',
  green: 'hover:shadow-[0_0_20px_rgba(57,255,20,0.15)] border-green-500/20',
  amber: 'hover:shadow-[0_0_20px_rgba(255,215,64,0.15)] border-amber-500/20',
  none: 'border-white/10',
};

export default function NeonCard({ children, glow = 'cyan', className = '', hover = true, onClick }: NeonCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
      onClick={onClick}
      className={`bg-bg-card/80 backdrop-blur-xl border ${glows[glow]} rounded-2xl p-6 transition-shadow duration-300 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
}
