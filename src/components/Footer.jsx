"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function Footer() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await api("/site-settings", {
          headers: {
            Accept: "application/json",
            "Cache-Control": "no-store",
          },
        });

        if (res?.data) setSettings(res.data);
      } catch (err) {
        console.error("Failed to load site settings", err);
      }
    }

    loadSettings();
  }, []);

  return (
    <>
      <footer className="footer">
        {/* ================= MAIN FOOTER ================= */}
        <div className="container">
          <div className="footer-grid">
            {/* BRAND */}
            <div className="footer-brand">
              {settings?.logo && (
                <img
                  src={settings.logo}
                  alt={settings.site_name || "Site Logo"}
                  className="footer-logo"
                />
              )}

              <p className="footer-tagline">
                Premium vehicles. Transparent pricing. Exceptional service.
              </p>
            </div>

            {/* LINKS */}
            <div className="footer-group">
              <h4 className="footer-title">Explore</h4>
              <Link href="/cars">Browse Cars</Link>
              <Link href="/sell">Sell Your Car</Link>
              <Link href="/car-loan">Car Loans</Link>
              <Link href="/preorder">Preorder</Link>
            </div>

            {/* CONTACT */}
            <div className="footer-group">
              <h4 className="footer-title">Contact</h4>
              <span>{settings?.address || "Abuja, Nigeria"}</span>
              {settings?.support_phone && (
                <span>Support: {settings.support_phone}</span>
              )}
              {settings?.admin_email && (
                <span>{settings.admin_email}</span>
              )}
            </div>

            {/* SOCIAL */}
            <div className="footer-group">
              <h4 className="footer-title">Follow Us</h4>
              <div className="footer-social">
                <a
                  href="https://www.instagram.com/excellent_jc_autos"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <img src="/insta.png" alt="" />
                </a>
                <a
                  href="https://www.tiktok.com/@excellent_jc_autos"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                >
                  <img src="/tiktok.png" alt="" />
                </a>
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <img src="/fb.png" alt="" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ================= FOOTER BOTTOM ================= */}
        <div className="footer-bottom">
          <div className="container footer-bottom-inner">
            <div className="legal-links">
              <Link href="/privacy">Privacy Policy</Link>
              <span>•</span>
              <Link href="/terms">Terms of Service</Link>
            </div>

            <span className="copyright">
              © {new Date().getFullYear()}{" "}
              {settings?.site_name || "Excellent JC Autos"}
            </span>
          </div>
        </div>
      </footer>

      {/* ================= STYLES ================= */}
      <style jsx>{`
        /* ================= THEME RULE ================= */
        :global(:root) {
          --footer-bg: #ffffff;
          --footer-text: #000000;
          --footer-muted: rgba(0, 0, 0, 0.7);
          --footer-soft: rgba(0, 0, 0, 0.55);
          --footer-border: rgba(0, 0, 0, 0.12);
        }

        :global([data-theme="dark"]) {
          --footer-bg: #000000;
          --footer-text: #ffffff;
          --footer-muted: rgba(255, 255, 255, 0.75);
          --footer-soft: rgba(255, 255, 255, 0.55);
          --footer-border: rgba(255, 255, 255, 0.15);
        }

        /* ================= FOOTER BASE ================= */
        .footer {
          background: var(--footer-bg);
          color: var(--footer-text);
          position: relative;
        }

        /* Accent glow line */
        .footer::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent,
            red,
            transparent
          );
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* ================= GRID ================= */
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 40px;
          padding: 80px 0 60px;
        }

        /* ================= BRAND ================= */
        .footer-logo {
          height: 44px;
          margin-bottom: 16px;
        }

        .footer-tagline {
          font-size: 14px;
          color: var(--footer-soft);
          max-width: 280px;
          line-height: 1.6;
        }

        /* ================= GROUP ================= */
        .footer-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
          font-size: 14px;
          color: var(--footer-muted);
        }

        .footer-title {
          font-size: 15px;
          font-weight: 700;
          color: var(--footer-text);
          margin-bottom: 6px;
          letter-spacing: 0.2px;
        }

        .footer-group a {
          color: var(--footer-muted);
          transition: color 0.2s ease, transform 0.2s ease;
        }

        .footer-group a:hover {
          color: red;
          transform: translateX(2px);
        }

        /* ================= SOCIAL ================= */
        .footer-social {
          display: flex;
          gap: 12px;
        }

        .footer-social a {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          border: 1px solid var(--footer-border);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .footer-social a:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(255, 0, 0, 0.35);
        }

        .footer-social img {
          width: 18px;
        }

        /* ================= BOTTOM ================= */
        .footer-bottom {
          border-top: 1px solid var(--footer-border);
          padding: 22px 0;
        }

        .footer-bottom-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          color: var(--footer-soft);
          gap: 12px;
        }

        .legal-links {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .legal-links a {
          color: var(--footer-muted);
        }

        .legal-links a:hover {
          color: red;
        }

        /* ================= RESPONSIVE ================= */
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .footer-bottom-inner {
            flex-direction: column;
          }

          .footer-social {
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
}
