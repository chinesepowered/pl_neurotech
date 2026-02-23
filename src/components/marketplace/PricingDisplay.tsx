'use client';

import { ethers } from 'ethers';

interface PricingDisplayProps {
  priceWei: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function PricingDisplay({ priceWei, size = 'md' }: PricingDisplayProps) {
  const eth = ethers.formatEther(priceWei);
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <div className={`font-mono font-bold ${sizeClasses[size]}`}>
      <span className="text-neon-amber">{parseFloat(eth).toFixed(4)}</span>
      <span className="text-gray-500 text-xs ml-1">tFIL</span>
    </div>
  );
}
