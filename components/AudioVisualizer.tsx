"use client";

import { useEffect, useRef } from "react";
import { useAudioVisualization } from "../hooks/useAudioVisualization";

interface AudioVisualizerProps {
  conversation: any;
  className?: string;
}

export default function AudioVisualizer({
  conversation,
  className = "",
}: AudioVisualizerProps) {
  const { isListening, isSpeaking, audioLevel } =
    useAudioVisualization(conversation);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const timeRef = useRef<number>(0);
  const currentIntensityRef = useRef<number>(0);
  const targetIntensityRef = useRef<number>(0);

  // Debug logging
  useEffect(() => {
    // console.log("🎨 AudioVisualizer state:", {
    //   isListening,
    //   isSpeaking,
    //   audioLevel,
    // });
  }, [isListening, isSpeaking, audioLevel]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    updateSize();
    window.addEventListener("resize", updateSize);

    // Determine target intensity based on state
    const getTargetIntensity = () => {
      if (isSpeaking) {
        // Speaking: 60-100% based on audio level
        return 0.6 + audioLevel * 0.4;
      } else if (isListening) {
        // Listening: 30-40%
        return 0.3 + Math.sin(timeRef.current * 0.002) * 0.05;
      }
      return 0;
    };

    // Easing function for smooth transitions
    const easeInOutCubic = (t: number) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    let lastTime = performance.now();
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      timeRef.current = currentTime;

      // Update target intensity
      targetIntensityRef.current = getTargetIntensity();

      // Smooth interpolation towards target
      const transitionSpeed = isSpeaking ? 0.15 : 0.08; // Faster when speaking
      const diff = targetIntensityRef.current - currentIntensityRef.current;
      currentIntensityRef.current += diff * transitionSpeed;

      const intensity = currentIntensityRef.current;

      // Clear canvas
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Draw visualization based on state
      if (isSpeaking) {
        drawSpeakingAnimation(ctx, rect, intensity, currentTime);
      } else if (isListening) {
        drawListeningAnimation(ctx, rect, intensity, currentTime);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", updateSize);
    };
  }, [isListening, isSpeaking, audioLevel]);

  // Draw calm, rhythmic animation for listening state
  const drawListeningAnimation = (
    ctx: CanvasRenderingContext2D,
    rect: DOMRect,
    intensity: number,
    time: number
  ) => {
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const baseRadius = Math.min(rect.width, rect.height) * 0.3; // Increased from 0.15 to 0.3

    // Draw multiple concentric circles with gentle pulsing
    for (let i = 0; i < 3; i++) {
      const offset = i * 0.8;
      const pulse = Math.sin(time * 0.002 + offset) * 0.2 + 0.8;
      const radius = baseRadius * (1 + i * 0.4) * pulse * intensity;
      const alpha = (0.8 - i * 0.15) * intensity; // Increased alpha for more visibility

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`; // Brighter purple
      ctx.lineWidth = 4;
      ctx.stroke();

      // Add glow effect
      ctx.shadowBlur = 10;
      ctx.shadowColor = `rgba(168, 85, 247, ${alpha * 0.6})`;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Central dot - bigger and brighter
    ctx.beginPath();
    ctx.arc(centerX, centerY, 12 * intensity, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(236, 72, 153, ${intensity * 0.9})`; // Bright pink
    ctx.shadowBlur = 15;
    ctx.shadowColor = `rgba(236, 72, 153, 0.8)`;
    ctx.fill();
    ctx.shadowBlur = 0;
  };

  // Draw dynamic, responsive animation for speaking state
  const drawSpeakingAnimation = (
    ctx: CanvasRenderingContext2D,
    rect: DOMRect,
    intensity: number,
    time: number
  ) => {
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const numBars = 7;
    const barWidth = 6;
    const barSpacing = 12;
    const maxBarHeight = rect.height * 0.4;

    // Draw audio bars
    for (let i = 0; i < numBars; i++) {
      const offset = i - Math.floor(numBars / 2);
      const x = centerX + offset * (barWidth + barSpacing);

      // Each bar has its own frequency and phase
      const frequency = 0.003 + i * 0.0005;
      const phase = i * 0.5;
      const wave = Math.sin(time * frequency + phase);

      // Height based on intensity and wave
      const baseHeight = 20;
      const heightMultiplier = intensity * (0.5 + wave * 0.5);
      const height = baseHeight + maxBarHeight * heightMultiplier;

      const y = centerY - height / 2;

      // Gradient for bars - brighter colors
      const gradient = ctx.createLinearGradient(x, y, x, y + height);
      gradient.addColorStop(
        0,
        `rgba(168, 85, 247, ${Math.min(intensity * 1.2, 1)})`
      ); // Brighter purple
      gradient.addColorStop(
        0.5,
        `rgba(236, 72, 153, ${Math.min(intensity * 1.2, 1)})`
      ); // Brighter pink
      gradient.addColorStop(
        1,
        `rgba(168, 85, 247, ${Math.min(intensity * 0.9, 1)})`
      );

      ctx.fillStyle = gradient;
      ctx.fillRect(x - barWidth / 2, y, barWidth, height);

      // Always add glow effect for better visibility
      ctx.shadowBlur = intensity > 0.7 ? 20 : 12;
      ctx.shadowColor =
        intensity > 0.7 ? "rgba(236, 72, 153, 0.8)" : "rgba(168, 85, 247, 0.6)";
      ctx.fillRect(x - barWidth / 2, y, barWidth, height);
      ctx.shadowBlur = 0;
    }
  };

  return (
    <div
      className={`fixed bottom-8 right-8 z-50 ${className}`}
      style={{ width: "120px", height: "120px" }}
    >
      <div className="relative w-full h-full">
        {/* Background circle with glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-900/80 to-slate-900/80 backdrop-blur-md border-2 border-purple-500/40 shadow-2xl shadow-purple-500/30"></div>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="relative w-full h-full rounded-full"
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
}
