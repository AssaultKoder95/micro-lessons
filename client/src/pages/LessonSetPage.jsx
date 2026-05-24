import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getLessonSet } from "../utils/api.js";
import { usePolling } from "../hooks/usePolling.js";
import MicroLessonCard from "../components/MicroLessonCard.jsx";
import "./LessonSetPage.css";

export default function LessonSetPage() {
  const { id } = useParams();
  const [initial, setInitial] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLessonSet(id)
      .then((r) => setInitial(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const { data, error } = usePolling(id, initial);

  if (loading) return <div className="center-msg">Loading…</div>;
  if (error) return <div className="center-msg error">Error: {error}</div>;
  if (!data) return null;

  const isProcessing = data.status === "processing";
  const isFailed = data.status === "failed";

  return (
    <div className="lesson-page">
      <Link to="/" className="back-link">← Upload another</Link>

      <div className="lesson-hero fade-up">
        <div className="lesson-file-badge">{data.fileName}</div>
        {isProcessing ? (
          <>
            <h1 className="lesson-page-title">Generating your lessons…</h1>
            <div className="processing-dots">
              <span /><span /><span />
            </div>
            <p className="processing-hint">We are reading your PDF and crafting micro-lessons. This usually takes 10–30 seconds.</p>
          </>
        ) : isFailed ? (
          <>
            <h1 className="lesson-page-title">Processing failed</h1>
            <p className="error-text">{data.error || "An unknown error occurred."}</p>
          </>
        ) : (
          <>
            <h1 className="lesson-page-title">{data.title}</h1>
            {data.description && <p className="lesson-desc">{data.description}</p>}
            <div className="lesson-stats">
              <span>{data.lessons?.length} lessons</span>
              <span>·</span>
              <span>{data.lessons?.reduce((acc, l) => acc + (l.quiz?.length || 0), 0)} quiz questions</span>
            </div>
          </>
        )}
      </div>

      {!isProcessing && !isFailed && (
        <div className="lessons-grid">
          {data.lessons?.map((lesson, i) => (
            <MicroLessonCard key={lesson._id || i} lesson={lesson} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
