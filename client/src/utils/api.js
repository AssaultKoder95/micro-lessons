import axios from "axios";

const api = axios.create({ baseURL: "/api" });

export const uploadPDF = (formData, onProgress) =>
  api.post("/lessons/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (e) => onProgress?.(Math.round((e.loaded * 100) / e.total)),
  });

export const getLessonSet = (id) => api.get(`/lessons/${id}`);

export const getAllLessonSets = () => api.get("/lessons");

export const deleteLessonSet = (id) => api.delete(`/lessons/${id}`);
