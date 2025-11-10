import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "/logo.png"; // update path

export default function Footer() {
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState({ title: "", body: "" });

  const linkClasses =
    "bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80 transition";

  const openModal = (title, body) => {
    setModal({ title, body });
    setOpen(true);
  };

  return (
    <footer className=" text-base-content py-2">
      <div className=" flex gap-5 justify-center text-center flex-col">
        {/* Logo / Site Name + Description */}
        <div>
          <div className="flex justify-center items-center gap-3">
            <img
              src={logo}
              alt="logo"
              className="h-10  mask mask-circle w-auto rounded-xl ring-1 ring-base-300/60 group-hover:ring-primary/50 transition-all duration-300"
            />
            <span className="text-2xl font-extrabold hidden sm:inline tracking-tight">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                PayBill
              </span>
            </span>
          </div>
          <p className="mt-3 opacity-75">
            Easy and secure monthly bill payment. Save time, stay stress-free.
          </p>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Useful Links</h3>
          <ul className="flex justify-center gap-4 items-center flex-wrap">
            {/* Home (real link) */}
            <li>
              <Link to="/" className={linkClasses}>
                Home
              </Link>
            </li>

            {/* About (tooltip + modal on click) */}
            <li>
              <div className="tooltip" data-tip="Know our mission & team">
                <button
                  type="button"
                  className={linkClasses}
                  onClick={() =>
                    openModal(
                      "About PayBill",
                      `PayBill is a simple, secure platform to manage monthly bills 
                      in one place. We focus on speed, transparency, and reminders 
                      so you never miss a due date. Our vision is to make everyday 
                      payments stress-free for households and small businesses.`
                    )
                  }
                >
                  About
                </button>
              </div>
            </li>

            {/* Contact (tooltip + modal on click) */}
            <li>
              <div className="tooltip" data-tip="Reach support & partnerships">
                <button
                  type="button"
                  className={linkClasses}
                  onClick={() =>
                    openModal(
                      "Contact Us",
                      `We'd love to hear from you!
                      
                      • Support: kamrulislam25262800@gmail.com
                      • whatsapp: +8801894-565173
                      • Hours: Sun-Thu, 10:00-18:00 (BST)

                      Send us a message and we'll get back within 24 hours.`
                    )
                  }
                >
                  Contact
                </button>
              </div>
            </li>

            {/* Privacy (real link) */}
            <li>
              <div className="tooltip" data-tip="Read our privacy practices">
                <button
                  type="button"
                  className={linkClasses}
                  onClick={() =>
                    openModal(
                      "Privacy Policy",
                      `We value your privacy. PayBill collects only the information needed to operate the service, such as your account details (name, email), saved bill data, and basic usage logs. Payment details (cards, wallets, etc.) are processed securely by your selected payment gateway and are **not stored by us**.

We use your data to:
• Create and manage your account  
• Process and track bill payments  
• Send reminders and essential notifications  
• Improve security, reliability, and app performance  

We may share data only with:
• Payment gateways (for processing)
• Service providers helping operate the app
• Authorities if required by law

You can request to update or delete your data anytime.  
By using PayBill, you agree to this policy.

**Contact:** kamrulislam25262800@gmail.com
`
                    )
                  }
                >
                  Privacy Policy
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-5 border-t border-base-300  text-center opacity-60">
        © {new Date().getFullYear()} PayBill — All Rights Reserved.
      </div>

      {/* DaisyUI Modal */}
      {open && (
        <dialog open className="modal" onClose={() => setOpen(false)}>
          <div className="modal-box text-center">
            <h3 className="font-bold text-lg">{modal.title}</h3>
            <p className="py-3 whitespace-pre-line">{modal.body}</p>
            <div className="modal-action">
              <button className="btn" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setOpen(false)}>close</button>
          </form>
        </dialog>
      )}
    </footer>
  );
}
