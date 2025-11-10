import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const getInitial = () => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const [theme, setTheme] = useState(getInitial);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme); // daisyUI reads this
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <label className="flex cursor-pointer items-center gap-2">
      <span className="text-sm">Theme</span>
      <input
        type="checkbox"
        className="toggle"
        checked={theme === "dark"}
        onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
        aria-label="Toggle dark mode"
      />
    </label>
  );
}
