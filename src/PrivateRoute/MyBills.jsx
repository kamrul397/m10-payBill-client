import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContex";
import autoTable from "jspdf-autotable";

import jsPDF from "jspdf";

export default function MyBills() {
  const { user } = useContext(AuthContext);
  const [myBills, setMyBills] = useState([]);
  const [editing, setEditing] = useState(null); // stores selected bill
  const [toDelete, setToDelete] = useState(null);

  const totalBills = myBills.length;
  const totalAmount = myBills.reduce((sum, b) => sum + Number(b.amount), 0);

  useEffect(() => {
    fetch(`http://localhost:3000/my-bills?email=${user.email}`)
      .then((res) => res.json())
      .then((data) => setMyBills(data));
  }, [user.email]);

  const handleUpdate = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const updated = {
      amount: form.get("amount"),
      phone: form.get("phone"),
      address: form.get("address"),
      date: form.get("date"),
    };

    fetch(`http://localhost:3000/my-bills/${editing._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    })
      .then((res) => res.json())
      .then(() => {
        // refresh list
        setMyBills((prev) =>
          prev.map((item) =>
            item._id === editing._id ? { ...item, ...updated } : item
          )
        );
        setEditing(null); // close modal
      });
  };

  const handleDelete = () => {
    fetch(`http://localhost:3000/my-bills/${toDelete._id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        // Remove from UI
        setMyBills((prev) => prev.filter((item) => item._id !== toDelete._id));
        setToDelete(null); // close modal
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
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">My Paid Bills</h1>
      <div>
        <div className="flex justify-between items-center bg-base-200 p-4 rounded-md shadow">
          <p className="text-lg font-medium">
            Total Bills Paid: <span className="font-bold">{totalBills}</span>
          </p>
          <p className="text-lg font-medium">
            Total Amount: <span className="font-bold">৳ {totalAmount}</span>
          </p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={downloadReport}>
          Download Report (PDF)
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Amount</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {myBills.map((b, idx) => (
              <tr key={b._id}>
                <td>{idx + 1}</td>
                <td>{b.username}</td>
                <td>৳ {b.amount}</td>
                <td>{b.phone}</td>
                <td>{b.address}</td>
                <td>{b.date}</td>
                <td className="flex gap-2">
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => setEditing(b)}
                  >
                    Update
                  </button>

                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => setToDelete(b)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {editing && (
          <dialog id="editModal" open className="modal">
            <div className="modal-box max-w-sm">
              <h3 className="font-bold text-lg mb-3">Update Bill</h3>

              <form onSubmit={(e) => handleUpdate(e)} className="space-y-3">
                <input
                  type="text"
                  name="amount"
                  defaultValue={editing.amount}
                  className="input input-bordered w-full"
                />
                <input
                  type="text"
                  name="phone"
                  defaultValue={editing.phone}
                  className="input input-bordered w-full"
                />
                <input
                  type="text"
                  name="address"
                  defaultValue={editing.address}
                  className="input input-bordered w-full"
                />
                <input
                  type="date"
                  name="date"
                  defaultValue={editing.date}
                  className="input input-bordered w-full"
                />

                <button className="btn btn-primary w-full">Save Changes</button>
              </form>

              <div className="modal-action">
                <button className="btn" onClick={() => setEditing(null)}>
                  Close
                </button>
              </div>
            </div>
          </dialog>
        )}
        {toDelete && (
          <dialog id="deleteModal" open className="modal">
            <div className="modal-box max-w-sm">
              <h3 className="font-bold text-lg">
                Are you sure you want to delete this bill?
              </h3>
              <p className="py-2 text-sm opacity-80">
                This action cannot be undone.
              </p>

              <div className="modal-action flex justify-end gap-3">
                <button className="btn" onClick={() => setToDelete(null)}>
                  Cancel
                </button>
                <button className="btn btn-error" onClick={handleDelete}>
                  Confirm Delete
                </button>
              </div>
            </div>
          </dialog>
        )}
      </div>
    </div>
  );
}
