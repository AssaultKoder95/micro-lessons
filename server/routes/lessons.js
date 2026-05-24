import express from "express";
import upload from "../middleware/upload.js";
import {
  uploadPDF,
  getLessonSet,
  getAllLessonSets,
  deleteLessonSet,
} from "../controllers/lessonsController.js";

const router = express.Router();

router.post("/upload", upload.single("pdf"), uploadPDF);
router.get("/", getAllLessonSets);
router.get("/:id", getLessonSet);
router.delete("/:id", deleteLessonSet);

export default router;
