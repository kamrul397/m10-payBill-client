import { useEffect, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { Link } from "react-router-dom";
import GlassPage from "./GlassPage";

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

  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIndex((i) => (i + 1) % slides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const el = document.getElementById(`banner-slide-${bannerIndex}`);
    if (!el) return;
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
        const unique = [...new Set(data.map((b) => b.category))];
        setCategories(unique);
      });
  }, []);

  return (
    <div className=" p-6 space-y-16">
      {/* Banner Carousel */}
      <div className="relative rounded-xl overflow-hidden shadow-lg">
        <div className="carousel w-full h-[300px] md:h-[320px] lg:h-[300px]">
          {slides.map((src, i) => (
            <div
              key={i}
              id={`banner-slide-${i}`}
              className="carousel-item w-full"
            >
              <img
                src={src}
                className="w-full h-full object-cover object-center"
              />
            </div>
          ))}
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 backdrop-blur-[1.5px] flex flex-col items-center justify-center text-white text-center px-4">
          <Fade duration={1000} triggerOnce>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              <span
                className="text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]
  backdrop-blur-sm px-4 py-1 rounded-xl inline-block"
              >
                Pay Your Monthly Bills Easily
              </span>
            </h1>

            <p className="py-2 text-sm md:text-base opacity-90">
              Electricity, Gas, Water & Internet in one place.
            </p>
            <Link
              to="/bills"
              className="btn btn-primary rounded-full px-6 mt-2"
            >
              View Bills
            </Link>
          </Fade>
        </div>
      </div>

      {/* Categories */}
      <section>
        <h2 className="text-3xl font-extrabold tracking-tight text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Bill Categories
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-8">
          {categories.map((c, i) => (
            <Link
              key={c}
              to={`/bills?category=${c}`}
              className={`p-6 text-center rounded-xl text-white font-semibold shadow-md hover:-translate-y-1 transition transform
              ${
                [
                  "bg-gradient-to-br from-primary to-secondary",
                  "bg-gradient-to-br from-pink-500 to-rose-500",
                  "bg-gradient-to-br from-emerald-500 to-teal-500",
                  "bg-gradient-to-br from-indigo-500 to-purple-600",
                ][i % 4]
              }`}
            >
              {c}
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Bills */}
      <section>
        <h2 className="text-3xl font-extrabold tracking-tight text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Recent Bills
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {recent.map((bill) => (
            <div
              key={bill._id}
              className="bg-base-100/80 backdrop-blur border border-base-300/60 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition overflow-hidden"
            >
              <img src={bill.image} className="h-40 w-full object-cover" />
              <div className="p-4 space-y-1">
                <h3 className="text-lg font-semibold">{bill.title}</h3>
                <p className="text-sm opacity-70">{bill.location}</p>
                <p className="text-xs opacity-60">Category: {bill.category}</p>
                <p className="font-extrabold text-primary text-lg">
                  ৳ {bill.amount}
                </p>

                <Link
                  to={`/bills/${bill._id}`}
                  className="btn btn-primary w-full rounded-full mt-3"
                >
                  See Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
