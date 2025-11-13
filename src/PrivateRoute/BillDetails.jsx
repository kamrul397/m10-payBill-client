import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContex";
import toast from "react-hot-toast";
import { Fade } from "react-awesome-reveal";
import Loader from "../components/Loader";
import api from "../lib/api";

export default function BillDetails() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    api
      .get(`/bills/${id}`)
      .then(({ data }) => setBill(data))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    api.get("/my-bills", { params: { email: user.email } }).then(({ data }) => {
      const alreadyPaid = data.find((b) => b.billsId === id);
      if (alreadyPaid) setPaid(true);
    });
  }, [user.email, id]);

  if (loading) return <Loader></Loader>;
  if (!bill) return <div className="p-8 text-center">Bill not found.</div>;

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

    api
      .post("/my-bills", newBill)
      .then(() => {
        toast.success("✅ Payment Successful!");
        setPaid(true);
        document.getElementById("payModal").close();
      })
      .catch((err) => toast.error(err));
  };

  return (
    <div className=" p-6 space-y-6">
      {/* Success message */}
      {paid && (
        <Fade duration={800}>
          <div className="p-4 bg-primary/10 border border-primary/30 text-primary rounded-md text-center font-semibold shadow-sm">
            🎉 Payment Successful!
          </div>
        </Fade>
      )}

      {/* Card */}
      <div className="bg-base-100/80 backdrop-blur border border-base-300/60 shadow-md rounded-xl overflow-hidden">
        <img src={bill.image} alt="" className="w-full h-64 object-cover" />

        <div className="p-6 space-y-3">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {bill.title}
          </h1>

          <div className="text-sm opacity-80 space-y-1">
            <p>
              <span className="font-medium">Category:</span> {bill.category}
            </p>
            <p>
              <span className="font-medium">Location:</span> {bill.location}
            </p>
            <p>
              <span className="font-medium">Amount:</span> ৳ {bill.amount}
            </p>
            <p>
              <span className="font-medium">Date:</span> {bill.date}
            </p>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <Link to="/bills" className="btn btn-ghost rounded-full px-4">
              Back to Bills
            </Link>

            <button
              disabled={paid}
              className={`btn btn-primary rounded-full px-6 ${
                paid && "btn-disabled"
              }`}
              onClick={() => document.getElementById("payModal").showModal()}
            >
              {paid ? "Already Paid" : "Pay Bill"}
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <dialog id="payModal" className="modal">
        <div className="modal-box rounded-xl">
          <h3 className="text-xl font-bold mb-3 text-center">
            Confirm Payment
          </h3>

          <form onSubmit={handlePay} className="space-y-3">
            <input
              value={user.email}
              readOnly
              className="input input-bordered w-full rounded-md"
            />
            <input
              name="username"
              placeholder="Your Name"
              defaultValue={user.displayName}
              required
              className="input input-bordered w-full rounded-md"
            />
            <input
              name="address"
              placeholder="Your Address"
              required
              className="input input-bordered w-full rounded-md"
            />
            <input
              name="phone"
              placeholder="Phone"
              required
              className="input input-bordered w-full rounded-md"
            />
            <input
              name="amount"
              placeholder="amount"
              defaultValue={bill.amount}
              readOnly
              required
              className="input input-bordered w-full rounded-md"
            />

            <button className="btn btn-primary w-full rounded-full">
              Confirm Payment
            </button>
          </form>

          <div className="modal-action">
            <button
              className="btn btn-ghost rounded-full px-5"
              onClick={() => document.getElementById("payModal").close()}
            >
              Cancel
            </button>
          </div>
        </div>
        <form className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
