import pdfParse from "pdf-parse/lib/pdf-parse.js";
import LessonSet from "../models/LessonSet.js";
import { generateMicroLessons } from "./geminiService.js";

// POST /api/lessons/upload
export async function uploadPDF(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: "No PDF file uploaded" });
  }

  // Create a pending record immediately so the client gets an ID
  const lessonSet = await LessonSet.create({
    title: req.file.originalname.replace(".pdf", ""),
    fileName: req.file.originalname,
    fileSize: req.file.size,
    status: "processing",
  });

  // Process asynchronously
  processPDF(req.file.buffer, lessonSet._id).catch(console.error);

  return res.status(202).json({
    message: "PDF uploaded, processing started",
    id: lessonSet._id,
    status: "processing",
  });
}

async function processPDF(buffer, lessonSetId) {
  try {
    // Parse PDF
    const pdfData = await pdfParse(buffer);
    const extractedText = pdfData.text;

    if (!extractedText || extractedText.trim().length < 100) {
      await LessonSet.findByIdAndUpdate(lessonSetId, {
        status: "failed",
        error: "Could not extract meaningful text from the PDF.",
      });
      return;
    }

    // Generate lessons via Gemini
    const generated = await generateMicroLessons(extractedText);

    console.log("Generated micro-lessons:", generated);

    await LessonSet.findByIdAndUpdate(lessonSetId, {
      title: generated.title || "Untitled Document",
      description: generated.description || "",
      extractedText: extractedText.slice(0, 5000), // store preview only
      lessons: generated.lessons,
      status: "completed",
    });
  } catch (err) {
    console.error("Processing error:", err);
    await LessonSet.findByIdAndUpdate(lessonSetId, {
      status: "failed",
      error: err.message || "Unknown processing error",
    });
  }
}

// GET /api/lessons/:id
export async function getLessonSet(req, res) {
  try {
    const lessonSet = await LessonSet.findById(req.params.id).select(
      "-extractedText"
    );
    if (!lessonSet) {
      return res.status(404).json({ error: "Lesson set not found" });
    }
    res.json(lessonSet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/lessons
export async function getAllLessonSets(req, res) {
  try {
    const sets = await LessonSet.find()
      .select("-extractedText -lessons.quiz")
      .sort({ createdAt: -1 });
    res.json(sets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// DELETE /api/lessons/:id
export async function deleteLessonSet(req, res) {
  try {
    await LessonSet.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
