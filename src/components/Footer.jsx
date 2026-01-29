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

        if (res?.data) {
          setSettings(res.data);
        }
      } catch (err) {
        console.error("Failed to load site settings", err);
      }
    }

    loadSettings();
  }, []);

  return (
    <footer className="footer">
      {/* ================= MAIN FOOTER ================= */}
      <div className="container">
        <div className="footer-main">
          {/* ABOUT */}
          <div className="footer-about">
            {settings?.logo && (
              <img
                src={settings.logo}
                alt={settings.site_name || "Site Logo"}
                style={{ height: 45 }}
              />
            )}

            <p className="footer-tagline">
              Premium vehicles. Transparent pricing. Exceptional service.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="footer-title">Quick Links</h4>
            <div className="footer-links">
              <Link href="/cars">Browse Cars</Link>
              <Link href="/sell">Sell Your Car</Link>
              <Link href="/car-loan">Get Car Loan</Link>
              <Link href="/Preorder">Preorder</Link>
              <Link href="/contact">Contact Us</Link>
            </div>
          </div>

          {/* CONTACT INFO (FROM API) */}
          <div>
            <h4 className="footer-title">Contact Info</h4>
            <div className="contact-details">
              <div className="contact-item">
                📍 {settings?.address || "Abuja, Nigeria"}
              </div>

              {settings?.support_phone && (
                <div className="contact-item">
                  📱 Support {settings.support_phone}
                </div>
              )}

              {settings?.admin_email && (
                <div className="contact-item">
                  ✉️ {settings.admin_email}
                </div>
              )}
            </div>
          </div>

          {/* SOCIAL */}
          <div className="footer-social">
            <h4 className="footer-title">Follow Us</h4>
            <div className="social-icons">
              <a href="#" className="social-btn">
                <img src="/insta.png" alt="Instagram" width={18} />
              </a>
              <a href="#" className="social-btn">
                <img src="/tiktok.png" alt="TikTok" width={18} />
              </a>
              <a href="#" className="social-btn">
                <img src="/fb.png" alt="Facebook" width={18} />
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
            <span>|</span>
            <Link href="/terms">Terms of Service</Link>
          </div>

          <span className="copyright">
            © {new Date().getFullYear()}{" "}
            {settings?.site_name || "Excellent JC Autos"}. All Rights Reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
