# MicroLearn — PDF to Micro-Lessons

A MERN app that parses PDF documents and generates structured micro-lessons using the **Gemini AI** API.

## Features
- 📄 Upload any PDF (up to 20 MB)
- 🤖 Gemini 1.5 Flash extracts and structures content into 4–8 micro-lessons
- ✏️ Each lesson has a summary, key points, and a 2-question quiz
- 📚 Upload history with status tracking
- ⚡ Async processing with live polling

---

## Project Structure

```
micro-lessons/
├── server/          # Express + MongoDB backend
│   ├── controllers/
│   │   ├── geminiService.js   # Gemini API integration
│   │   └── lessonsController.js
│   ├── middleware/upload.js   # Multer PDF upload
│   ├── models/LessonSet.js    # Mongoose schema
│   ├── routes/lessons.js
│   └── index.js
└── client/          # React + Vite frontend
    └── src/
        ├── components/  PDFUploader, MicroLessonCard, Layout
        ├── pages/       HomePage, LessonSetPage, HistoryPage
        ├── hooks/       usePolling.js
        └── utils/       api.js
```

---

## Setup

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongodb://localhost:27017`) or a MongoDB Atlas URI
- A **Gemini API key** from [Google AI Studio](https://aistudio.google.com/app/apikey)

### 1. Backend

```bash
cd server
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY and MONGODB_URI
npm install
npm run dev
# Server runs on http://localhost:5000
```

### 2. Frontend

```bash
cd client
npm install
npm run dev
# App runs on http://localhost:5173
```

---

## API Endpoints

| Method | Path                  | Description                     |
|--------|-----------------------|---------------------------------|
| POST   | /api/lessons/upload   | Upload PDF, returns `{ id }`    |
| GET    | /api/lessons/:id      | Get lesson set (with polling)   |
| GET    | /api/lessons          | List all lesson sets            |
| DELETE | /api/lessons/:id      | Delete a lesson set             |
| GET    | /api/health           | Health check                    |

---

## Customizing the Gemini Prompt

Edit `server/controllers/geminiService.js` — the `MICRO_LESSON_PROMPT` function.
You can adjust:
- Number of lessons (`4 to 8`)
- Quiz question count per lesson
- Output schema fields
- Audience / reading level

---

## Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/micro-lessons
GEMINI_API_KEY=your_key_here
CLIENT_URL=http://localhost:5173
```
