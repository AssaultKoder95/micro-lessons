import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { uploadPDF } from "../utils/api.js";
import "./PDFUploader.css";

export default function PDFUploader() {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef();
  const navigate = useNavigate();

  const handleFile = (f) => {
    if (!f) return;
    if (f.type !== "application/pdf") {
      setError("Only PDF files are accepted.");
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      setError("File must be under 20 MB.");
      return;
    }
    setError("");
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("pdf", file);
      const res = await uploadPDF(fd, setProgress);
      navigate(`/lessons/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.error || "Upload failed. Please try again.");
      setUploading(false);
    }
  };

  const formatSize = (bytes) =>
    bytes > 1048576 ? `${(bytes / 1048576).toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;

  return (
    <div className="uploader-wrap fade-up">
      <div
        className={`drop-zone ${dragging ? "drag-over" : ""} ${file ? "has-file" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !file && inputRef.current.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden-input"
          onChange={(e) => handleFile(e.target.files[0])}
        />
        {!file ? (
          <>
            <div className="drop-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect x="8" y="4" width="18" height="24" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M26 4l6 6v18a2 2 0 01-2 2H10a2 2 0 01-2-2V6a2 2 0 012-2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M26 4v6h6" stroke="currentColor" strokeWidth="1.5" />
                <path d="M20 18v8M17 23l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <p className="drop-label">Drop your PDF here</p>
            <p className="drop-sub">or <span className="drop-browse">browse file</span> · max 20 MB</p>
          </>
        ) : (
          <div className="file-preview">
            <div className="file-icon">PDF</div>
            <div className="file-meta">
              <span className="file-name">{file.name}</span>
              <span className="file-size">{formatSize(file.size)}</span>
            </div>
            <button className="file-remove" onClick={(e) => { e.stopPropagation(); setFile(null); }}>✕</button>
          </div>
        )}
      </div>

      {error && <p className="upload-error">{error}</p>}

      {uploading ? (
        <div className="progress-wrap">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="progress-label">{progress < 100 ? `Uploading… ${progress}%` : "Processing ..."}</span>
        </div>
      ) : (
        <button
          className={`upload-btn ${!file ? "disabled" : ""}`}
          onClick={handleSubmit}
          disabled={!file}
        >
          Generate Micro-Lessons →
        </button>
      )}
    </div>
  );
}
