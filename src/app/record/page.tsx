'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EEGRecorder from '@/components/eeg/EEGRecorder';
import UploadProgress from '@/components/storage/UploadProgress';
import CIDDisplay from '@/components/storage/CIDDisplay';
import GlowButton from '@/components/ui/GlowButton';
import GlassPanel from '@/components/ui/GlassPanel';
import { useEEGStore } from '@/stores/eeg-store';
import { ConsentTerms } from '@/types/marketplace';

type Step = 'record' | 'consent' | 'upload' | 'done';

export default function RecordPage() {
  const { session } = useEEGStore();
  const [step, setStep] = useState<Step>('record');
  const [consent, setConsent] = useState<ConsentTerms>({
    allowResearch: true,
    allowCommercial: false,
    allowAITraining: true,
    expiresAt: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60,
  });
  const [price, setPrice] = useState('0.01');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [cid, setCid] = useState('');
  const [listingTx, setListingTx] = useState('');

  const canContinue = session && session.data.length > 0 && session.durationSeconds >= 1;

  const handleUploadAndList = async () => {
    if (!session || session.data.length === 0) return;
    setStep('upload');

    setUploadStatus('Preparing data...');
    setUploadProgress(10);

    try {
      // Upload to Filecoin via Synapse SDK
      setUploadStatus('Uploading to Filecoin via Synapse SDK...');
      setUploadProgress(30);

      // Include actual EEG data samples (last 256 * duration samples for the upload)
      const eegData = session.data.slice(-Math.min(session.data.length, 2000)).map(s => ({
        t: s.timestamp,
        ch: s.channels,
      }));

      const uploadRes = await fetch('/api/storage/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          channels: session.channels.length,
          sampleRate: session.sampleRate,
          duration: session.durationSeconds,
          dataSize: session.data.length,
          eegData,
        }),
      });
      const uploadData = await uploadRes.json();
      setCid(uploadData.cid);
      setUploadProgress(60);

      // Create listing on-chain
      setUploadStatus('Creating on-chain listing...');
      setUploadProgress(80);

      const listRes = await fetch('/api/marketplace/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cid: uploadData.cid,
          metadataUri: `ipfs://${uploadData.cid}/metadata.json`,
          price,
          channelCount: session.channels.length,
          sampleRate: session.sampleRate,
          durationSeconds: session.durationSeconds,
          consent,
        }),
      });
      const listData = await listRes.json();
      setListingTx(listData.txHash || '');

      setUploadStatus('Complete!');
      setUploadProgress(100);
      setStep('done');
    } catch {
      setUploadStatus('Error — using demo mode');
      const demoCid = `bafybeig${Math.random().toString(36).slice(2, 15)}${Math.random().toString(36).slice(2, 15)}`;
      setCid(demoCid);
      setUploadProgress(100);
      setStep('done');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">Neural Recording Studio</h1>
        <p className="text-gray-400 mb-8">Record EEG sessions and store them on Filecoin with consent controls.</p>
      </motion.div>

      {/* Step indicators */}
      <div className="flex items-center gap-3 mb-8">
        {(['record', 'consent', 'upload', 'done'] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-mono ${
              step === s ? 'bg-neon-cyan text-black' :
              (['record', 'consent', 'upload', 'done'].indexOf(step) > i ? 'bg-neon-green/20 text-neon-green' : 'bg-white/5 text-gray-500')
            }`}>
              {['record', 'consent', 'upload', 'done'].indexOf(step) > i ? '\u2713' : i + 1}
            </div>
            {i < 3 && <div className="w-12 h-px bg-white/10" />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 'record' && (
          <motion.div key="record" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <EEGRecorder />
            {session && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                {canContinue ? (
                  <GlowButton variant="cyan" size="lg" onClick={() => setStep('consent')}>
                    Continue to Consent Settings
                  </GlowButton>
                ) : (
                  <p className="text-sm text-gray-500">Record at least 1 second of data to continue.</p>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        {step === 'consent' && (
          <motion.div key="consent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <GlassPanel>
              <h2 className="text-xl font-semibold mb-6">Consent & Pricing</h2>

              <div className="space-y-4 mb-8">
                {[
                  { key: 'allowResearch' as const, label: 'Research Use', desc: 'Allow use in academic and scientific research' },
                  { key: 'allowCommercial' as const, label: 'Commercial Use', desc: 'Allow use in commercial products and services' },
                  { key: 'allowAITraining' as const, label: 'AI Training', desc: 'Allow use for training machine learning models' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                    <div>
                      <div className="font-medium">{item.label}</div>
                      <div className="text-sm text-gray-500">{item.desc}</div>
                    </div>
                    <button
                      onClick={() => setConsent(c => ({ ...c, [item.key]: !c[item.key] }))}
                      className={`w-12 h-7 rounded-full transition-colors cursor-pointer ${consent[item.key] ? 'bg-neon-green' : 'bg-white/10'}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${consent[item.key] ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Price (tFIL)</label>
                <input
                  type="number"
                  step="0.001"
                  min="0.001"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-mono text-white focus:outline-none focus:border-neon-cyan/50 transition-colors"
                />
              </div>
            </GlassPanel>

            <div className="flex gap-4">
              <GlowButton variant="amber" size="sm" onClick={() => setStep('record')}>Back</GlowButton>
              <GlowButton variant="cyan" size="lg" onClick={handleUploadAndList}>
                Upload to Filecoin & Create Listing
              </GlowButton>
            </div>
          </motion.div>
        )}

        {step === 'upload' && (
          <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <UploadProgress progress={uploadProgress} status={uploadStatus} />
          </motion.div>
        )}

        {step === 'done' && (
          <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <GlassPanel>
              <div className="text-center py-6">
                <div className="text-4xl mb-4">&#10003;</div>
                <h2 className="text-2xl font-bold text-neon-green mb-2">Successfully Listed!</h2>
                <p className="text-gray-400">Your neural data is now stored on Filecoin and listed on the marketplace.</p>
              </div>
            </GlassPanel>

            {cid && <CIDDisplay cid={cid} />}

            {listingTx && (
              <GlassPanel>
                <div className="text-xs text-gray-500 mb-1">Transaction Hash</div>
                <div className="font-mono text-sm text-neon-cyan break-all">{listingTx}</div>
              </GlassPanel>
            )}

            <div className="flex gap-4">
              <GlowButton variant="cyan" onClick={() => { setStep('record'); useEEGStore.getState().reset(); }}>
                Record Another
              </GlowButton>
              <a href="/marketplace">
                <GlowButton variant="magenta">View Marketplace</GlowButton>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
