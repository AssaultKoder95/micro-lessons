import { useState, useRef, useEffect } from "react";
import "./AudioPlayer.css";

export default function AudioPlayer({ text, lessonTitle }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const prevBlobRef = useRef(null);

  // Revoke old blob URL on unmount or when new one arrives
  useEffect(() => {
    return () => {
      if (prevBlobRef.current) URL.revokeObjectURL(prevBlobRef.current);
    };
  }, []);

  const generate = async () => {
    setLoading(true);
    setError("");
    setPlaying(false);
    setProgress(0);

    if (prevBlobRef.current) {
      URL.revokeObjectURL(prevBlobRef.current);
      prevBlobRef.current = null;
    }
    setAudioUrl(null);

    try {
      const body = {
        text,
        model: "mulberry",
        description: "A female voice in her 30s with a clear, warm Indian accent, speaking at a conversational pace as an elearning instructor.",
        temperature: 0.7,
        top_p: 0.9,
        top_k: 50
      };

      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || `HTTP ${res.status}`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      prevBlobRef.current = url;
      setAudioUrl(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Auto-play once audio is ready
  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => { });
    }
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setProgress(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = ratio * duration;
  };

  const fmt = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="audio-player">
      <button
        className={`ap-generate ${loading ? "loading" : ""}`}
        onClick={generate}
        disabled={loading}
      >
        {loading ? (
          <span className="ap-spinner" />
        ) : audioUrl ? (
          "↺ Regenerate"
        ) : (
          "▶ Listen to Lesson"
        )}
      </button>

      {error && <p className="ap-error">{error}</p>}

      {/* Player */}
      {audioUrl && (
        <div className="ap-player">
          <audio
            ref={audioRef}
            src={audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setPlaying(false)}
          />
          <button className="ap-playpause" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>
            {playing ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="3" y="2" width="4" height="12" rx="1" />
                <rect x="9" y="2" width="4" height="12" rx="1" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M3 2.5l11 5.5-11 5.5z" />
              </svg>
            )}
          </button>

          <div className="ap-timeline" onClick={handleSeek}>
            <div
              className="ap-timeline-fill"
              style={{ width: duration ? `${(progress / duration) * 100}%` : "0%" }}
            />
          </div>

          <span className="ap-time">
            {fmt(progress)} / {fmt(duration)}
          </span>
        </div>
      )}
    </div>
  );
}
