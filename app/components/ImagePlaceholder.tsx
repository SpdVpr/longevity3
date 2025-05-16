'use client';

import { useEffect, useRef } from 'react';

interface ImagePlaceholderProps {
  width: number;
  height: number;
  text?: string;
  bgColor?: string;
  textColor?: string;
  fontSize?: number;
  id: string;
}

export default function ImagePlaceholder({
  width,
  height,
  text = 'Placeholder Image',
  bgColor = '#f3f4f6',
  textColor = '#6b7280',
  fontSize = 16,
  id
}: ImagePlaceholderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;

    // Fill background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Add diagonal lines for visual interest
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // Draw diagonal lines
    const lineGap = 20;
    for (let i = -height; i < width + height; i += lineGap) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + height, height);
      ctx.stroke();
    }

    // Add border
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, width, height);

    // Add text
    ctx.fillStyle = textColor;
    ctx.font = `${fontSize}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // If text is too long, split it into multiple lines
    const maxWidth = width - 20;
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);

    // Draw each line of text
    const lineHeight = fontSize * 1.2;
    const totalTextHeight = lines.length * lineHeight;
    const textY = (height - totalTextHeight) / 2 + fontSize / 2;

    lines.forEach((line, i) => {
      ctx.fillText(line, width / 2, textY + i * lineHeight);
    });

    // Add category label at the top
    if (text.includes(':')) {
      const category = text.split(':')[0];
      ctx.fillStyle = '#4b5563';
      ctx.font = `bold ${fontSize}px Arial, sans-serif`;
      ctx.fillText(category, width / 2, 30);
    }

    // Save the canvas as an image
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `placeholder-${id}.png`;
    
    // Store in localStorage to avoid regenerating on each render
    localStorage.setItem(`placeholder-${id}`, dataUrl);
    
  }, [width, height, text, bgColor, textColor, fontSize, id]);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ display: 'none' }}
      width={width}
      height={height}
    />
  );
}
