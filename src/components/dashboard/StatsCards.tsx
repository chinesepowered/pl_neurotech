'use client';

import { motion } from 'framer-motion';

interface Stat {
  label: string;
  value: string;
  change?: string;
  color: string;
}

interface StatsCardsProps {
  stats: Stat[];
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="glass-panel rounded-xl p-5"
        >
          <div className="text-xs text-gray-500 mb-2">{stat.label}</div>
          <div className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</div>
          {stat.change && (
            <div className="text-xs text-neon-green mt-1">{stat.change}</div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
