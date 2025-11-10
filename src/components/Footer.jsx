export default function Footer() {
  return (
    <footer className="bg-base-200 text-base-content py-10">
      <div className="max-w-6xl mx-auto px-4 flex gap-10 justify-center text-center flex-col">
        {/* Logo / Site Name + Description */}
        <div>
          <h2 className="text-2xl font-bold">PayBill</h2>
          <p className="mt-3 opacity-75">
            Easy and secure monthly bill payment. Save time, stay stress-free.
          </p>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Useful Links</h3>
          <ul className="flex flex-col gap-2">
            <li>
              <a href="/" className="link link-hover">
                Home
              </a>
            </li>
            <li>
              <a href="/about" className="link link-hover">
                About
              </a>
            </li>
            <li>
              <a href="/contact" className="link link-hover">
                Contact
              </a>
            </li>
            <li>
              <a href="/privacy" className="link link-hover">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10 border-t border-base-300 pt-5 text-center opacity-60">
        © {new Date().getFullYear()} PayBill — All Rights Reserved.
      </div>
    </footer>
  );
}
