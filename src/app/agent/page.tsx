'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import AgentLauncher from '@/components/agent/AgentLauncher';
import AgentStream from '@/components/agent/AgentStream';
import GlassPanel from '@/components/ui/GlassPanel';

export default function AgentPage() {
  const transport = useMemo(() => new DefaultChatTransport({ api: '/api/agent/run' }), []);

  const { messages, status, sendMessage, setMessages } = useChat({
    transport,
  });

  const isLoading = status === 'streaming' || status === 'submitted';

  const handleLaunch = (budget: string) => {
    setMessages([]);
    sendMessage({
      text: `I have a budget of ${budget} tFIL. Please browse the neural data marketplace, evaluate the available datasets, and purchase the best one(s) for AI training research. Explain your reasoning at each step.`,
    });
  };

  const hasStarted = messages.length > 0;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">Autonomous AI Buyer Agent</h1>
        <p className="text-gray-400 mb-8">
          Launch an AI agent powered by Cerebras to autonomously browse, evaluate, and purchase neural datasets.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <AgentLauncher onLaunch={handleLaunch} isRunning={isLoading} />

          <GlassPanel>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Agent Capabilities</h3>
            <div className="space-y-3 text-sm">
              {[
                { icon: '\uD83D\uDD0D', label: 'Browse Marketplace', desc: 'Scan all available datasets' },
                { icon: '\uD83D\uDCCA', label: 'Evaluate Quality', desc: 'Score datasets on multiple criteria' },
                { icon: '\uD83D\uDCB0', label: 'Purchase Data', desc: 'Execute on-chain purchases' },
              ].map((cap, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-lg">{cap.icon}</span>
                  <div>
                    <div className="font-medium">{cap.label}</div>
                    <div className="text-xs text-gray-500">{cap.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Model Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Model</span><span className="font-mono text-xs">llama-3.3-70b</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Provider</span><span>Cerebras</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Speed</span><span className="text-neon-green">~2000 tok/s</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Max Steps</span><span>10</span></div>
            </div>
          </GlassPanel>
        </div>

        <div className="lg:col-span-2">
          {hasStarted ? (
            <AgentStream messages={messages} isLoading={isLoading} />
          ) : (
            <div className="glass-panel rounded-2xl p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-white/10 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-600">
                  <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">Ready to Launch</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Set your budget and launch the AI agent. Watch it browse the marketplace, evaluate datasets,
                and make purchase decisions in real-time.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
