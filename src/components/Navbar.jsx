"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [logo, setLogo] = useState(null);

  const closeMenu = () => setOpen(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await api("/site-settings", {
          headers: {
            Accept: "application/json",
            "Cache-Control": "no-store", // 🚫 NO CACHE (important)
          },
        });

        if (res?.data?.logo) {
          setLogo(res.data.logo);
        }
      } catch (err) {
        console.error("Failed to load site settings", err);
      }
    }

    loadSettings();
  }, []);

  return (
    <>
      <header className="nav-bar">
        <div className="nav-container">
          {/* LOGO → CLICK GOES HOME */}
          <div className="nav-logo">
            <Link href="/">
              {logo ? (
                <img
                  src={logo}
                  alt="Excellent J&C Autos"
                  style={{ height: 40 }}
                />
              ) : (
                <div style={{ height: 40, width: 140 }} />
              )}
            </Link>
          </div>

          {/* DESKTOP MENU */}
          <nav className="nav-menu">
            <Link href="/" className="nav-active">Home</Link>
            <Link href="/cars">Pick your Car</Link>
            <Link href="/sell">Sell & Swap</Link>
            <Link href="/car-loan">Car Loan</Link>
            <Link href="/Preorder">Preorder</Link>
            <Link href="/about-us">About Us</Link>
            <Link href="/contact">Contact Us</Link>
          </nav>

          {/* ACTIONS */}
          <div className="nav-actions">
            <div className="nav-social">
              <a
                href="https://www.instagram.com/excellent_jc_autos?igsh=MTgzdm5zZXd2OTkyOA=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <img src="/insta.png" alt="Instagram" width={26} />
              </a>

              <a
                href="https://www.tiktok.com/@excellent_jc_autos?_r=1&_t=ZS-93GlXI9njux"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
              >
                <img src="/tiktok.png" alt="TikTok" width={26} />
              </a>

              <a
                href="https://www.facebook.com/share/1KnY1KSKRQ/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <img src="/fb.png" alt="Facebook" width={26} />
              </a>
            </div>

            <button className="nav-toggle" onClick={() => setOpen(!open)}>
              ☰
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      {open && (
        <div className="nav-mobile-menu">
          <Link href="/" onClick={closeMenu}>Home</Link>
          <Link href="/cars" onClick={closeMenu}>Cars</Link>
          <Link href="/sell" onClick={closeMenu}>Sell & Swap</Link>
          <Link href="/car-loan" onClick={closeMenu}>Car Loan</Link>
          <Link href="/Preorder" onClick={closeMenu}>Preorder</Link>
          <Link href="/about-us" onClick={closeMenu}>About Us</Link>
          <Link href="/contact" onClick={closeMenu}>Contact Us</Link>
        </div>
      )}

      <div className="nav-spacer" />
    </>
  );
}
