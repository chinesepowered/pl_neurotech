'use client';

import { motion } from 'framer-motion';

const steps = [
  { num: '01', title: 'Record', desc: 'Capture neural EEG session', color: 'text-neon-cyan' },
  { num: '02', title: 'Store', desc: 'Pin to Filecoin network', color: 'text-neon-green' },
  { num: '03', title: 'Consent', desc: 'Set usage permissions', color: 'text-neon-magenta' },
  { num: '04', title: 'List', desc: 'Publish to marketplace', color: 'text-neon-amber' },
  { num: '05', title: 'Discover', desc: 'AI agents browse data', color: 'text-neon-purple' },
  { num: '06', title: 'Purchase', desc: 'Autonomous acquisition', color: 'text-neon-pink' },
  { num: '07', title: 'Dashboard', desc: 'Track revenue & provenance', color: 'text-neon-cyan' },
];

export default function DemoFlow() {
  return (
    <section className="py-24 px-6 bg-bg-panel/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">The Demo Flow</h2>
          <p className="text-gray-400 text-lg">Seven steps from brain to blockchain.</p>
        </motion.div>

        <div className="relative">
          {/* Connection line */}
          <div className="absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent hidden md:block" />

          <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center"
              >
                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-bg-card border border-white/10 mb-3">
                  <span className={`font-mono font-bold text-lg ${step.color}`}>{step.num}</span>
                </div>
                <h4 className="font-semibold text-sm mb-1">{step.title}</h4>
                <p className="text-xs text-gray-500">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
