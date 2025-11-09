import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContex";

export default function BillDetails() {
  const { user } = useContext(AuthContext);

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

  const handlePay = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const payment = {
      billsId: bill._id,
      username: form.get("username"),
      address: form.get("address"),
      phone: form.get("phone"),
      email: user.email, // ✅ auto-filled
      amount: bill.amount, // ✅ from details
      date: bill.date, // ✅ keeps original bill month
    };

    fetch("http://localhost:3000/my-bills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payment),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Bill Paid Successfully ✅"); // later replace with toast
        document.getElementById("payModal").close();
      });
  };

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
        <button
          className="btn btn-primary mt-5"
          onClick={() => document.getElementById("payModal").showModal()}
        >
          Pay Bill
        </button>

        <dialog id="payModal" className="modal">
          <div className="modal-box">
            <h3 className="text-lg font-bold mb-3">Pay This Bill</h3>

            <form onSubmit={handlePay} className="space-y-3">
              <input
                type="text"
                value={user?.email}
                readOnly
                className="input input-bordered w-full"
              />
              <input
                name="username"
                placeholder="Your Name"
                className="input input-bordered w-full"
                required
              />
              <input
                name="address"
                placeholder="Your Address"
                className="input input-bordered w-full"
                required
              />
              <input
                name="phone"
                placeholder="Phone"
                className="input input-bordered w-full"
                required
              />

              <button className="btn btn-primary w-full">
                Confirm Payment
              </button>
            </form>

            <div className="modal-action">
              <button
                className="btn"
                onClick={() => document.getElementById("payModal").close()}
              >
                Cancel
              </button>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  );
}
