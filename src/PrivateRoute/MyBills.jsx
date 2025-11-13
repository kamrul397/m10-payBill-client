import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContex";
import autoTable from "jspdf-autotable";

import jsPDF from "jspdf";
import api from "../lib/api";
import toast from "react-hot-toast";

export default function MyBills() {
  const { user } = useContext(AuthContext);
  const [myBills, setMyBills] = useState([]);
  const [editing, setEditing] = useState(null); // stores selected bill
  const [toDelete, setToDelete] = useState(null);

  const totalBills = myBills.length;
  const totalAmount = myBills.reduce((sum, b) => sum + Number(b.amount), 0);

  useEffect(() => {
    api
      .get("/my-bills", { params: { email: user.email } })
      .then(({ data }) => setMyBills(data));
  }, [user.email]);

  const handleUpdate = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const updated = {
      amount: form.get("amount")?.trim(),
      phone: form.get("phone")?.trim(),
      address: form.get("address")?.trim(),
      date: form.get("date"),
    };

    // 1️⃣ Check empty fields
    if (
      !updated.amount ||
      !updated.phone ||
      !updated.address ||
      !updated.date
    ) {
      toast.error("All fields are required!");
      return;
    }

    // 2️⃣ Check if nothing changed
    const noChange =
      updated.amount == editing.amount &&
      updated.phone == editing.phone &&
      updated.address == editing.address &&
      updated.date == editing.date;

    if (noChange) {
      toast("No changes detected", { icon: "⚠️" });
      return;
    }

    // 3️⃣ Perform update
    api
      .patch(`/my-bills/${editing._id}`, updated)
      .then(() => {
        setMyBills((prev) =>
          prev.map((item) =>
            item._id === editing._id ? { ...item, ...updated } : item
          )
        );

        toast.success("Bill updated successfully!");
        setEditing(null);
      })
      .catch(() => {
        toast.error("Update failed. Try again!");
      });
  };

  const handleDelete = () => {
    api.delete(`/my-bills/${toDelete._id}`).then(() => {
      setMyBills((prev) => prev.filter((item) => item._id !== toDelete._id));
      setToDelete(null);
    });
  };

  const downloadReport = () => {
    const doc = new jsPDF();

    // Title & meta
    doc.setFontSize(16);
    doc.text("My Paid Bills Report", 14, 16);
    doc.setFontSize(11);
    doc.text(`Total Bills: ${totalBills}`, 14, 24);
    doc.text(`Total Amount: ৳${totalAmount}`, 80, 24);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 32);

    // Table
    const columns = [
      "#",
      "Username",
      "Email",
      "Bill Title",
      "Amount",
      "Phone",
      "Address",
      "Date",
    ];
    const rows = myBills.map((b, i) => [
      i + 1,
      b.username || "",
      b.email || "",
      b.title || "", // include if you saved bill title on POST
      Number(b.amount || 0),
      b.phone || "",
      b.address || "",
      b.date || "",
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 38,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [0, 0, 0] },
      columnStyles: { 4: { halign: "right" } }, // Amount right-aligned
      foot: [
        [
          { content: "Totals", colSpan: 4 },
          { content: `৳${totalAmount}`, styles: { halign: "right" } },
          { content: "", colSpan: 3 },
        ],
      ],
    });

    doc.save("my-bills-report.pdf");
  };

  return (
    <div className=" p-6 space-y-6">
      {/* Page Title */}
      <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
        My Paid Bills
      </h1>

      {/* Summary Card */}
      <div className="bg-base-100/80 backdrop-blur border border-base-300/60 rounded-xl shadow-sm p-5 flex flex-wrap justify-between items-center gap-4">
        <div className="text-lg font-medium">
          Total Bills Paid: <span className="font-bold">{totalBills}</span>
        </div>
        <div className="text-lg font-medium">
          Total Spent:{" "}
          <span className="font-bold text-primary">৳ {totalAmount}</span>
        </div>
        <button
          className="btn btn-primary rounded-full px-5"
          onClick={downloadReport}
        >
          Download Report (PDF)
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-base-100/80 backdrop-blur border border-base-300/60 rounded-xl shadow-sm p-3">
        <table className="table w-full">
          <thead className="bg-base-200 text-sm">
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Amount</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Date</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {myBills.map((b, idx) => (
              <tr key={b._id} className="hover:bg-base-200/40 transition">
                <td>{idx + 1}</td>
                <td className="font-medium">{b.username}</td>
                <td className="font-semibold text-primary">৳ {b.amount}</td>
                <td>{b.phone}</td>
                <td>{b.address}</td>
                <td>{b.date}</td>
                <td>
                  <div className="flex justify-center gap-2">
                    <button
                      className="btn btn-info btn-xs rounded-full"
                      onClick={() => setEditing(b)}
                    >
                      Update
                    </button>

                    <button
                      className="btn btn-error btn-xs rounded-full"
                      onClick={() => setToDelete(b)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Update Modal */}
      {editing && (
        <dialog open className="modal">
          <div className="modal-box rounded-xl shadow-lg">
            <h3 className="font-bold text-lg text-center mb-4">Update Bill</h3>

            <form onSubmit={handleUpdate} className="space-y-3">
              <input
                name="amount"
                defaultValue={editing.amount}
                className="input input-bordered w-full rounded-md"
              />
              <input
                name="phone"
                defaultValue={editing.phone}
                className="input input-bordered w-full rounded-md"
              />
              <input
                name="address"
                defaultValue={editing.address}
                className="input input-bordered w-full rounded-md"
              />
              <input
                name="date"
                type="date"
                defaultValue={editing.date}
                className="input input-bordered w-full rounded-md"
              />

              <button className="btn btn-primary w-full rounded-full">
                Save Changes
              </button>
            </form>

            <div className="modal-action">
              <button
                className="btn btn-ghost rounded-full px-5"
                onClick={() => setEditing(null)}
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}

      {/* Delete Modal */}
      {toDelete && (
        <dialog open className="modal">
          <div className="modal-box rounded-xl shadow-lg text-center">
            <h3 className="font-bold text-lg mb-2">Delete Bill?</h3>
            <p className="text-sm opacity-80 mb-4">
              This action cannot be undone.
            </p>

            <div className="flex justify-center gap-3">
              <button
                className="btn btn-ghost rounded-full px-5"
                onClick={() => setToDelete(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-error rounded-full px-5"
                onClick={handleDelete}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}
