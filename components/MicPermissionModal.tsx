interface MicPermissionModalProps {
  error: string | null;
  onRequestPermission: () => void;
}

export default function MicPermissionModal({
  error,
  onRequestPermission,
}: MicPermissionModalProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-lg z-50">
      <div className="glass rounded-2xl shadow-2xl shadow-purple-900/50 p-8 max-w-md w-full mx-4 border-2 border-purple-500/30">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50 animate-pulse">
            <span className="text-4xl">🎤</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-black text-center mb-3 gradient-text">
          Karen's Webhouse
        </h1>

        {/* Message */}
        <p className="text-lg text-slate-200 text-center italic mb-6 leading-relaxed">
          "Oh honey, I need your microphone to roast you properly."
        </p>

        {/* Error */}
        {error && (
          <p className="text-sm text-pink-400 mb-4 text-center font-medium animate-pulse flex items-center justify-center gap-2">
            <span>⚠️</span> {error}
          </p>
        )}

        {/* Button */}
        <button
          onClick={onRequestPermission}
          className="w-full btn-premium py-4 rounded-xl font-bold text-lg"
        >
          🔓 Give Karen Microphone Access
        </button>

        <p className="text-xs text-slate-400 text-center mt-4">
          Required for the full AI voice experience
        </p>
      </div>
    </div>
  );
}
