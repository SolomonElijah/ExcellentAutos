"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/api";
import { MessageCircle } from "lucide-react";

export default function SellContact({ car, onClose }) {
  if (!car) return null;

  const [whatsappNumber, setWhatsappNumber] = useState("");

  /* =========================
     NORMALIZE WHATSAPP NUMBER
     (NEVER ADDS 234 TWICE)
  ========================= */
  function normalizeWhatsappNumber(input) {
    if (!input) return "";

    // remove +, spaces, dashes, etc.
    let number = input.replace(/\D/g, "");

    // already correct
    if (number.startsWith("234")) return number;

    // local Nigerian number
    if (number.startsWith("0")) {
      return "234" + number.slice(1);
    }

    return number;
  }

  /* =========================
     LOAD WHATSAPP FROM API
  ========================= */
  useEffect(() => {
    async function loadWhatsapp() {
      try {
        const res = await fetch(
          "https://system.excellentautosnigeria.com/api/site-settings"
        );
        const json = await res.json();

        const raw = json?.data?.admin_whatsapp;
        const normalized = normalizeWhatsappNumber(raw);

        setWhatsappNumber(normalized);
      } catch (err) {
        console.error("Failed to load WhatsApp number", err);
      }
    }

    loadWhatsapp();
  }, []);

  // API base for images (unchanged)
  const baseUrl = API_BASE_URL.replace("/api", "");

  // current site
  const siteOrigin =
    typeof window !== "undefined" ? window.location.origin : "";

  // WhatsApp message (UNCHANGED)
  const message = `Hi Excellent J&C Autos,
I am interested in this car:

${car.brand.name} ${car.model} (${car.year})
Ref: ${car.reference_code}
Price: ₦${Number(car.price).toLocaleString()}
Location: ${car.location}

View car: ${siteOrigin}/cars/${car.id}`;

  // do not render button until number is ready
  if (!whatsappNumber) return null;

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <div className="overlay">
      <div className="box">
        {/* CLOSE */}
        <button className="close" onClick={onClose}>×</button>

        {/* HEADER */}
        <h3 className="title">Contact</h3>
        <p className="company">Excellent J&C Autos</p>

        {/* CAR IMAGE */}
        <img
          src={`${baseUrl}${car.featured_image}`}
          alt={car.model}
          className="carImg"
        />

        {/* CAR DETAILS */}
        <div className="carInfo">
          <p className="carName">
            {car.brand.name} {car.model} ({car.year})
          </p>
          <p className="price">
            ₦{Number(car.price).toLocaleString()}
          </p>
          <p className="location">{car.location}</p>
        </div>

        {/* ACTION */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp"
        >
          <MessageCircle size={18} />
  <span>Start WhatsApp Chat</span>
        </a>

        <p className="note">
          You’ll be redirected to WhatsApp to chat with our sales team.
        </p>

        <p className="agreement">
          By contacting the seller, you agree that your contact details may be
          shared with the seller.
        </p>
      </div>

      {/* STYLES — COMPLETELY UNCHANGED */}
      <style>{`
        :root {
  --modal-bg: #ffffff;
  --modal-text: #111827;
  --modal-border: #e5e7eb;
  --muted: #6b7280;
  --overlay: rgba(0,0,0,.6);
  --whatsapp: #25d366;
}

[data-theme="dark"] {
  --modal-bg: #000000;
  --modal-text: #ffffff;
  --modal-border: #111;
  --muted: #9ca3af;
  --overlay: rgba(0,0,0,.75);
}

/* ================= OVERLAY ================= */
.overlay {
  position: fixed;
  inset: 0;
  background: var(--overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

/* ================= MODAL ================= */
.box {
  background: var(--modal-bg);
  color: var(--modal-text);
  width: 360px;
  padding: 22px;
  border-radius: 14px;
  position: relative;
  border: 1px solid var(--modal-border);
}

/* ================= CLOSE ================= */
.close {
  position: absolute;
  top: 10px;
  right: 12px;
  background: none;
  border: none;
  color: var(--modal-text);
  font-size: 22px;
  cursor: pointer;
}

/* ================= HEADER ================= */
.title {
  margin: 0;
  font-size: 16px;
}

.company {
  color: red;
  font-size: 13px;
  margin-bottom: 12px;
}

/* ================= IMAGE ================= */
.carImg {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 12px;
  background: #111;
}

/* ================= INFO ================= */
.carInfo {
  margin-bottom: 16px;
}

.carName {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
}

.price {
  font-size: 13px;
  margin: 6px 0;
}

.location {
  font-size: 11px;
  color: var(--muted);
}

/* ================= WHATSAPP BUTTON ================= */
.whatsapp {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  background: var(--whatsapp);
  color: #fff;
  text-align: center;
  padding: 12px;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  margin-bottom: 10px;

  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.whatsapp:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 28px rgba(37, 211, 102, 0.35);
}

/* ================= FOOTER ================= */
.note {
  font-size: 11px;
  color: var(--muted);
  text-align: center;
  margin-bottom: 6px;
}

.agreement {
  font-size: 11px;
  color: #777;
  text-align: center;
}

      `}</style>
    </div>
  );
}
