import { useEffect, useState, useContext } from "react";

import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContex";

export default function BillDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [bill, setBill] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3000/bills/${id}`)
      .then((res) => res.json())
      .then((data) => setBill(data));
  }, [id]);

  if (!bill) return <div className="p-6 text-center">Loading...</div>;

  // ✅ Check Current Month Only
  const billMonth = new Date(bill.date).getMonth();
  const nowMonth = new Date().getMonth();
  const canPay = billMonth === nowMonth;

  const handlePay = async (e) => {
    e.preventDefault();

    const form = e.target;
    const data = {
      billsId: bill._id,
      username: form.username.value,
      phone: form.phone.value,
      address: form.address.value,
      email: user.email,
      amount: bill.amount,
      date: bill.date,
    };

    await fetch("http://localhost:3000/my-bills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    toast.success("Bill Paid Successfully ✅");
    setOpen(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <img src={bill.image} className="rounded-lg w-full h-64 object-cover" />

      <h1 className="text-3xl font-semibold">{bill.title}</h1>
      <p className="text-gray-600">{bill.description}</p>
      <p className="font-semibold">Category: {bill.category}</p>
      <p className="font-semibold">Location: {bill.location}</p>
      <p className="text-2xl font-bold">৳ {bill.amount}</p>
      <p>Date: {bill.date}</p>

      <button
        disabled={!canPay}
        onClick={() => setOpen(true)}
        className={`btn w-full ${canPay ? "btn-primary" : "btn-disabled"}`}
      >
        {canPay ? "Pay Bill" : "Only Current Month Bill Can Be Paid"}
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 grid place-items-center">
          <form
            onSubmit={handlePay}
            className="bg-white p-6 rounded-lg w-96 space-y-3"
          >
            <h2 className="text-xl font-semibold">Pay Bill</h2>

            <input
              className="input input-bordered w-full"
              value={user.email}
              readOnly
            />

            <input
              name="username"
              required
              placeholder="Your Name"
              className="input input-bordered w-full"
            />

            <input
              name="phone"
              required
              placeholder="Phone Number"
              className="input input-bordered w-full"
            />

            <input
              name="address"
              required
              placeholder="Address"
              className="input input-bordered w-full"
            />

            <button className="btn btn-primary w-full">Confirm Payment</button>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn btn-error w-full"
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
