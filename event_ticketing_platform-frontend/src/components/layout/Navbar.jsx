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
  Shield,
  Users,
  LayoutDashboard,
  CalendarDays,
  BarChart3,
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
    `flex items-center gap-2 font-semibold whitespace-nowrap transition ${
      isActive ? "text-blue-600" : "text-slate-800 hover:text-blue-600"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur transition-all duration-300 ${
        scrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div
        className={`mx-auto max-w-7xl px-4 transition-all duration-300 sm:px-6 lg:px-8 ${
          scrolled ? "py-2" : "py-3"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <NavLink
            to="/"
            className="flex min-w-0 items-center gap-2"
            onClick={closeMenu}
          >
            <img
              src={logo}
              alt="AllEventsHub logo"
              className={`w-auto transition-all duration-300 ${
                scrolled ? "h-9 sm:h-10 lg:h-11" : "h-10 sm:h-11 lg:h-12"
              }`}
            />

            <span className="hidden truncate font-bold text-blue-600 sm:block text-lg lg:text-xl">
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

          <nav className="hidden items-center gap-4 xl:gap-5 lg:flex">
            <NavLink to="/" className={linkClass}>
              <Home className="h-4 w-4" /> Browse
            </NavLink>

            <NavLink to="/search-booking" className={linkClass}>
              <Search className="h-4 w-4" /> Search
            </NavLink>

            {user ? (
              <>
                <span className="rounded-full bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 xl:text-sm">
                  Welcome, {user.name}
                </span>

                {user.role === "admin" ? (
                  <>
                    <NavLink to="/admin" className={linkClass}>
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </NavLink>

                    <NavLink to="/admin/events" className={linkClass}>
                      <CalendarDays className="h-4 w-4" /> Events
                    </NavLink>

                    <NavLink to="/admin/users" className={linkClass}>
                      <Users className="h-4 w-4" /> Users
                    </NavLink>

                    <NavLink to="/admin/analytics" className={linkClass}>
                      <BarChart3 className="h-4 w-4" /> Analytics
                    </NavLink>
                  </>
                ) : (
                  <NavLink to="/my-bookings" className={linkClass}>
                    <Ticket className="h-4 w-4" /> My Bookings
                  </NavLink>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 font-semibold text-slate-800 transition hover:text-blue-600"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkClass}>
                  <LogIn className="h-4 w-4" /> Login
                </NavLink>

                <NavLink to="/register" className={linkClass}>
                  <UserPlus className="h-4 w-4" /> Register
                </NavLink>
              </>
            )}
          </nav>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 lg:hidden ${
            menuOpen ? "max-h-[560px] pt-4 opacity-100" : "max-h-0 opacity-0"
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
                <div className="rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
                  Welcome, {user.name}
                </div>

                {user.role === "admin" ? (
                  <>
                    <NavLink to="/admin" className={linkClass} onClick={closeMenu}>
                      <LayoutDashboard className="h-5 w-5" /> Dashboard
                    </NavLink>

                    <NavLink
                      to="/admin/events"
                      className={linkClass}
                      onClick={closeMenu}
                    >
                      <CalendarDays className="h-5 w-5" /> Manage Events
                    </NavLink>

                    <NavLink
                      to="/admin/users"
                      className={linkClass}
                      onClick={closeMenu}
                    >
                      <Users className="h-5 w-5" /> Manage Users
                    </NavLink>

                    <NavLink
                      to="/admin/analytics"
                      className={linkClass}
                      onClick={closeMenu}
                    >
                      <Shield className="h-5 w-5" /> View Bookings
                    </NavLink>
                  </>
                ) : (
                  <NavLink
                    to="/my-bookings"
                    className={linkClass}
                    onClick={closeMenu}
                  >
                    <Ticket className="h-5 w-5" /> My Bookings
                  </NavLink>
                )}

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





// import React, { useEffect, useMemo, useState } from "react";
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
//   Shield,
//   Users,
//   LayoutDashboard,
//   CalendarDays,
// } from "lucide-react";
// import logo from "../../assets/logo.png";

// export default function Navbar() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);

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

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 20);
//     };

//     window.addEventListener("scroll", handleScroll);
//     handleScroll();

//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     window.location.href = "/";
//   };

//   const closeMenu = () => setMenuOpen(false);

//   const linkClass = ({ isActive }) =>
//     `flex items-center gap-2 font-semibold transition ${
//       isActive ? "text-blue-600" : "text-slate-800 hover:text-blue-600"
//     }`;

//   return (
//     <header
//       className={`sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur transition-all duration-300 ${
//         scrolled ? "shadow-md" : "shadow-sm"
//       }`}
//     >
//       <div
//         className={`mx-auto max-w-7xl px-4 transition-all duration-300 sm:px-6 lg:px-10 ${
//           scrolled ? "py-2.5" : "py-4"
//         }`}
//       >
//         <div className="flex items-center justify-between gap-4">
//           <NavLink
//             to="/"
//             className="flex items-center gap-3"
//             onClick={closeMenu}
//           >
//             <img
//               src={logo}
//               alt="AllEventsHub logo"
//               className={`w-auto transition-all duration-300 ${
//                 scrolled ? "h-10 sm:h-12 lg:h-14" : "h-12 sm:h-14 lg:h-16"
//               }`}
//             />

//             <span
//               className={`hidden font-bold text-blue-600 transition-all duration-300 sm:block ${
//                 scrolled ? "text-lg lg:text-xl" : "text-xl lg:text-2xl"
//               }`}
//             >
//               AllEventsHub
//             </span>
//           </NavLink>

//           <button
//             type="button"
//             onClick={() => setMenuOpen((prev) => !prev)}
//             className="rounded-xl border border-slate-200 p-2 text-slate-800 shadow-sm lg:hidden"
//             aria-label="Toggle navigation menu"
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
//                 <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
//                   Welcome, {user.name}
//                 </span>

//                 {user.role === "admin" ? (
//                   <>
//                     <NavLink to="/admin" className={linkClass}>
//                       <LayoutDashboard className="h-5 w-5" /> Dashboard
//                     </NavLink>

//                     <NavLink to="/admin/events" className={linkClass}>
//                       <CalendarDays className="h-5 w-5" /> Manage Events
//                     </NavLink>

//                     <NavLink to="/admin/users" className={linkClass}>
//                       <Users className="h-5 w-5" /> Manage Users
//                     </NavLink>

//                     <NavLink to="/admin/analytics" className={linkClass}>
//                       <Shield className="h-5 w-5" /> View Bookings
//                     </NavLink>
//                   </>
//                 ) : (
//                   <NavLink to="/my-bookings" className={linkClass}>
//                     <Ticket className="h-5 w-5" /> My Bookings
//                   </NavLink>
//                 )}

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

//         <div
//           className={`overflow-hidden transition-all duration-300 lg:hidden ${
//             menuOpen ? "max-h-[520px] pt-4 opacity-100" : "max-h-0 opacity-0"
//           }`}
//         >
//           <nav className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-md">
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
//                 <div className="rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
//                   Welcome, {user.name}
//                 </div>

//                 {user.role === "admin" ? (
//                   <>
//                     <NavLink to="/admin" className={linkClass} onClick={closeMenu}>
//                       <LayoutDashboard className="h-5 w-5" /> Dashboard
//                     </NavLink>

//                     <NavLink
//                       to="/admin/events"
//                       className={linkClass}
//                       onClick={closeMenu}
//                     >
//                       <CalendarDays className="h-5 w-5" /> Manage Events
//                     </NavLink>

//                     <NavLink
//                       to="/admin/users"
//                       className={linkClass}
//                       onClick={closeMenu}
//                     >
//                       <Users className="h-5 w-5" /> Manage Users
//                     </NavLink>

//                     <NavLink
//                       to="/admin/analytics"
//                       className={linkClass}
//                       onClick={closeMenu}
//                     >
//                       <Shield className="h-5 w-5" /> View Bookings
//                     </NavLink>
//                   </>
//                 ) : (
//                   <NavLink
//                     to="/my-bookings"
//                     className={linkClass}
//                     onClick={closeMenu}
//                   >
//                     <Ticket className="h-5 w-5" /> My Bookings
//                   </NavLink>
//                 )}

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
//         </div>
//       </div>
//     </header>
//   );
// }