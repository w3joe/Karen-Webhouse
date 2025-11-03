"use client";

import { useEffect, useState } from "react";

interface AudioVisualizationState {
  isListening: boolean;
  isSpeaking: boolean;
  audioLevel: number; // 0-1
}

export function useAudioVisualization(
  conversation: any
): AudioVisualizationState {
  const [state, setState] = useState<AudioVisualizationState>({
    isListening: false,
    isSpeaking: false,
    audioLevel: 0,
  });

  // Use ElevenLabs' real-time isSpeaking property directly
  useEffect(() => {
    const isConnected = conversation.status === "connected";
    const isSpeaking = conversation.isSpeaking || false;

    setState({
      isListening: isConnected && !isSpeaking,
      isSpeaking: isSpeaking,
      audioLevel: isSpeaking ? 0.7 : 0.3,
    });
  }, [conversation.status, conversation.isSpeaking]);

  // Add periodic random variation when speaking for dynamic bars
  useEffect(() => {
    if (state.isSpeaking) {
      const interval = setInterval(() => {
        setState((prev) => ({
          ...prev,
          audioLevel: 0.6 + Math.random() * 0.4, // Random between 0.6-1.0
        }));
      }, 100);

      return () => clearInterval(interval);
    }
  }, [state.isSpeaking]);

  return state;
}
