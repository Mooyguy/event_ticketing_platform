import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
  Search,
  MapPin,
} from "lucide-react";
import logo from "../../assets/logo.png";
import { getCartCount, CART_EVENT_NAME } from "../../services/cartService";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [navSearch, setNavSearch] = useState("");
  const [navCity, setNavCity] = useState("All Cities");

  const navigate = useNavigate();

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

  const handleNavSearchSubmit = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (navSearch.trim()) params.set("q", navSearch.trim());
    if (navCity !== "All Cities") params.set("city", navCity);

    navigate(`/?${params.toString()}`);
    closeMenu();
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 font-semibold whitespace-nowrap transition ${isActive ? "text-blue-600" : "text-slate-800 hover:text-blue-600"
    }`;

  const simpleLinkClass =
    "flex items-center gap-2 font-semibold text-slate-800 transition hover:text-blue-600";

  const showSearchBar = !user || user.role !== "admin";
  const isAdmin = user?.role === "admin";

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
            className="flex shrink-0 items-center gap-2"
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

          {showSearchBar && (
            <form
              onSubmit={handleNavSearchSubmit}
              className="hidden flex-1 items-center justify-center px-4 lg:flex"
            >
              <div className="flex w-full max-w-3xl items-center overflow-hidden rounded-full border border-slate-300 bg-slate-50 shadow-sm">
                <div className="flex flex-1 items-center gap-2 px-4 py-3">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={navSearch}
                    onChange={(e) => setNavSearch(e.target.value)}
                    placeholder="Search events"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                  />
                </div>

                <div className="hidden h-6 w-px bg-slate-300 md:block" />

                <div className="flex items-center gap-2 px-4 py-3">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <select
                    value={navCity}
                    onChange={(e) => setNavCity(e.target.value)}
                    className="bg-transparent text-sm outline-none"
                  >
                    <option>All Cities</option>
                    <option>Winnipeg</option>
                    <option>Toronto</option>
                    <option>Calgary</option>
                    <option>Vancouver</option>
                    <option>Montreal</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700"
                  aria-label="Search"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}

          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="rounded border p-2 lg:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>

          <nav className="hidden items-center gap-5 lg:flex">
            {user ? (
              isAdmin ? (
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
                  <NavLink to="/admin/merchandise" className={linkClass}>
                    Merchandise
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
          <div className="mt-4 rounded border p-4 shadow lg:hidden">
            {showSearchBar && (
              <form onSubmit={handleNavSearchSubmit} className="mb-4 space-y-3">
                <div className="flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-3">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={navSearch}
                    onChange={(e) => setNavSearch(e.target.value)}
                    placeholder="Search events"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                  />
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-3">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <select
                    value={navCity}
                    onChange={(e) => setNavCity(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none"
                  >
                    <option>All Cities</option>
                    <option>Winnipeg</option>
                    <option>Toronto</option>
                    <option>Calgary</option>
                    <option>Vancouver</option>
                    <option>Montreal</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  Search
                </button>
              </form>
            )}

            <nav className="flex flex-col gap-3">
              {user ? (
                isAdmin ? (
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
                    <div className="rounded bg-blue-50 px-4 py-2 font-semibold text-blue-700">
                      Welcome, {user.name}
                    </div>

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
                    <Home className="h-5 w-5" /> Home
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
          </div>
        )}
      </div>
    </header>
  );
}