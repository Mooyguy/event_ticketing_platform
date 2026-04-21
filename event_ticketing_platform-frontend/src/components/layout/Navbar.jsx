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
      console.error("Invalid user data:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return null;
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);

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
      className={`sticky top-0 z-50 border-b bg-white/95 backdrop-blur transition ${
        scrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div
        className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${
          scrolled ? "py-2" : "py-3"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          {/* LOGO */}
          <NavLink
            to="/"
            className="flex items-center gap-2"
            onClick={closeMenu}
          >
            <img
              src={logo}
              alt="logo"
              className={`${
                scrolled ? "h-9" : "h-11"
              } transition-all`}
            />
            <span className="hidden sm:block font-bold text-blue-600 text-lg">
              AllEventsHub
            </span>
          </NavLink>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="lg:hidden p-2 border rounded"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-4">
            <NavLink to="/" className={linkClass}>
              <Home className="h-4 w-4" /> Home
            </NavLink>

            {/* <NavLink to="/search-booking" className={linkClass}>
              <Search className="h-4 w-4" /> Search
            </NavLink> */}

            {user ? (
              <>
                {/* Welcome */}
                <span className="bg-blue-50 px-3 py-2 rounded-full text-xs font-semibold text-blue-700">
                  Welcome, {user.role === "admin" ? "Admin" : user.name}
                </span>

                {/* ADMIN LINKS */}
                {user.role === "admin" ? 
                (
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

                     <NavLink to="/admin/bookings" className={linkClass}>
                       <Ticket className="h-4 w-4" /> Bookings
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

                {/* LOGOUT */}
                <button onClick={handleLogout} className="flex items-center gap-2">
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

        {/* MOBILE MENU */}
        {menuOpen && (
          <nav className="lg:hidden mt-4 flex flex-col gap-3 border p-4 rounded shadow">
            <NavLink to="/" className={linkClass} onClick={closeMenu}>
              Browse Events
            </NavLink>

            <NavLink to="/search-booking" className={linkClass} onClick={closeMenu}>
              Search Booking
            </NavLink>

            {user ? (
              <>
                <div className="bg-blue-50 px-4 py-2 rounded">
                  Welcome, {user.role === "admin" ? "Admin" : user.name}
                </div>

                {user.role === "admin" ? (
                  <>
                    <NavLink to="/admin" onClick={closeMenu}>Dashboard</NavLink>
                    <NavLink to="/admin/events" onClick={closeMenu}>Events</NavLink>
                    <NavLink to="/admin/users" onClick={closeMenu}>Users</NavLink>
                    <NavLink to="/admin/bookings" onClick={closeMenu}>Bookings</NavLink>
                    <NavLink to="/admin/analytics" onClick={closeMenu}>Analytics</NavLink>
                  </>
                ) : (
                  <NavLink to="/my-bookings" onClick={closeMenu}>
                    My Bookings
                  </NavLink>
                )}

                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <NavLink to="/login" onClick={closeMenu}>Login</NavLink>
                <NavLink to="/register" onClick={closeMenu}>Register</NavLink>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}