'use client';

import { useState } from 'react';
import { ConsentTerms } from '@/types/marketplace';
import GlowButton from '@/components/ui/GlowButton';
import GlassPanel from '@/components/ui/GlassPanel';

interface ListingFormProps {
  onSubmit: (data: { price: string; consent: ConsentTerms }) => void;
  loading?: boolean;
}

export default function ListingForm({ onSubmit, loading = false }: ListingFormProps) {
  const [price, setPrice] = useState('0.01');
  const [consent, setConsent] = useState<ConsentTerms>({
    allowResearch: true,
    allowCommercial: false,
    allowAITraining: true,
    expiresAt: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60,
  });

  return (
    <GlassPanel>
      <h3 className="text-lg font-semibold mb-6">Listing Settings</h3>

      <div className="space-y-4 mb-6">
        {[
          { key: 'allowResearch' as const, label: 'Research Use', desc: 'Academic and scientific research' },
          { key: 'allowCommercial' as const, label: 'Commercial Use', desc: 'Commercial products and services' },
          { key: 'allowAITraining' as const, label: 'AI Training', desc: 'Machine learning model training' },
        ].map(item => (
          <div key={item.key} className="flex items-center justify-between py-2">
            <div>
              <div className="text-sm font-medium">{item.label}</div>
              <div className="text-xs text-gray-500">{item.desc}</div>
            </div>
            <button
              onClick={() => setConsent(c => ({ ...c, [item.key]: !c[item.key] }))}
              className={`w-11 h-6 rounded-full transition-colors cursor-pointer ${consent[item.key] ? 'bg-neon-green' : 'bg-white/10'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${consent[item.key] ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <label className="block text-sm text-gray-400 mb-2">Price (tFIL)</label>
        <input
          type="number"
          step="0.001"
          min="0"
          value={price}
          onChange={e => setPrice(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-mono text-white focus:outline-none focus:border-neon-cyan/50"
        />
      </div>

      <GlowButton variant="cyan" onClick={() => onSubmit({ price, consent })} disabled={loading}>
        {loading ? 'Creating Listing...' : 'Create Listing'}
      </GlowButton>
    </GlassPanel>
  );
}
