import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContex";
import toast from "react-hot-toast";
import { Fade } from "react-awesome-reveal";

export default function BillDetails() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3000/bills/${id}`)
      .then((res) => res.json())
      .then((data) => setBill(data))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetch(`http://localhost:3000/my-bills?email=${user.email}`)
      .then((res) => res.json())
      .then((data) => {
        const alreadyPaid = data.find((b) => b.billsId === id);
        if (alreadyPaid) setPaid(true);
      });
  }, [user.email, id]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (!bill) return <div className="p-6">Bill not found.</div>;

  const handlePay = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const newBill = {
      billsId: bill._id,
      username: form.get("username"),
      email: user.email,
      phone: form.get("phone"),
      address: form.get("address"),
      amount: bill.amount,
      date: new Date().toISOString().slice(0, 10),
      title: bill.title,
    };

    fetch("http://localhost:3000/my-bills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBill),
    })
      .then((res) => res.json())
      .then(() => {
        toast.success("✅ Payment Successful!");
        setPaid(true);
        document.getElementById("payModal").close();
      });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-5">
      {paid && (
        <Fade duration={800}>
          <div className="p-4 bg-green-100 border border-green-300 text-green-800 rounded-md text-center font-semibold">
            🎉 Payment Successful!
          </div>
        </Fade>
      )}

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

      <div className="flex items-center justify-center">
        <Link to="/bills" className="btn">
          Back to Bills
        </Link>

        <button
          disabled={paid}
          className="btn btn-primary mt-3"
          onClick={() => document.getElementById("payModal").showModal()}
        >
          {paid ? "Already Paid" : "Pay Bill"}
        </button>
      </div>

      <dialog id="payModal" className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold mb-3">Pay This Bill</h3>

          <form onSubmit={handlePay} className="space-y-3">
            <input
              value={user.email}
              readOnly
              className="input input-bordered w-full"
            />
            <input
              name="username"
              placeholder="Your Name"
              required
              className="input input-bordered w-full"
            />
            <input
              name="address"
              placeholder="Your Address"
              required
              className="input input-bordered w-full"
            />
            <input
              name="phone"
              placeholder="Phone"
              required
              className="input input-bordered w-full"
            />

            <button className="btn btn-primary w-full">Confirm Payment</button>
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
  );
}
