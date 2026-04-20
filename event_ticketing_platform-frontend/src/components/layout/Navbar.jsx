import React, { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Ticket,
  Search,
  LogIn,
  UserPlus,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import logo from "../../assets/logo.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const user = useMemo(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Invalid user data in localStorage:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return null;
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const closeMenu = () => setMenuOpen(false);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 font-semibold transition ${
      isActive ? "text-blue-600" : "text-slate-800 hover:text-blue-600"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur transition-all duration-300 ${
        scrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div
        className={`mx-auto max-w-7xl px-4 transition-all duration-300 sm:px-6 lg:px-10 ${
          scrolled ? "py-2.5" : "py-4"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <NavLink
            to="/"
            className="flex items-center gap-3"
            onClick={closeMenu}
          >
            <img
              src={logo}
              alt="AllEventsHub logo"
              className={`w-auto transition-all duration-300 ${
                scrolled ? "h-10 sm:h-12 lg:h-14" : "h-12 sm:h-14 lg:h-16"
              }`}
            />

            <span
              className={`hidden font-bold text-blue-600 transition-all duration-300 sm:block ${
                scrolled ? "text-lg lg:text-xl" : "text-xl lg:text-2xl"
              }`}
            >
              AllEventsHub
            </span>
          </NavLink>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="rounded-xl border border-slate-200 p-2 text-slate-800 shadow-sm lg:hidden"
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <nav className="hidden items-center gap-6 lg:flex">
            <NavLink to="/" className={linkClass}>
              <Home className="h-5 w-5" /> Browse Events
            </NavLink>

            <NavLink to="/search-booking" className={linkClass}>
              <Search className="h-5 w-5" /> Search Booking
            </NavLink>

            {user ? (
              <>
                <NavLink to="/my-bookings" className={linkClass}>
                  <Ticket className="h-5 w-5" /> My Bookings
                </NavLink>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 font-semibold text-slate-800 transition hover:text-blue-600"
                >
                  <LogOut className="h-5 w-5" /> Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkClass}>
                  <LogIn className="h-5 w-5" /> Login
                </NavLink>

                <NavLink to="/register" className={linkClass}>
                  <UserPlus className="h-5 w-5" /> Register
                </NavLink>
              </>
            )}
          </nav>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 lg:hidden ${
            menuOpen ? "max-h-[420px] pt-4 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-md">
            <NavLink to="/" className={linkClass} onClick={closeMenu}>
              <Home className="h-5 w-5" /> Browse Events
            </NavLink>

            <NavLink
              to="/search-booking"
              className={linkClass}
              onClick={closeMenu}
            >
              <Search className="h-5 w-5" /> Search Booking
            </NavLink>

            {user ? (
              <>
                <NavLink
                  to="/my-bookings"
                  className={linkClass}
                  onClick={closeMenu}
                >
                  <Ticket className="h-5 w-5" /> My Bookings
                </NavLink>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 font-semibold text-slate-800 transition hover:text-blue-600"
                >
                  <LogOut className="h-5 w-5" /> Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkClass} onClick={closeMenu}>
                  <LogIn className="h-5 w-5" /> Login
                </NavLink>

                <NavLink
                  to="/register"
                  className={linkClass}
                  onClick={closeMenu}
                >
                  <UserPlus className="h-5 w-5" /> Register
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}








// import React, { useMemo, useState } from "react";
// import logo from "../../assets/logo.png";
// import { NavLink } from "react-router-dom";
// import {
//   Home,
//   Ticket,
//   Search,
//   LogIn,
//   UserPlus,
//   LogOut,
//   Menu,
//   X,
// } from "lucide-react";

// export default function Navbar() {
//   const [menuOpen, setMenuOpen] = useState(false);

//   const user = useMemo(() => {
//     const storedUser = localStorage.getItem("user");

//     if (!storedUser) return null;

//     try {
//       return JSON.parse(storedUser);
//     } catch (error) {
//       console.error("Invalid user data in localStorage:", error);
//       localStorage.removeItem("user");
//       localStorage.removeItem("token");
//       return null;
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     window.location.href = "/";
//   };

//   const linkClass = ({ isActive }) =>
//     `flex items-center gap-2 font-semibold transition ${
//       isActive ? "text-blue-600" : "text-slate-800 hover:text-blue-600"
//     }`;

//   const closeMenu = () => setMenuOpen(false);

//   return (
//     <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
//       <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-10">
//         <div className="flex items-center justify-between gap-4">

// <NavLink to="/" className="flex items-center gap-3">
//   <img
//     src={logo}
//     alt="logo"
//     className="h-12 w-auto sm:h-14 lg:h-16"
//   />

//   <span className="hidden sm:block text-xl lg:text-2xl font-bold text-blue-600">
//     AllEventsHub
//   </span>
// </NavLink>

//           <button
//             type="button"
//             onClick={() => setMenuOpen((prev) => !prev)}
//             className="rounded-lg border border-slate-200 p-2 text-slate-800 lg:hidden"
//             aria-label="Toggle menu"
//           >
//             {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//           </button>

//           <nav className="hidden items-center gap-6 lg:flex">
//             <NavLink to="/" className={linkClass}>
//               <Home className="h-5 w-5" /> Browse Events
//             </NavLink>

//             <NavLink to="/search-booking" className={linkClass}>
//               <Search className="h-5 w-5" /> Search Booking
//             </NavLink>

//             {user ? (
//               <>
//                 <NavLink to="/my-bookings" className={linkClass}>
//                   <Ticket className="h-5 w-5" /> My Bookings
//                 </NavLink>

//                 <button
//                   type="button"
//                   onClick={handleLogout}
//                   className="flex items-center gap-2 font-semibold text-slate-800 transition hover:text-blue-600"
//                 >
//                   <LogOut className="h-5 w-5" /> Logout
//                 </button>
//               </>
//             ) : (
//               <>
//                 <NavLink to="/login" className={linkClass}>
//                   <LogIn className="h-5 w-5" /> Login
//                 </NavLink>

//                 <NavLink to="/register" className={linkClass}>
//                   <UserPlus className="h-5 w-5" /> Register
//                 </NavLink>
//               </>
//             )}
//           </nav>
//         </div>

//         {menuOpen && (
//           <nav className="mt-4 flex flex-col gap-4 border-t border-slate-200 pt-4 lg:hidden">
//             <NavLink to="/" className={linkClass} onClick={closeMenu}>
//               <Home className="h-5 w-5" /> Browse Events
//             </NavLink>

//             <NavLink
//               to="/search-booking"
//               className={linkClass}
//               onClick={closeMenu}
//             >
//               <Search className="h-5 w-5" /> Search Booking
//             </NavLink>

//             {user ? (
//               <>
//                 <NavLink
//                   to="/my-bookings"
//                   className={linkClass}
//                   onClick={closeMenu}
//                 >
//                   <Ticket className="h-5 w-5" /> My Bookings
//                 </NavLink>

//                 <button
//                   type="button"
//                   onClick={handleLogout}
//                   className="flex items-center gap-2 font-semibold text-slate-800 transition hover:text-blue-600"
//                 >
//                   <LogOut className="h-5 w-5" /> Logout
//                 </button>
//               </>
//             ) : (
//               <>
//                 <NavLink to="/login" className={linkClass} onClick={closeMenu}>
//                   <LogIn className="h-5 w-5" /> Login
//                 </NavLink>

//                 <NavLink
//                   to="/register"
//                   className={linkClass}
//                   onClick={closeMenu}
//                 >
//                   <UserPlus className="h-5 w-5" /> Register
//                 </NavLink>
//               </>
//             )}
//           </nav>
//         )}
//       </div>
//     </header>
//   );
// }