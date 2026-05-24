import { Link, useLocation } from "react-router-dom";
import "./Layout.css";

export default function Layout({ children }) {
  const { pathname } = useLocation();
  return (
    <div className="layout">
      <header className="header">
        <Link to="/" className="logo">
          <span className="logo-mark">ML</span>
          <span className="logo-text">MicroLearn</span>
        </Link>
        <nav className="nav">
          <Link to="/" className={`nav-link ${pathname === "/" ? "active" : ""}`}>Upload</Link>
          <Link to="/history" className={`nav-link ${pathname === "/history" ? "active" : ""}`}>History</Link>
        </nav>
      </header>
      <main className="main">{children}</main>
      <footer className="footer">
        <span>MicroLearn · PDF → Interactive Lessons</span>
      </footer>
    </div>
  );
}
