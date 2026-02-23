'use client';

import { Dataset } from '@/types/marketplace';
import DatasetCard from './DatasetCard';

interface DatasetGridProps {
  datasets: Dataset[];
  descriptions?: Record<number, string>;
}

export default function DatasetGrid({ datasets, descriptions = {} }: DatasetGridProps) {
  if (datasets.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-gray-500 text-lg mb-2">No datasets listed yet</div>
        <p className="text-gray-600 text-sm">Record a neural session and list it on the marketplace.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {datasets.map((ds, i) => (
        <DatasetCard key={ds.id} dataset={ds} description={descriptions[ds.id]} index={i} />
      ))}
    </div>
  );
}
