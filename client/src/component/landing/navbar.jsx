import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Cars", path: "/cars" },
    { name: "Off-Road", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "#contact" },
  ];

  // Smooth scroll handler
  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="pt-16">
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 px-12 flex items-center justify-between bg-black border-b border-white/10 backdrop-blur-sm">
        <Link to="/">
          <img src="/logo.png" alt="Logo" className="h-40 w-40 ml-0" />
        </Link>

        <ul className="relative flex gap-6 text-sm font-bold text-white/80 right-130">
          {navItems.map((item) => (
            <li key={item.name} className="relative">
              {item.name === "Contact" ? (
                <span
                  onClick={() => handleScroll("contact")}
                  className="relative cursor-pointer hover:text-white/30 transition
                             after:absolute after:left-0 after:-bottom-1
                             after:h-[2px] after:w-0 after:bg-white
                             after:transition-all after:duration-300 hover:after:w-full"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="relative cursor-pointer hover:text-white/30 transition
                             after:absolute after:left-0 after:-bottom-1
                             after:h-[2px] after:w-0 after:bg-white
                             after:transition-all after:duration-300 hover:after:w-full"
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
