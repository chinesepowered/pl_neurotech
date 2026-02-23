'use client';

import { motion } from 'framer-motion';
import StatsCards from '@/components/dashboard/StatsCards';
import RevenueChart from '@/components/dashboard/RevenueChart';
import TransactionHistory from '@/components/dashboard/TransactionHistory';
import ActivityFeed from '@/components/dashboard/ActivityFeed';

// Demo data for dashboard
const stats = [
  { label: 'Total Revenue', value: '0.058', change: '+0.02 today', color: 'text-neon-green' },
  { label: 'Datasets Listed', value: '5', color: 'text-neon-cyan' },
  { label: 'Total Sales', value: '3', change: '+1 today', color: 'text-neon-amber' },
  { label: 'Agent Purchases', value: '2', color: 'text-neon-magenta' },
];

const revenueData = [
  { label: 'Day 1', value: 0 },
  { label: 'Day 2', value: 0.005 },
  { label: 'Day 3', value: 0.005 },
  { label: 'Day 4', value: 0.015 },
  { label: 'Day 5', value: 0.023 },
  { label: 'Day 6', value: 0.038 },
  { label: 'Today', value: 0.058 },
];

const transactions = [
  {
    type: 'sale' as const,
    datasetId: 4,
    description: 'Meditation EEG - Deep Alpha State',
    amount: '0.020',
    buyer: '0xAgent...',
    txHash: '0x8f4e2d1c3b5a9f7e6d4c3b2a1f9e8d7c6b5a4f3e',
    timestamp: Date.now() - 1800000,
  },
  {
    type: 'sale' as const,
    datasetId: 1,
    description: 'Cognitive Task EEG - Working Memory',
    amount: '0.010',
    buyer: '0xAgent...',
    txHash: '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0',
    timestamp: Date.now() - 3600000,
  },
  {
    type: 'listing' as const,
    datasetId: 3,
    description: 'Motor Imagery BCI - Left/Right Hand',
    amount: '0.015',
    txHash: '0xd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3',
    timestamp: Date.now() - 7200000,
  },
  {
    type: 'sale' as const,
    datasetId: 0,
    description: 'Resting State EEG - Eyes Open',
    amount: '0.005',
    buyer: '0xBuyer...',
    txHash: '0xf6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5',
    timestamp: Date.now() - 14400000,
  },
  {
    type: 'listing' as const,
    datasetId: 0,
    description: 'Resting State EEG - Eyes Open',
    amount: '0.005',
    txHash: '0xc9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8',
    timestamp: Date.now() - 86400000,
  },
];

const activities = [
  { type: 'agent' as const, message: 'AI Agent purchased Meditation EEG - Deep Alpha State', timestamp: Date.now() - 1800000 },
  { type: 'agent' as const, message: 'AI Agent evaluated 5 datasets on marketplace', timestamp: Date.now() - 2400000 },
  { type: 'sale' as const, message: 'Cognitive Task EEG sold for 0.010 tFIL', timestamp: Date.now() - 3600000 },
  { type: 'list' as const, message: 'Motor Imagery BCI listed at 0.015 tFIL', timestamp: Date.now() - 7200000 },
  { type: 'upload' as const, message: 'EEG session uploaded to Filecoin (bafybei...)', timestamp: Date.now() - 7800000 },
  { type: 'record' as const, message: 'Recorded 120s 8-channel EEG session', timestamp: Date.now() - 9000000 },
  { type: 'sale' as const, message: 'Resting State EEG sold for 0.005 tFIL', timestamp: Date.now() - 14400000 },
  { type: 'record' as const, message: 'Recorded 30s 8-channel EEG session', timestamp: Date.now() - 86400000 },
];

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400 mb-8">Revenue, transactions, and activity from your neural data marketplace.</p>
      </motion.div>

      <div className="space-y-6">
        <StatsCards stats={stats} />

        <RevenueChart data={revenueData} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TransactionHistory transactions={transactions} />
          <ActivityFeed activities={activities} />
        </div>
      </div>
    </div>
  );
}
