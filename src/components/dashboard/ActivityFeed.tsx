'use client';

import { motion } from 'framer-motion';
import GlassPanel from '@/components/ui/GlassPanel';

interface Activity {
  type: 'record' | 'upload' | 'list' | 'sale' | 'agent';
  message: string;
  timestamp: number;
}

interface ActivityFeedProps {
  activities: Activity[];
}

const icons: Record<string, { emoji: string; color: string }> = {
  record: { emoji: '\u26A1', color: 'bg-cyan-500/20' },
  upload: { emoji: '\uD83D\uDCE6', color: 'bg-green-500/20' },
  list: { emoji: '\uD83C\uDFEA', color: 'bg-purple-500/20' },
  sale: { emoji: '\uD83D\uDCB0', color: 'bg-amber-500/20' },
  agent: { emoji: '\uD83E\uDD16', color: 'bg-pink-500/20' },
};

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <GlassPanel>
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {activities.map((activity, i) => {
          const icon = icons[activity.type] || icons.record;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-3"
            >
              <div className={`w-8 h-8 rounded-lg ${icon.color} flex items-center justify-center text-sm flex-shrink-0`}>
                {icon.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm">{activity.message}</div>
                <div className="text-xs text-gray-600 mt-0.5">
                  {new Date(activity.timestamp).toLocaleString()}
                </div>
              </div>
            </motion.div>
          );
        })}
        {activities.length === 0 && (
          <div className="text-center text-gray-600 py-8 text-sm">No activity yet</div>
        )}
      </div>
    </GlassPanel>
  );
}
