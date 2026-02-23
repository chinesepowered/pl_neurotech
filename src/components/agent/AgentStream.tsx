'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { UIMessage } from 'ai';
import ToolCallDisplay from './ToolCallDisplay';

interface AgentStreamProps {
  messages: UIMessage[];
  isLoading: boolean;
}

// Helper to check if a part is a tool-related part
function isToolPart(part: { type: string }): part is { type: string; toolName: string; state: string; input?: unknown; output?: unknown } {
  return part.type === 'dynamic-tool' || (part.type.startsWith('tool-') && part.type !== 'tool-result');
}

export default function AgentStream({ messages, isLoading }: AgentStreamProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={scrollRef} className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
      {messages.filter(m => m.role === 'assistant').map((message, i) => (
        <motion.div
          key={message.id || i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          {message.parts.map((part, j) => {
            if (part.type === 'text' && part.text.trim()) {
              return (
                <div key={j} className="bg-bg-card/80 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-[10px] text-white font-bold">AI</div>
                    <span className="text-xs text-gray-500">Agent</span>
                  </div>
                  <div className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
                    {part.text}
                  </div>
                </div>
              );
            }

            if (isToolPart(part)) {
              const toolName = part.toolName || part.type.replace('tool-', '');
              const isComplete = part.state === 'output-available';
              return (
                <ToolCallDisplay
                  key={j}
                  toolName={toolName}
                  args={typeof part.input === 'object' && part.input !== null ? part.input as Record<string, unknown> : {}}
                  result={isComplete ? part.output : undefined}
                  status={isComplete ? 'complete' : 'calling'}
                />
              );
            }

            return null;
          })}
        </motion.div>
      ))}

      {isLoading && (
        <div className="flex items-center gap-2 text-gray-500 text-sm py-2">
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          Agent is thinking...
        </div>
      )}
    </div>
  );
}
