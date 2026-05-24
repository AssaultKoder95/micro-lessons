import mongoose from "mongoose";

const microLessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  keyPoints: [{ type: String }],
  quiz: [
    {
      question: { type: String },
      options: [{ type: String }],
      answer: { type: String },
    },
  ],
  audioScript: { type: String, required: true },
  order: { type: Number, default: 0 },
});

const lessonSetSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    fileName: { type: String, required: true },
    fileSize: { type: Number },
    extractedText: { type: String },
    lessons: [microLessonSchema],
    status: {
      type: String,
      enum: ["processing", "completed", "failed"],
      default: "processing",
    },
    error: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("LessonSet", lessonSetSchema);
