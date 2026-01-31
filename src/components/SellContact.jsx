"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/api";

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
          Start WhatsApp Chat
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
        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,.75);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
        }

        .box {
          background: #000;
          color: #fff;
          width: 360px;
          padding: 22px;
          border-radius: 14px;
          position: relative;
          border: 1px solid #111;
        }

        .close {
          position: absolute;
          top: 10px;
          right: 12px;
          background: none;
          border: none;
          color: #fff;
          font-size: 22px;
          cursor: pointer;
        }

        .title {
          margin: 0;
          font-size: 16px;
        }

        .company {
          color: red;
          font-size: 13px;
          margin-bottom: 12px;
        }

        .carImg {
          width: 100%;
          height: 160px;
          object-fit: cover;
          border-radius: 10px;
          margin-bottom: 12px;
          background: #111;
        }

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
          color: #aaa;
        }

        .whatsapp {
          display: block;
          background: red;
          color: #fff;
          text-align: center;
          padding: 12px;
          border-radius: 10px;
          font-weight: 600;
          text-decoration: none;
          margin-bottom: 10px;
        }

        .note {
          font-size: 11px;
          color: #aaa;
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
