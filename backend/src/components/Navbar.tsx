import { Moon, Sun } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [dark, setDark] = useState(false);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setDark(!dark);
  };

  return (
    <header className="w-full py-5 mb-10">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-brand-gradient">
          LiveRoadmap
        </div>

        {/* Nav */}
        <nav className="hidden md:flex gap-8 text-gray-600 dark:text-gray-300 text-sm">
          <a className="hover:text-brand transition" href="#">Home</a>
          <a className="hover:text-brand transition" href="#">Roadmap</a>
          <a className="hover:text-brand transition" href="#">Snapshots</a>
          <a className="hover:text-brand transition" href="#">Profile</a>
        </nav>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-card-light dark:bg-card-dark shadow-soft hover:shadow-card transition"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
