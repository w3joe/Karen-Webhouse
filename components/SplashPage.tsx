"use client";

import WallOfShameGallery from "./WallOfShameGallery";
import MuteButton from "./MuteButton";

interface SplashPageProps {
  url: string;
  setUrl: (url: string) => void;
  error: string | null;
  micPermission: boolean;
  onSubmit: () => void;
}

export default function SplashPage({
  url,
  setUrl,
  error,
  micPermission,
  onSubmit,
}: SplashPageProps) {
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Mute Button */}
      <MuteButton />

      {/* Wall of Shame Gallery - Background Layer (Fixed, Low Opacity) */}
      <div className="fixed inset-0 z-0">
        <WallOfShameGallery />
      </div>

      {/* Main Content - Foreground Layer (Centered) */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-12 max-w-3xl w-full">
        {/* Logo/Brand Section */}
        <div className="mb-12 text-center">
          <div className="inline-block mb-4 group relative">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/50 transform transition-all duration-500 hover:scale-110 hover:rotate-12 hover:shadow-2xl hover:shadow-pink-500/70 relative overflow-hidden">
              {/* Animated gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 via-purple-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
              
              {/* Spinning ring effect */}
              <div className="absolute inset-0 border-4 border-transparent border-t-white/30 rounded-2xl opacity-0 group-hover:opacity-100 group-hover:animate-spin transition-opacity"></div>
              
              {/* Icon */}
              <span className="text-5xl font-black text-white relative z-10 transform transition-transform duration-500 group-hover:scale-125 group-hover:rotate-[-12deg]">🧙‍♀️</span>
            </div>
            
            {/* Karen's Warning Bubble */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20">
              <div className="relative mt-4">
                {/* Speech bubble arrow */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-pink-500 transform rotate-45"></div>
                
                <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl px-4 py-3 shadow-2xl shadow-pink-500/50 whitespace-nowrap">
                  <p className="text-white font-bold text-sm">
                    "Don't you dare touch me! 😤"
                  </p>
                </div>
              </div>
            </div>
          </div>
          <h1 className="text-7xl font-black mb-4 text-white tracking-tight drop-shadow-2xl">
            Karen's Webhouse
          </h1>
          <p className="text-2xl text-purple-300 italic font-medium drop-shadow-lg">
            "Your website probably sucks"
          </p>
        </div>

        {/* Input Card */}
        <div className="w-full glass rounded-2xl p-8 shadow-2xl shadow-purple-900/30 backdrop-blur-xl">
          <div className="space-y-6">
            <input
              type="text"
              placeholder="Give me your website URL... if you dare"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && onSubmit()}
              className="w-full px-6 py-4 bg-slate-800/50 border-2 border-purple-500/30 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 text-white placeholder-slate-400 text-lg transition-all"
            />
            {error && (
              <p className="text-sm text-pink-400 font-medium animate-pulse flex items-center gap-2">
                <span className="text-lg">⚠️</span> {error}
              </p>
            )}
            <button
              onClick={onSubmit}
              disabled={!micPermission}
              className="w-full btn-premium text-lg font-bold py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none relative overflow-hidden group"
            >
              <span className="relative z-10">Roast My Website</span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
            {!micPermission && (
              <p className="text-sm text-slate-400 text-center">
                📢 Microphone permission required for the full Karen experience
              </p>
            )}
          </div>
        </div>

        {/* Tagline */}
        <p className="mt-8 text-slate-300 text-center max-w-md drop-shadow-lg">
          AI-powered design critique that doesn't hold back.
          <span className="text-purple-400 font-semibold"> Brutally honest</span>,
          <span className="text-pink-400 font-semibold"> unfiltered</span>, and
          surprisingly helpful.
        </p>
      </div>
    </div>
  );
}
