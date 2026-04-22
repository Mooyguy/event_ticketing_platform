import React, { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Ticket,
  LogIn,
  UserPlus,
  LogOut,
  Menu,
  X,
  Users,
  LayoutDashboard,
  CalendarDays,
  BarChart3,
  ShoppingCart,
} from "lucide-react";
import logo from "../../assets/logo.png";
import { getCartCount, CART_EVENT_NAME } from "../../services/cartService";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);

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

  useEffect(() => {
    const updateCartCount = () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setCartCount(0);
        return;
      }

      setCartCount(getCartCount());
    };

    updateCartCount();

    window.addEventListener("storage", updateCartCount);
    window.addEventListener("focus", updateCartCount);
    window.addEventListener(CART_EVENT_NAME, updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("focus", updateCartCount);
      window.removeEventListener(CART_EVENT_NAME, updateCartCount);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setCartCount(0);
    window.location.href = "/";
  };

  const closeMenu = () => setMenuOpen(false);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 font-semibold whitespace-nowrap transition ${isActive ? "text-blue-600" : "text-slate-800 hover:text-blue-600"
    }`;

  const simpleLinkClass =
    "flex items-center gap-2 font-semibold text-slate-800 transition hover:text-blue-600";

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-white/95 backdrop-blur transition ${scrolled ? "shadow-md" : "shadow-sm"
        }`}
    >
      <div
        className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${scrolled ? "py-2" : "py-3"
          }`}
      >
        <div className="flex items-center justify-between gap-4">
          <NavLink
            to="/"
            className="flex items-center gap-2"
            onClick={closeMenu}
          >
            <img
              src={logo}
              alt="logo"
              className={`${scrolled ? "h-9" : "h-11"} transition-all`}
            />
            <span className="hidden text-lg font-bold text-blue-600 sm:block">
              AllEventsHub
            </span>
          </NavLink>

          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="rounded border p-2 lg:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>

          <nav className="hidden items-center gap-4 lg:flex">
            {user ? (
              user.role === "admin" ? (
                <>
                  <span className="rounded-full bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">
                    Welcome, Admin
                  </span>

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

                  <button onClick={handleLogout} className={simpleLinkClass}>
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/" className={linkClass}>
                    <Home className="h-4 w-4" /> Home
                  </NavLink>

                  <NavLink to="/cart" className={linkClass}>
                    <ShoppingCart className="h-4 w-4" />
                    Cart ({cartCount})
                  </NavLink>

                  <span className="rounded-full bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">
                    Welcome, {user.name}
                  </span>

                  <NavLink to="/my-bookings" className={linkClass}>
                    <Ticket className="h-4 w-4" /> My Bookings
                  </NavLink>

                  <button onClick={handleLogout} className={simpleLinkClass}>
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </>
              )
            ) : (
              <>
                <NavLink to="/" className={linkClass}>
                  <Home className="h-4 w-4" /> Home
                </NavLink>

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

        {menuOpen && (
          <nav className="mt-4 flex flex-col gap-3 rounded border p-4 shadow lg:hidden">
            {user ? (
              user.role === "admin" ? (
                <>
                  <div className="rounded bg-blue-50 px-4 py-2 font-semibold text-blue-700">
                    Welcome, Admin
                  </div>

                  <NavLink to="/admin" className={linkClass} onClick={closeMenu}>
                    <LayoutDashboard className="h-5 w-5" /> Dashboard
                  </NavLink>

                  <NavLink
                    to="/admin/events"
                    className={linkClass}
                    onClick={closeMenu}
                  >
                    <CalendarDays className="h-5 w-5" /> Events
                  </NavLink>

                  <NavLink
                    to="/admin/users"
                    className={linkClass}
                    onClick={closeMenu}
                  >
                    <Users className="h-5 w-5" /> Users
                  </NavLink>

                  <NavLink
                    to="/admin/bookings"
                    className={linkClass}
                    onClick={closeMenu}
                  >
                    <Ticket className="h-5 w-5" /> Bookings
                  </NavLink>

                  <NavLink
                    to="/admin/analytics"
                    className={linkClass}
                    onClick={closeMenu}
                  >
                    <BarChart3 className="h-5 w-5" /> Analytics
                  </NavLink>

                  <button onClick={handleLogout} className={simpleLinkClass}>
                    <LogOut className="h-5 w-5" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/" className={linkClass} onClick={closeMenu}>
                    <Home className="h-5 w-5" /> Home
                  </NavLink>

                  <NavLink to="/cart" className={linkClass} onClick={closeMenu}>
                    <ShoppingCart className="h-5 w-5" />
                    Cart ({cartCount})
                  </NavLink>

                  <NavLink
                    to="/my-bookings"
                    className={linkClass}
                    onClick={closeMenu}
                  >
                    <Ticket className="h-5 w-5" /> My Bookings
                  </NavLink>

                  <button onClick={handleLogout} className={simpleLinkClass}>
                    <LogOut className="h-5 w-5" /> Logout
                  </button>
                </>
              )
            ) : (
              <>
                <NavLink to="/" className={linkClass} onClick={closeMenu}>
                  <Home className="h-5 w-5" /> Browse Events
                </NavLink>

                <NavLink to="/login" className={linkClass} onClick={closeMenu}>
                  <LogIn className="h-5 w-5" /> Login
                </NavLink>

                <NavLink to="/register" className={linkClass} onClick={closeMenu}>
                  <UserPlus className="h-5 w-5" /> Register
                </NavLink>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}