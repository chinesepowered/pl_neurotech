'use client';

interface PulseIndicatorProps {
  color?: 'cyan' | 'green' | 'red' | 'amber';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const colors = {
  cyan: 'bg-cyan-400',
  green: 'bg-green-400',
  red: 'bg-red-400',
  amber: 'bg-amber-400',
};

const ringColors = {
  cyan: 'bg-cyan-400/30',
  green: 'bg-green-400/30',
  red: 'bg-red-400/30',
  amber: 'bg-amber-400/30',
};

const sizeMap = { sm: 'w-2 h-2', md: 'w-3 h-3', lg: 'w-4 h-4' };
const ringSizeMap = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' };

export default function PulseIndicator({ color = 'cyan', size = 'md', label }: PulseIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex items-center justify-center">
        <span className={`absolute ${ringSizeMap[size]} ${ringColors[color]} rounded-full animate-ping`} />
        <span className={`relative ${sizeMap[size]} ${colors[color]} rounded-full`} />
      </div>
      {label && <span className="text-sm text-gray-400">{label}</span>}
    </div>
  );
}
