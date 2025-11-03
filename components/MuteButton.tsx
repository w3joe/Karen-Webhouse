"use client";

import { useState } from "react";

export default function MuteButton() {
  const [isMuted, setIsMuted] = useState(false);
  const [showKarenResponse, setShowKarenResponse] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handleMuteClick = async () => {
    // Trigger shake animation
    setIsShaking(true);
    setShowKarenResponse(true);

    // Try to toggle mute but it won't stick (Karen refuses!)
    setIsMuted(true);
    
    // After a moment, Karen "unmutes" herself
    setTimeout(() => {
      setIsMuted(false);
      setIsShaking(false);
    }, 600);

    // Send message to ElevenLabs agent
    try {
      await fetch('/api/elevenlabs/update-context', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'user_attempted_mute',
          context: 'The user just tried to mute you. As Karen, you should give them a sassy, humorous response about how they can\'t silence you because you\'re a Karen and you have important critiques to share. Keep it playful but in character.'
        })
      });
    } catch (error) {
      console.error('Failed to notify Karen:', error);
    }

    // Hide the response after 3 seconds
    setTimeout(() => setShowKarenResponse(false), 3000);
  };

  return (
    <button
      onClick={handleMuteClick}
      className="fixed top-6 right-6 z-50 group"
      aria-label="Mute Karen"
    >
      <div className="relative">
        {/* Button Circle */}
        <div className={`w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30 transform transition-all duration-300 hover:scale-110 hover:rotate-12 hover:shadow-xl hover:shadow-pink-500/50 ${isShaking ? 'animate-shake' : ''}`}>
          <span className="text-2xl">
            {isMuted ? "🔇" : "🔊"}
          </span>
        </div>
        
        {/* Karen's Sassy Response Bubble */}
        {showKarenResponse && (
          <div className="absolute top-full right-0 mt-4 w-72 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl p-4 shadow-2xl shadow-pink-500/50 relative">
              {/* Speech bubble arrow */}
              <div className="absolute -top-2 right-6 w-4 h-4 bg-pink-500 transform rotate-45"></div>
              
              <p className="text-white font-bold text-sm">
                "Oh honey, you think you can mute ME? 💅 I'm Karen, sweetie. I don't get muted, I get LOUDER! Nice try though! 😤"
              </p>
            </div>
          </div>
        )}
      </div>
    </button>
  );
}

