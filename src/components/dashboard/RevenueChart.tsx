'use client';

import { useRef, useEffect } from 'react';
import GlassPanel from '@/components/ui/GlassPanel';

interface DataPoint {
  label: string;
  value: number;
}

interface RevenueChartProps {
  data: DataPoint[];
  title?: string;
}

export default function RevenueChart({ data, title = 'Revenue Over Time' }: RevenueChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const padding = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    const maxVal = Math.max(...data.map(d => d.value), 0.001);

    // Clear
    ctx.fillStyle = 'transparent';
    ctx.fillRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();

      ctx.fillStyle = '#666';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'right';
      const val = (maxVal * (1 - i / 4)).toFixed(4);
      ctx.fillText(val, padding.left - 8, y + 4);
    }

    // Draw gradient fill
    const gradient = ctx.createLinearGradient(0, padding.top, 0, h - padding.bottom);
    gradient.addColorStop(0, 'rgba(0, 255, 255, 0.15)');
    gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');

    ctx.beginPath();
    ctx.moveTo(padding.left, h - padding.bottom);

    data.forEach((point, i) => {
      const x = padding.left + (i / (data.length - 1)) * chartW;
      const y = padding.top + (1 - point.value / maxVal) * chartH;
      ctx.lineTo(x, y);
    });

    ctx.lineTo(padding.left + chartW, h - padding.bottom);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 8;

    data.forEach((point, i) => {
      const x = padding.left + (i / (data.length - 1)) * chartW;
      const y = padding.top + (1 - point.value / maxVal) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw dots
    data.forEach((point, i) => {
      const x = padding.left + (i / (data.length - 1)) * chartW;
      const y = padding.top + (1 - point.value / maxVal) * chartH;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#00ffff';
      ctx.fill();
      ctx.strokeStyle = '#0a0a0f';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Labels
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#666';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    data.forEach((point, i) => {
      if (i % Math.ceil(data.length / 6) === 0 || i === data.length - 1) {
        const x = padding.left + (i / (data.length - 1)) * chartW;
        ctx.fillText(point.label, x, h - padding.bottom + 20);
      }
    });
  }, [data]);

  return (
    <GlassPanel>
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">{title}</h3>
      <canvas ref={canvasRef} className="w-full" style={{ height: 250 }} />
    </GlassPanel>
  );
}
