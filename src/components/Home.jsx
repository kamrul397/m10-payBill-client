import { useEffect, useState } from "react";

export default function Home() {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/bills?limit=6")
      .then((res) => res.json())
      .then((data) => setBills(data));
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <h1 className="text-3xl font-semibold text-center">Recent Bills</h1>

      <div className="grid gap-6 md:grid-cols-3">
        {bills.map((bill) => (
          <div key={bill._id} className="border rounded-lg p-4 shadow-sm">
            <img
              src={bill.image}
              alt=""
              className="h-40 w-full object-cover rounded"
            />
            <h2 className="text-xl font-semibold mt-2">{bill.title}</h2>
            <p className="text-sm text-gray-600">
              {bill.location} • {bill.category}
            </p>
            <p className="font-bold mt-1">৳ {bill.amount}</p>
            <button className="mt-3 btn btn-primary w-full">See Details</button>
          </div>
        ))}
      </div>
    </div>
  );
}
