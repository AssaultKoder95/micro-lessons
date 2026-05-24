import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import LessonSetPage from "./pages/LessonSetPage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/lessons/:id" element={<LessonSetPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </Layout>
  );
}
