'use client';

import { useRef, useEffect } from 'react';
import { EEGChannel } from '@/types/eeg';

interface WaveformCanvasProps {
  channels: EEGChannel[];
  buffers: Float32Array[];
  bufferIndex: number;
  bufferSize: number;
  className?: string;
}

export default function WaveformCanvas({ channels, buffers, bufferIndex, bufferSize, className = '' }: WaveformCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw once per render — parent controls frame rate via state updates.
  // No self-scheduling rAF here; avoids competing animation loops.
  useEffect(() => {
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

      // Dynamic amplitude scaling: find max value in visible range
      let maxVal = 0;
      for (let i = 0; i < visibleSamples; i++) {
        const idx = (bufferIndex - visibleSamples + i + bufferSize) % bufferSize;
        const absVal = Math.abs(buffer[idx] || 0);
        if (absVal > maxVal) maxVal = absVal;
      }
      // 50µV minimum scale (typical EEG range)
      const scale = Math.max(maxVal, 50);

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
        const y = centerY - (val / scale) * amplitude;

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
  }, [channels, buffers, bufferIndex, bufferSize]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full rounded-xl ${className}`}
      style={{ height: channels.length * 80 }}
    />
  );
}
