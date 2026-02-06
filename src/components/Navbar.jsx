"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [logo, setLogo] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const closeMenu = () => setOpen(false);

  /* LOAD LOGO */
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await api("/site-settings", {
          headers: {
            Accept: "application/json",
            "Cache-Control": "no-store",
          },
        });
        if (res?.data?.logo) setLogo(res.data.logo);
      } catch (err) {
        console.error("Failed to load site settings", err);
      }
    }
    loadSettings();
  }, []);

  /* SCROLL ELEVATION */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={`nav-bar ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-container">
          {/* LOGO */}
          <Link href="/" className="nav-logo">
            {logo ? (
              <img src={logo} alt="Excellent JC Autos" />
            ) : (
              <div className="logo-placeholder" />
            )}
          </Link>

          {/* DESKTOP MENU */}
          <nav className="nav-menu">
            <Link href="/" className="nav-active">Home</Link>
            <Link href="/cars">Buy Car</Link>
            <Link href="/sell">Sell & Swap</Link>
            <Link href="/car-loan">Car Loan</Link>
            <Link href="/preorder">Preorder</Link>
            <Link href="/about-us">About Us</Link>
            <Link href="/contact">Contact</Link>
          </nav>

          {/* ACTIONS */}
          <div className="nav-actions">
            <div className="nav-social">
              <a href="https://www.instagram.com/excellent_jc_autos" target="_blank" rel="noreferrer">
                <img src="/insta.png" alt="Instagram" />
              </a>
              <a href="https://www.tiktok.com/@excellent_jc_autos" target="_blank" rel="noreferrer">
                <img src="/tiktok.png" alt="TikTok" />
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noreferrer">
                <img src="/fb.png" alt="Facebook" />
              </a>
            </div>

            <ThemeToggle />

            <button
              className="nav-toggle"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      {open && (
        <div className="nav-mobile-menu">
          {[
            ["/", "Home"],
            ["/cars", "Buy Car"],
            ["/sell", "Sell & Swap"],
            ["/car-loan", "Car Loan"],
            ["/preorder", "Preorder"],
            ["/about-us", "About Us"],
            ["/contact", "Contact"],
          ].map(([href, label]) => (
            <Link key={href} href={href} onClick={closeMenu}>
              {label}
            </Link>
          ))}
        </div>
      )}

      {/* SPACER */}
      <div className="nav-spacer" />

      {/* ================= STYLES ================= */}
     <style jsx>{`
  /* ================= THEME ================= */
  :global(:root) {
    --nav-bg: #ffffff;
    --nav-text: #000000;
    --nav-muted: rgba(0, 0, 0, 0.65);
    --nav-border: rgba(255, 0, 0, 0.5);
  }

  :global([data-theme="dark"]) {
    --nav-bg: #000000;
    --nav-text: #ffffff;
    --nav-muted: rgba(255, 255, 255, 0.7);
    --nav-border: rgba(255, 0, 0, 0.6);
  }

  /* ================= NAVBAR ================= */
  .nav-bar {
    position: sticky;
    top: 12px;
    z-index: 1000;
    background: var(--nav-bg);
    border: 1px solid var(--nav-border);
    border-radius: 16px;
    margin: 0 14px;
    transition: box-shadow 0.25s ease;
  }

  .nav-bar.scrolled {
    box-shadow:
      0 20px 40px rgba(0, 0, 0, 0.18),
      0 0 0 1px rgba(255, 0, 0, 0.25);
  }

  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 10px 20px;
    display: flex;
    align-items: center;
  }

  /* ================= LOGO ================= */
  .nav-logo {
    width: 140px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    background: rgba(0, 0, 0, 0.04);
    border-radius: 12px;
    overflow: hidden;
  }

  :global([data-theme="dark"]) .nav-logo {
    background: rgba(255, 255, 255, 0.06);
  }

  .nav-logo img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
    border-radius: 8px;
  }

  .logo-placeholder {
    width: 140px;
    height: 40px;
  }

  /* Tablet */
  @media (max-width: 900px) {
    .nav-logo,
    .logo-placeholder {
      width: 120px;
      height: 36px;
    }
  }

  /* Mobile */
  @media (max-width: 600px) {
    .nav-logo,
    .logo-placeholder {
      width: 110px;
      height: 32px;
    }
  }

  /* ================= MENU ================= */
  .nav-menu {
    display: flex;
    gap: 22px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .nav-menu a {
    font-size: 14px;
    font-weight: 500;
    color: var(--nav-muted);
    position: relative;
    padding: 6px 2px;
  }

  .nav-menu a::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -6px;
    width: 0%;
    height: 2px;
    background: red;
    transition: width 0.25s ease;
  }

  .nav-menu a:hover {
    color: var(--nav-text);
  }

  .nav-menu a:hover::after,
  .nav-active::after {
    width: 100%;
  }

  /* ================= ACTIONS ================= */
  .nav-actions {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .nav-social {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .nav-social img {
    width: 20px;
    opacity: 0.85;
    transition: transform 0.25s ease, opacity 0.25s ease;
  }

  .nav-social a:hover img {
    opacity: 1;
    transform: translateY(-1px) scale(1.05);
  }

  .nav-toggle {
    display: none;
    background: none;
    border: none;
    font-size: 26px;
    color: var(--nav-text);
  }

  @media (max-width: 900px) {
    .nav-menu {
      display: none;
    }

    .nav-toggle {
      display: block;
    }
  }

  /* ================= MOBILE MENU ================= */
  .nav-mobile-menu {
    position: fixed;
    top: 88px;
    left: 14px;
    right: 14px;
    background: var(--nav-bg);
    border: 1px solid var(--nav-border);
    border-radius: 18px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 18px;
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.35);
    z-index: 999;
  }

  .nav-mobile-menu a {
    font-size: 16px;
    color: var(--nav-text);
  }

  .nav-mobile-menu a:hover {
    color: red;
  }

  /* ================= SPACER ================= */
  .nav-spacer {
    height: 84px;
  }

  @media (max-width: 900px) {
    .nav-spacer {
      height: 72px;
    }
  }

  @media (max-width: 600px) {
    .nav-spacer {
      height: 60px;
    }
  }
`}</style>

    </>
  );
}
