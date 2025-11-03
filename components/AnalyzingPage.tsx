import { RoastSession } from "../types";

interface AnalyzingPageProps {
  roastSession: RoastSession | null;
  transcript: string;
}

export default function AnalyzingPage({
  roastSession,
  transcript,
}: AnalyzingPageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 via-pink-900/10 to-purple-900/20 animate-pulse"></div>

      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl p-12">
        {/* Header with animated icon */}
        <div className="mb-8 flex items-center space-x-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full animate-pulse flex items-center justify-center shadow-lg shadow-purple-500/50">
              <span className="text-3xl">🔍</span>
            </div>
            {/* Rotating ring */}
            <div className="absolute inset-0 border-4 border-t-purple-500 border-r-transparent border-b-pink-500 border-l-transparent rounded-full animate-spin"></div>
          </div>
          <div>
            <h2 className="text-4xl font-black text-white mb-1">
              Karen is analyzing...
            </h2>
            <p className="text-purple-300 text-lg font-semibold">
              Progress: {roastSession?.progress || 0}%
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full glass rounded-full h-6 mb-8 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 rounded-full transition-all duration-500 relative overflow-hidden"
            style={{ width: `${roastSession?.progress || 0}%` }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
          </div>
        </div>

        {/* Transcript card */}
        <div className="glass-light p-8 rounded-2xl w-full border-l-4 border-purple-500 shadow-xl shadow-purple-900/20">
          <p className="text-xl text-slate-100 italic font-medium leading-relaxed">
            {transcript ||
              "I'm sure your website is an absolute disaster... Let's see just how bad it really is. 😏"}
          </p>
        </div>

        {/* Status text */}
        <p className="mt-6 text-sm text-slate-400 flex items-center gap-2">
          <span className="animate-pulse">⚡</span>
          Karen is taking screenshots and judging every pixel of your website
          <span className="animate-pulse">⚡</span>
        </p>
      </div>
    </div>
  );
}
