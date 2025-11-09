import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function BillDetails() {
  const { id } = useParams();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3000/bills/${id}`)
      .then((res) => res.json())
      .then((data) => setBill(data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (!bill || !bill._id) return <div className="p-6">Bill not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-3">
      <img
        src={bill.image}
        alt=""
        className="w-full h-64 object-cover rounded"
      />
      <h1 className="text-2xl font-semibold">{bill.title}</h1>
      <p>Category: {bill.category}</p>
      <p>Location: {bill.location}</p>
      <p>Amount: ৳ {bill.amount}</p>
      <p>Date: {bill.date}</p>

      <div className="flex gap-3 pt-2">
        <Link to="/bills" className="btn">
          Back to Bills
        </Link>
        <button className="btn btn-primary">Pay Bill</button>
      </div>
    </div>
  );
}
