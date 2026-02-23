'use client';

import { useRef, useEffect, useCallback } from 'react';
import { EEGChannel } from '@/types/eeg';

interface WaveformCanvasProps {
  channels: EEGChannel[];
  buffers: Float32Array[];
  bufferIndex: number;
  bufferSize: number;
  isActive: boolean;
  className?: string;
}

export default function WaveformCanvas({ channels, buffers, bufferIndex, bufferSize, isActive, className = '' }: WaveformCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const channelCount = channels.length;
    const channelHeight = h / channelCount;
    const padding = 10;

    // Clear
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, w, h);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 1; i < channelCount; i++) {
      const y = i * channelHeight;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Draw time grid
    for (let x = 0; x < w; x += 80) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    // Draw waveforms
    const visibleSamples = Math.min(bufferSize, Math.floor(w * 1.5));

    for (let ch = 0; ch < channelCount; ch++) {
      const buffer = buffers[ch];
      if (!buffer) continue;

      const centerY = ch * channelHeight + channelHeight / 2;
      const amplitude = (channelHeight - padding * 2) / 2;
      const color = channels[ch].color;

      // Glow effect
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();

      for (let i = 0; i < visibleSamples; i++) {
        const idx = (bufferIndex - visibleSamples + i + bufferSize) % bufferSize;
        const val = buffer[idx] || 0;
        const x = (i / visibleSamples) * w;
        const y = centerY - (val / 100) * amplitude;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;

      // Channel label
      ctx.fillStyle = color;
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillText(channels[ch].name, 8, ch * channelHeight + 18);
    }

    if (isActive) {
      animFrameRef.current = requestAnimationFrame(draw);
    }
  }, [channels, buffers, bufferIndex, bufferSize, isActive]);

  useEffect(() => {
    if (isActive) {
      animFrameRef.current = requestAnimationFrame(draw);
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isActive, draw]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full rounded-xl ${className}`}
      style={{ height: channels.length * 80 }}
    />
  );
}
