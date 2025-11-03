import { useState } from "react";
import { RoastSession } from "../types";
import ScreenshotWithHighlights from "./ScreenshotWithHighlights";
import MuteButton from "./MuteButton";

interface RoastingPageProps {
  roastSession: RoastSession;
  currentFlawIndex: number;
  setCurrentFlawIndex: (index: number) => void;
  transcript: string;
  onViewReport: () => void;
  conversation?: any; // ElevenLabs conversation object
}

export default function RoastingPage({
  roastSession,
  currentFlawIndex,
  setCurrentFlawIndex,
  transcript,
  onViewReport,
  conversation,
}: RoastingPageProps) {
  const { analysis, screenshot } = roastSession;
  const [expandedFlawIndex, setExpandedFlawIndex] = useState<number | null>(null);

  if (!analysis || !screenshot) {
    return null;
  }

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case "critical":
        return "#ef4444"; // red
      case "high":
        return "#f97316"; // orange
      case "medium":
        return "#eab308"; // yellow
      case "low":
        return "#3b82f6"; // blue
      default:
        return "#6b7280"; // gray
    }
  };

  const getSeverityBadge = (severity: string): string => {
    switch (severity) {
      case "critical":
        return "🔴 Critical";
      case "high":
        return "🟠 High";
      case "medium":
        return "🟡 Medium";
      case "low":
        return "🔵 Low";
      default:
        return "⚪ Unknown";
    }
  };

  const handleFlawClick = (index: number) => {
    setCurrentFlawIndex(index);
    setExpandedFlawIndex(expandedFlawIndex === index ? null : index);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Mute Button */}
      <MuteButton />

      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 via-pink-900/10 to-purple-900/20 animate-pulse pointer-events-none"></div>

      <div className="relative z-10 flex flex-col lg:flex-row w-full max-w-7xl mx-auto gap-6">
        {/* Screenshot with highlights */}
        <div className="flex-1 glass rounded-2xl shadow-2xl shadow-purple-900/30 p-6">
          <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
            <span className="text-2xl">🏠</span>
            The Webhouse
          </h2>
          <ScreenshotWithHighlights
            screenshot={screenshot}
            designFlaws={analysis.design_flaws}
            currentIssueIndex={currentFlawIndex}
            onIssueClick={setCurrentFlawIndex}
          />
        </div>

        {/* Karen's commentary + Flaws panel */}
        <div className="w-full lg:w-[500px] flex flex-col gap-6">
          {/* Karen's Voice Card */}
          <div className="glass rounded-2xl shadow-2xl shadow-purple-900/30 p-6">
            <div className="text-center mb-6 pb-6 border-b border-purple-500/30">
              <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">
                Overall Score
              </p>
              <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500">
                {analysis.overall_rating}/10
              </div>
            </div>

            <div className="glass-light rounded-xl p-5 border-l-4 border-pink-500 max-h-40 overflow-y-auto">
              <p className="text-slate-100 italic text-base leading-relaxed">
                {transcript || analysis.karen_opening_line}
              </p>
            </div>
          </div>

          {/* Design Flaws Panel */}
          <div className="glass rounded-2xl shadow-2xl shadow-purple-900/30 p-6 flex-1 overflow-hidden flex flex-col">
            <h4 className="font-black text-white text-3xl flex items-center gap-2 mb-4">
              <span>🎯</span> Design Flaws ({analysis.design_flaws.length})
            </h4>

            <div className="space-y-3 overflow-y-auto flex-1 pr-2 custom-scrollbar">
              {analysis.design_flaws.map((flaw, i) => {
                const isSelected = currentFlawIndex === i;
                const isExpanded = expandedFlawIndex === i;
                
                return (
                <div
                  key={i}
                  className={`rounded-xl cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? "glass border-2 border-purple-500 shadow-lg shadow-purple-500/50 ring-2 ring-purple-400/30"
                      : "glass-light hover:border-purple-500/50 border border-purple-500/20 hover:shadow-md"
                  }`}
                  onClick={() => handleFlawClick(i)}
                >
                  {/* Flaw Header */}
                  <div className={`p-4 ${isSelected ? 'bg-purple-900/20' : ''} transition-colors duration-300`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="relative">
                          <span
                            className={`w-6 h-6 rounded-full flex-shrink-0 shadow-md mt-0.5 transition-all duration-300 ${isSelected ? 'ring-2 ring-white/50 scale-110' : ''}`}
                            style={{
                              backgroundColor: getSeverityColor(flaw.severity),
                              boxShadow: `0 0 ${isSelected ? '16' : '12'}px ${getSeverityColor(flaw.severity)}60`,
                            }}
                          ></span>
                          {isSelected && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full animate-pulse"></span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-lg font-bold mb-2 transition-colors duration-300 ${isSelected ? 'text-purple-300' : 'text-white'}`}>
                            {i + 1}. {flaw.issue}
                          </p>
                          <span className={`text-base font-semibold px-3 py-1.5 rounded-full transition-all duration-300 ${isSelected ? 'bg-purple-500/30 text-purple-200 ring-1 ring-purple-400/50' : 'bg-slate-800/50 text-slate-300'}`}>
                            {getSeverityBadge(flaw.severity)}
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 flex items-center gap-2">
                        {isSelected && (
                          <span className="text-purple-400 text-xs font-bold animate-pulse">ACTIVE</span>
                        )}
                        <span className={`text-purple-400 text-lg transition-transform duration-200 inline-block ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
                          ▼
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      expandedFlawIndex === i 
                        ? 'max-h-[500px] opacity-100' 
                        : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-4 pb-4 space-y-4 border-t border-purple-500/30 pt-4">
                      {/* Full Roast */}
                      <div className="transform transition-all duration-300 delay-75">
                        <h5 className="text-sm font-bold text-purple-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                          <span>💬</span> Karen's Take:
                        </h5>
                        <p className="text-slate-200 text-base italic bg-slate-800/30 rounded-lg p-4 border-l-2 border-pink-500">
                          "{flaw.roast}"
                        </p>
                      </div>

                      {/* Recommendation */}
                      <div className="transform transition-all duration-300 delay-100">
                        <h5 className="text-sm font-bold text-green-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                          <span>✨</span> How to Fix:
                        </h5>
                        <p className="text-slate-200 text-base bg-green-900/20 rounded-lg p-4 border-l-2 border-green-500">
                          {flaw.recommendation}
                        </p>
                      </div>

                      {/* Coordinates Info */}
                      <div className="text-sm text-slate-500 flex items-center gap-2 transition-all duration-300 delay-150">
                        <span>📍</span>
                        <span>
                          Position: ({Math.round(flaw.coordinates.x)}, {Math.round(flaw.coordinates.y)})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>

            {/* View Report Button */}
            <button
              onClick={onViewReport}
              className="w-full btn-premium py-4 rounded-xl font-bold text-lg mt-6"
            >
              📊 View Full Report
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.3);
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #8b5cf6 0%, #ec4899 100%);
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #a78bfa 0%, #f472b6 100%);
        }
      `}</style>
    </div>
  );
}
