import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

export default function Bills() {
  const [bills, setBills] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState(searchParams.get("category") || "");

  const fetchBills = () => {
    let url = "http://localhost:3000/bills";
    if (category) url += `?category=${encodeURIComponent(category)}`;
    fetch(url)
      .then((r) => r.json())
      .then(setBills);
  };

  useEffect(() => {
    fetchBills();
  }, [category]);

  // keep URL in sync when user changes dropdown
  useEffect(() => {
    if (category) setSearchParams({ category });
    else setSearchParams({});
  }, [category, setSearchParams]);

  return (
    <div className=" p-6 space-y-8">
      {/* Page Title */}
      <h1 className="text-3xl font-extrabold text-center tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        All Bills
      </h1>

      {/* Category Filter */}
      <div className="flex justify-center">
        <select
          className="select select-bordered rounded-full px-5 shadow-sm bg-base-100/80 backdrop-blur"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Electricity">Electricity</option>
          <option value="Gas">Gas</option>
          <option value="Water">Water</option>
          <option value="Internet">Internet</option>
        </select>
      </div>

      {/* Cards Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {bills.map((bill) => (
          <div
            key={bill._id}
            className="bg-base-100/80 backdrop-blur border border-base-300/60 rounded-xl shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition"
          >
            <img
              src={bill.image}
              className="h-40 w-full object-cover"
              alt="bill"
            />

            <div className="p-4 space-y-1">
              <h2 className="text-lg font-semibold">{bill.title}</h2>
              <p className="text-sm opacity-70">{bill.location}</p>

              <p className="text-xs opacity-60">
                Category: <span className="font-medium">{bill.category}</span>
              </p>

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

      {bills.length === 0 && (
        <p className="text-center opacity-60 mt-10">No bills found.</p>
      )}
    </div>
  );
}
