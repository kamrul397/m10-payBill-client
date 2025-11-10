import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";

export default function Root() {
  return (
    <div className="max-w-11/12 mx-auto relative bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
      {/* soft ambient glow */}
      <div
        className="pointer-events-none absolute -inset-8 blur-2xl opacity-30 
                      bg-gradient-to-r from-indigo-300 via-cyan-300 to-blue-300"
      />

      <ScrollToTop />

      {/* Keep navbar & footer full-width */}
      <Navbar />

      {/* Main content container (glass-friendly pages look great inside) */}
      <main className="relative max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
