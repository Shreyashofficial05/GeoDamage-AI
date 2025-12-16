import { Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") setDarkMode(false);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 border-b 
    border-gray-700 bg-gray-800/70 backdrop-blur-md sticky top-0 z-50">

      <Link to="/">
        <h1 className="text-2xl font-bold text-blue-400 cursor-pointer">
          GeoDamage AI
        </h1>
      </Link>

      <div className="flex items-center space-x-6 text-white">
        <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <Link to="/analyze" className="hover:text-blue-400 transition-colors">Analyze</Link>
        <Link to="/about" className="hover:text-blue-400 transition-colors">About</Link>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full hover:bg-gray-700 transition"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
