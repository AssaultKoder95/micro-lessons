import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllLessonSets, deleteLessonSet } from "../utils/api.js";
import "./HistoryPage.css";

export default function HistoryPage() {
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getAllLessonSets()
      .then((r) => setSets(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id, e) => {
    e.preventDefault();
    if (!confirm("Delete this lesson set?")) return;
    await deleteLessonSet(id);
    setSets((prev) => prev.filter((s) => s._id !== id));
  };

  if (loading) return <div className="center-msg">Loading history…</div>;

  return (
    <div className="history-page">
      <div className="history-header fade-up">
        <h1>Upload History</h1>
        <span className="count-tag">{sets.length} document{sets.length !== 1 ? "s" : ""}</span>
      </div>

      {sets.length === 0 ? (
        <div className="empty-state fade-up">
          <p>No lesson sets yet.</p>
          <Link to="/" className="empty-cta">Upload your first PDF →</Link>
        </div>
      ) : (
        <div className="history-list fade-up">
          {sets.map((s) => (
            <Link key={s._id} to={`/lessons/${s._id}`} className="history-row">
              <div className="row-left">
                <span className="row-status" data-status={s.status} />
                <div>
                  <p className="row-title">{s.title}</p>
                  <p className="row-meta">
                    {s.fileName} · {new Date(s.createdAt).toLocaleDateString()}
                    {s.status === "completed" && ` · ${s.lessons?.length ?? 0} lessons`}
                    {s.status === "processing" && " · Processing…"}
                    {s.status === "failed" && " · Failed"}
                  </p>
                </div>
              </div>
              <button
                className="row-delete"
                onClick={(e) => handleDelete(s._id, e)}
                title="Delete"
              >
                ✕
              </button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
