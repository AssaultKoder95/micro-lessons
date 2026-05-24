import { useState } from "react";
import AudioPlayer from "./AudioPlayer.jsx";
import "./MicroLessonCard.css";

// Build a narration script from lesson data (max ~1800 chars for Rumik)
function buildNarrationText(lesson) {
  if (lesson.audioScript) { return lesson.audioScript };
  const parts = [
    `Lesson ${lesson.order}: ${lesson.title}.`,
    lesson.summary,
  ];

  return parts.join(" ").slice(0, 1800);
}

export default function MicroLessonCard({ lesson, index }) {
  const [quizOpen, setQuizOpen] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleAnswer = (qIdx, opt) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qIdx]: opt }));
  };

  const score = submitted
    ? lesson.quiz.filter((q, i) => answers[i] === q.answer).length
    : 0;

  return (
    <div className="lesson-card fade-up" style={{ animationDelay: `${index * 0.06}s` }}>
      <div className="card-header">
        <span className="card-num">0{lesson.order}</span>
        <h3 className="card-title">{lesson.title}</h3>
      </div>
      <p className="card-summary">{lesson.summary}</p>

      {lesson.keyPoints?.length > 0 && (
        <ul className="key-points">
          {lesson.keyPoints.map((pt, i) => (
            <li key={i}>{pt}</li>
          ))}
        </ul>
      )}

      {/* Audio player */}
      <AudioPlayer text={buildNarrationText(lesson)} lessonTitle={lesson.title} />

      {lesson.quiz?.length > 0 && (
        <div className="quiz-section" style={{ marginTop: "1rem" }}>
          <button className="quiz-toggle" onClick={() => setQuizOpen((o) => !o)}>
            {quizOpen ? "Hide Quiz ↑" : "Take Quiz →"}
          </button>

          {quizOpen && (
            <div className="quiz-body">
              {lesson.quiz.map((q, qIdx) => (
                <div key={qIdx} className="quiz-q">
                  <p className="q-text">{q.question}</p>
                  <div className="q-options">
                    {q.options.map((opt, oIdx) => {
                      const selected = answers[qIdx] === opt;
                      const correct = submitted && opt === q.answer;
                      const wrong = submitted && selected && opt !== q.answer;
                      return (
                        <button
                          key={oIdx}
                          className={`q-opt ${selected ? "selected" : ""} ${correct ? "correct" : ""} ${wrong ? "wrong" : ""}`}
                          onClick={() => handleAnswer(qIdx, opt)}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {!submitted ? (
                <button
                  className="submit-btn"
                  onClick={() => setSubmitted(true)}
                  disabled={Object.keys(answers).length < lesson.quiz.length}
                >
                  Submit Answers
                </button>
              ) : (
                <div className="score-badge">
                  {score}/{lesson.quiz.length} correct
                  {score === lesson.quiz.length ? " 🎉" : " — review the lesson!"}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
