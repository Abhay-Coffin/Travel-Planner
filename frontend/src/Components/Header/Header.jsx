import React, { useContext, useEffect, useRef, useState } from "react";
import { Container, Button } from "reactstrap";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { AuthContext } from "../../context/AuthContext.jsx";
import { ThemeContext } from "../../context/ThemeContext.jsx";

import "./header.css";

const logo = "https://cdn-icons-png.flaticon.com/512/201/201623.png";

// Top-level links shown in the desktop bar (kept minimal on purpose)
const nav__links = [
  { path: "/", display: "Home" },
  { path: "/tours", display: "Tours" },
  { path: "/blogs", display: "Blogs" },
  { path: "/about", display: "About" },
];

// Secondary links surfaced in the avatar dropdown + mobile menu
const account__links = [
  { path: "/my-bookings", display: "My Bookings", icon: "ri-ticket-2-line" },
  { path: "/saved-itineraries", display: "Saved Trips", icon: "ri-bookmark-line" },
  { path: "/wishlist", display: "Wishlist", icon: "ri-heart-line" },
  { path: "/admin", display: "Admin", icon: "ri-shield-user-line" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [sticky, setSticky] = useState(false);

  const accountRef = useRef(null);

  const { user, dispatch } = useContext(AuthContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  const navigate = useNavigate();

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    setIsAccountOpen(false);
    setIsMenuOpen(false);
    navigate("/");
  };

  // Sticky on scroll
  useEffect(() => {
    const handleScroll = () => setSticky(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click / Escape
  useEffect(() => {
    const onClick = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setIsAccountOpen(false);
      }
    };
    const onKey = (e) => e.key === "Escape" && setIsAccountOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // Lock scroll when mobile sheet is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const initials = (user?.username || "TW").slice(0, 2).toUpperCase();

  return (
    <motion.header
      className={`tw-header ${sticky ? "tw-header--sticky" : ""}`}
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Container>
        <div className="tw-nav">
          {/* Brand */}
          <Link to="/" className="tw-brand" aria-label="Travel World — Home">
            <span className="tw-brand__badge">
              <img src={logo} alt="" />
            </span>
            <span className="tw-brand__text">Travel World</span>
          </Link>

          {/* Desktop links */}
          <nav className="tw-links" aria-label="Primary">
            {nav__links.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `tw-link ${isActive ? "tw-link--active" : ""}`
                }
              >
                {item.display}
              </NavLink>
            ))}
          </nav>

          {/* Right cluster */}
          <div className="tw-actions">
            {/* AI Planner CTA */}
            <Link to="/ai-planner" className="tw-cta">
              <i className="ri-sparkling-2-line"></i>
              <span>AI Planner</span>
            </Link>

            {/* Theme toggle */}
            <button
              type="button"
              className="tw-icon-btn"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              aria-pressed={darkMode}
            >
              <i className={darkMode ? "ri-sun-line" : "ri-moon-line"}></i>
            </button>

            {/* Account (desktop) */}
            {user ? (
              <div className="tw-account" ref={accountRef}>
                <Link
                  to="/profile"
                  className="tw-account__profile"
                  aria-label="Open your profile"
                >
                  <span className="tw-avatar">{initials}</span>
                  <span className="tw-account__name">{user.username}</span>
                </Link>
                <button
                  type="button"
                  className="tw-account__chevron"
                  aria-label="Account menu"
                  aria-expanded={isAccountOpen}
                  onClick={() => setIsAccountOpen((v) => !v)}
                >
                  <i className="ri-arrow-down-s-line"></i>
                </button>

                {isAccountOpen && (
                  <div className="tw-menu" role="menu">
                    <div className="tw-menu__head">
                      <div className="tw-menu__name">{user.username}</div>
                      {user.email && (
                        <div className="tw-menu__email">{user.email}</div>
                      )}
                    </div>
                    <div className="tw-menu__sep" />
                    <Link
                      to="/profile"
                      className="tw-menu__item"
                      onClick={() => setIsAccountOpen(false)}
                    >
                      <i className="ri-user-line"></i> Profile
                    </Link>
                    {account__links.map((l) => (
                      <Link
                        key={l.path}
                        to={l.path}
                        className="tw-menu__item"
                        onClick={() => setIsAccountOpen(false)}
                      >
                        <i className={l.icon}></i> {l.display}
                      </Link>
                    ))}
                    <div className="tw-menu__sep" />
                    <button
                      type="button"
                      className="tw-menu__item tw-menu__item--danger"
                      onClick={logout}
                    >
                      <i className="ri-logout-box-r-line"></i> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="tw-auth">
                <Button tag={Link} to="/login" className="tw-btn-ghost">
                  Login
                </Button>
                <Button tag={Link} to="/register" className="tw-btn-primary">
                  Register
                </Button>
              </div>
            )}

            {/* Mobile trigger */}
            <button
              type="button"
              className="tw-icon-btn tw-mobile-trigger"
              aria-label="Open menu"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen(true)}
            >
              <i className="ri-menu-line"></i>
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile sheet */}
      {isMenuOpen && (
        <div className="tw-sheet" role="dialog" aria-modal="true">
          <div
            className="tw-sheet__backdrop"
            onClick={() => setIsMenuOpen(false)}
          />
          <motion.aside
            className="tw-sheet__panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
          >
            <div className="tw-sheet__head">
              <Link
                to="/"
                className="tw-brand"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="tw-brand__badge">
                  <img src={logo} alt="" />
                </span>
                <span className="tw-brand__text">Travel World</span>
              </Link>
              <button
                type="button"
                className="tw-icon-btn"
                aria-label="Close menu"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="ri-close-line"></i>
              </button>
            </div>

            <div className="tw-sheet__body">
              {user ? (
                <Link
                  to="/profile"
                  className="tw-sheet__profile"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="tw-avatar tw-avatar--lg">{initials}</span>
                  <span>
                    <span className="tw-sheet__profile-name">
                      {user.username}
                    </span>
                    <span className="tw-sheet__profile-sub">View profile</span>
                  </span>
                </Link>
              ) : (
                <div className="tw-sheet__auth">
                  <Button
                    tag={Link}
                    to="/login"
                    className="tw-btn-ghost w-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Button>
                  <Button
                    tag={Link}
                    to="/register"
                    className="tw-btn-primary w-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Button>
                </div>
              )}

              <p className="tw-sheet__label">Browse</p>
              <ul className="tw-sheet__list">
                {nav__links.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      end={item.path === "/"}
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        `tw-sheet__item ${isActive ? "tw-sheet__item--active" : ""}`
                      }
                    >
                      {item.display}
                    </NavLink>
                  </li>
                ))}
                <li>
                  <NavLink
                    to="/ai-planner"
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `tw-sheet__item ${isActive ? "tw-sheet__item--active" : ""}`
                    }
                  >
                    <i className="ri-sparkling-2-line"></i> AI Planner
                  </NavLink>
                </li>
              </ul>

              {user && (
                <>
                  <p className="tw-sheet__label">Account</p>
                  <ul className="tw-sheet__list">
                    {account__links.map((l) => (
                      <li key={l.path}>
                        <NavLink
                          to={l.path}
                          onClick={() => setIsMenuOpen(false)}
                          className={({ isActive }) =>
                            `tw-sheet__item ${isActive ? "tw-sheet__item--active" : ""}`
                          }
                        >
                          <i className={l.icon}></i> {l.display}
                        </NavLink>
                      </li>
                    ))}
                    <li>
                      <button
                        type="button"
                        className="tw-sheet__item tw-sheet__item--danger"
                        onClick={logout}
                      >
                        <i className="ri-logout-box-r-line"></i> Sign out
                      </button>
                    </li>
                  </ul>
                </>
              )}

              <div className="tw-sheet__footer">
                <span>Theme</span>
                <button
                  type="button"
                  className="tw-icon-btn"
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                >
                  <i className={darkMode ? "ri-sun-line" : "ri-moon-line"}></i>
                </button>
              </div>
            </div>
          </motion.aside>
        </div>
      )}
    </motion.header>
  );
};

export default Header;
