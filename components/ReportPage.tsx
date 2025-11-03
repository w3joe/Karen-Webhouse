import { RoastSession } from "../types";
import MuteButton from "./MuteButton";

interface ReportPageProps {
  roastSession: RoastSession;
  onDownloadReport: () => void;
  onStartOver: () => void;
}

export default function ReportPage({
  roastSession,
  onDownloadReport,
  onStartOver,
}: ReportPageProps) {
  const { analysis } = roastSession;

  if (!analysis) {
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

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Mute Button */}
      <MuteButton />

      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 via-pink-900/10 to-purple-900/20 animate-pulse pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-4xl mx-auto glass rounded-2xl shadow-2xl shadow-purple-900/30 p-8 lg:p-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/50">
              <span className="text-4xl">📋</span>
            </div>
          </div>
          <h1 className="text-5xl font-black mb-4 text-white">
            Karen's Official Roast Report
          </h1>
          <p className="text-3xl font-bold">
            <span className="text-slate-400">Overall Score: </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              {analysis.overall_rating}/10
            </span>
            <span className="ml-2">
              {analysis.overall_rating < 5
                ? "💀"
                : analysis.overall_rating < 7
                ? "😬"
                : "🔥"}
            </span>
          </p>
        </div>

        {/* Summary Section */}
        <div className="mb-10">
          <h2 className="text-3xl font-black text-white mb-4 flex items-center gap-3">
            <span>📝</span> Summary
          </h2>
          <div className="glass-light p-6 rounded-xl border-l-4 border-pink-500">
            <p className="text-xl text-slate-100 italic leading-relaxed">
              {analysis.roast_summary}
            </p>
          </div>
        </div>

        {/* Design Flaws Section */}
        <div className="mb-10">
          <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
            <span>🎯</span> Design Flaws ({analysis.design_flaws.length})
          </h2>
          <div className="space-y-4">
            {analysis.design_flaws.map((flaw, i) => (
              <div
                key={i}
                className="glass-light p-6 rounded-xl hover:border-purple-500/50 border border-transparent transition-all"
              >
                <div className="flex items-start space-x-4">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-sm mt-1 flex-shrink-0 shadow-lg"
                    style={{
                      backgroundColor: getSeverityColor(flaw.severity),
                      boxShadow: `0 0 15px ${getSeverityColor(
                        flaw.severity
                      )}60`,
                    }}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-bold text-white mb-2 text-lg">
                      {flaw.issue}
                    </h3>
                    <p className="text-slate-300 italic mb-3 leading-relaxed">
                      {flaw.roast}
                    </p>
                    <p className="text-sm text-purple-300">
                      <strong className="text-pink-400">Fix:</strong>{" "}
                      {flaw.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {analysis.positive_aspects.length > 0 && (
          <div className="mb-10">
            <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
              <span>✨</span> Things That Don't Completely Suck
            </h2>
            <div className="glass-light p-6 rounded-xl border-l-4 border-purple-500">
              <ul className="space-y-3">
                {analysis.positive_aspects.map((aspect, i) => (
                  <li key={i} className="text-slate-100 flex items-start gap-3">
                    <span className="text-purple-400 font-bold">•</span>
                    <span>{aspect}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            onClick={onDownloadReport}
            className="flex-1 btn-premium py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2"
          >
            <span>📥</span> Download PDF Report
          </button>
          <button
            onClick={onStartOver}
            className="flex-1 glass-light text-white py-4 rounded-xl font-bold text-lg hover:border-purple-500 border border-transparent transition-all flex items-center justify-center gap-2"
          >
            <span>🔄</span> Roast Another Website
          </button>
        </div>
      </div>
    </div>
  );
}
