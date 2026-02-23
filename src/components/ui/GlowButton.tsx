'use client';

import { motion } from 'framer-motion';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'cyan' | 'magenta' | 'green' | 'amber';
  size?: 'sm' | 'md' | 'lg';
}

const variants = {
  cyan: 'from-cyan-500 to-blue-500 shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:shadow-[0_0_30px_rgba(0,255,255,0.5)]',
  magenta: 'from-pink-500 to-purple-500 shadow-[0_0_20px_rgba(255,0,255,0.3)] hover:shadow-[0_0_30px_rgba(255,0,255,0.5)]',
  green: 'from-green-400 to-emerald-500 shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)]',
  amber: 'from-amber-400 to-orange-500 shadow-[0_0_20px_rgba(255,215,64,0.3)] hover:shadow-[0_0_30px_rgba(255,215,64,0.5)]',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export default function GlowButton({ children, variant = 'cyan', size = 'md', className = '', ...props }: GlowButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative bg-gradient-to-r ${variants[variant]} ${sizes[size]} rounded-xl font-semibold text-white transition-shadow duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${className}`}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {children}
    </motion.button>
  );
}
