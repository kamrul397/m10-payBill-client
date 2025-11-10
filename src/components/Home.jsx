import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [recent, setRecent] = useState([]);
  const [categories, setCategories] = useState([]);

  // ✅ Auto-rotating DaisyUI carousel (images only; text stays fixed)
  const slides = [
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    "https://plus.unsplash.com/premium_photo-1668613403113-a9af97ed6168?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870",
  ];

  const [bannerIndex, setBannerIndex] = useState(0);

  // Auto-advance every 3.5s
  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIndex((i) => (i + 1) % slides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const el = document.getElementById(`banner-slide-${bannerIndex}`);
    if (!el) return;

    // ✅ only auto-scroll if user is near top
    if (window.scrollY < 200) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  }, [bannerIndex]);

  useEffect(() => {
    fetch("http://localhost:3000/bills?limit=6")
      .then((res) => res.json())
      .then((data) => {
        setRecent(data);

        // ✅ Extract unique categories from bills received
        const unique = [...new Set(data.map((b) => b.category))];
        setCategories(unique);
      });
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-16">
      {/* Banner Carousel (DaisyUI) */}
      <div className="relative rounded-xl overflow-hidden">
        {/* Images change automatically */}
        <div className="carousel w-full h-64">
          {slides.map((src, i) => (
            <div
              key={i}
              id={`banner-slide-${i}`}
              className="carousel-item w-full"
            >
              <img src={src} className="w-full h-64 object-cover" />
            </div>
          ))}
        </div>

        {/* Fixed overlay text + button (does NOT change) */}
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-3xl font-bold">Pay Your Monthly Bills Easily</h1>
          <p className="py-2 text-sm opacity-90">
            Electricity, Gas, Water & Internet in one place.
          </p>
          <Link to="/bills" className="btn btn-primary">
            View Bills
          </Link>
        </div>
      </div>

      {/* ✅ Dynamic Categories */}
      <section>
        <h2 className="text-2xl font-bold text-center">Bill Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-6">
          {categories.map((c) => (
            <Link
              key={c}
              to={`/bills?category=${c}`}
              className="p-4 border rounded-lg shadow hover:shadow-md text-center"
            >
              <h3 className="font-semibold">{c}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Bills */}
      <section>
        <h2 className="text-2xl font-bold text-center">Recent Bills</h2>

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {recent.map((bill) => (
            <div key={bill._id} className="border p-4 rounded-lg shadow-sm">
              <img
                src={bill.image}
                className="h-40 w-full object-cover rounded"
              />
              <h3 className="text-lg font-semibold mt-2">{bill.title}</h3>
              <p className="text-sm text-gray-600">{bill.location}</p>
              <p className="text-sm text-gray-500">Category: {bill.category}</p>
              <p className="font-bold mt-1">৳ {bill.amount}</p>
              <Link
                to={`/bills/${bill._id}`}
                className="btn btn-primary w-full mt-3"
              >
                See Details
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
