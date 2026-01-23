"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);


  return (
    <>
      <header className="navbar">
        <div className="container">
          {/* Logo */}
          <div className="logo">
            <Image
              src="/logo.png"
              alt="Excellent JC Autos"
              width={140}
              height={40}
              priority
            />
          </div>

          {/* Desktop Menu */}
          <nav className="menu">
            <Link href="/" className="active">Home</Link>
            <Link href="/cars">Cars</Link>
            <Link href="/sell">Sell & Swap</Link>
            <Link href="/Preorder">Preorder</Link>
            <Link href="/about-us">About Us</Link>
            <Link href="/contact">Contact Us</Link>
          </nav>

          {/* RIGHT SIDE (SOCIAL + TOGGLE) */}
          <div className="actions">
            <div className="social">
              <a href="https://www.instagram.com/excellent_jc_autos?igsh=MTgzdm5zZXd2OTkyOA==" target="_blank" rel="noopener noreferrer">
                <Image src="/insta.png" alt="Facebook" width={26} height={26} />
              </a>

              <a href="https://www.tiktok.com/@excellent_jc_autos?_r=1&_t=ZS-93GlXI9njux" target="_blank" rel="noopener noreferrer">
                <Image src="/tiktok.png" alt="Telegram" width={26} height={26} />
              </a>

              <a href="https://www.facebook.com/share/1KnY1KSKRQ/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">
                <Image src="/fb.png" alt="X" width={26} height={26} />
              </a>
            </div>

            <button className="toggle" onClick={() => setOpen(!open)}>
              ☰
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {open && (
        <div className="mobileMenu">
          <Link href="/" onClick={closeMenu}>Home</Link>
          <Link href="/cars" onClick={closeMenu}>Cars</Link>
          <Link href="/sell" onClick={closeMenu}>Sell & Swap Car</Link>
          <Link href="/Preorder" onClick={closeMenu}>Pre Order</Link>
          <Link href="/about-us" onClick={closeMenu}>About Us</Link>
          <Link href="/contact" onClick={closeMenu}>Contact Us</Link>
        </div>
      )}


      <div className="spacer" />

      <style >{`
        .navbar {
          position: fixed;
          top: 0;
          width: 100%;
          background: #000;
          border-bottom: 1px solid red;
          z-index: 1000;
        }

       .container {
  display: flex;
  align-items: center;
  padding: 14px 24px;
}


        .logo {
          color: #fff;
          font-weight: bold;
          font-size: 16px;
        }

        .menu {
  display: flex;
  gap: 18px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

        .menu a {
          color: #ddd;
          text-decoration: none;
          font-size: 14px;
        }

        .menu a:hover,
        .active {
          color: red;
        }

        /* RIGHT SIDE */
        .actions {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-left: auto; /* 🔥 PUSHES TO RIGHT */
        }

        .social {
          display: flex;
          gap: 12px;
        }

        .social a {
          display: inline-flex;
        }

        .toggle {
          display: none;
          background: none;
          border: none;
          color: #fff;
          font-size: 22px;
          cursor: pointer;
        }

        /* Mobile */
        @media (max-width: 900px) {
          .menu {
            display: none;
          }

          .toggle {
            display: block;
          }
        }

        .mobileMenu {
          position: fixed;
          top: 64px;
          width: 100%;
          background: #000;
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 16px;
          z-index: 999;
        }

        .mobileMenu a {
          color: #fff;
          text-decoration: none;
          font-size: 15px;
        }

        .spacer {
          height: 64px;
        }
      `}</style>
    </>
  );
}
