import PDFUploader from "../components/PDFUploader.jsx";
import "./HomePage.css";

export default function HomePage() {
  return (
    <div className="home">
      <div className="hero fade-up">
        <p className="hero-tag">PDF → AI Micro-Lessons</p>
        <h1 className="hero-title">Turn any document<br />into bite-sized lessons</h1>
        <p className="hero-sub">
          Upload a PDF and our AI will extract the key concepts,<br />
          structure them as focused lessons, and add a quiz for each one.
        </p>
      </div>
      <PDFUploader />
      <div className="features fade-up fade-up-3">
        {[
          { icon: "📄", label: "Parse PDF", desc: "Text extracted automatically" },
          { icon: "🤖", label: "In-House AI", desc: "Structures content into lessons" },
          { icon: "✏️", label: "Quiz Ready", desc: "2 questions per lesson" },
        ].map((f) => (
          <div key={f.label} className="feature-chip">
            <span className="feature-icon">{f.icon}</span>
            <div>
              <strong>{f.label}</strong>
              <p>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
