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
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-center">All Bills</h1>

      <div className="flex justify-center">
        <select
          className="select select-bordered w-full max-w-xs"
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

      <div className="grid md:grid-cols-3 gap-6">
        {bills.map((bill) => (
          <div key={bill._id} className="border p-4 rounded-lg shadow-sm">
            <img
              src={bill.image}
              className="h-40 w-full object-cover rounded"
            />
            <h2 className="text-lg font-semibold mt-2">{bill.title}</h2>
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
    </div>
  );
}
