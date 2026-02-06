"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { api, API_BASE_URL } from "@/lib/api";
import SellContact from "@/components/SellContact";

export default function CarDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [car, setCar] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [showContact, setShowContact] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    async function loadCar() {
      try {
        const res = await api(`/cars/${id}`);
        const found = res.data;

        setCar(found);

        const previewImg = searchParams.get("img");
        setActiveImage(previewImg || found.featured_image);

        const allImages = [
          found.featured_image,
          ...(found.images || []).map(i => i.url),
        ];

        const initialIndex = allImages.findIndex(
          img => img === (previewImg || found.featured_image)
        );

        setCurrentImageIndex(initialIndex >= 0 ? initialIndex : 0);
      } catch (err) {
        console.error("Failed to load car details", err);
      }
    }

    loadCar();
  }, [id, searchParams]);

  const baseUrl = API_BASE_URL.replace("/api", "");

  /* ================= SKELETON ================= */
  if (!car) {
    return (
      <>
        <div className="page">
          <div className="skel skel-title" />
          <div className="skel skel-subtitle" />

          <div className="top">
            <div className="skel skel-image" />
            <div>
              <div className="skel skel-card" />
              <div className="skel skel-card" />
              <div className="skel skel-card" />
            </div>
          </div>

          <div className="priceRow">
            <div className="skel skel-price" />
            <div className="skel skel-price" />
          </div>

          <div className="actions">
            <div className="skel skel-btn" />
            <div className="skel skel-btn" />
          </div>
        </div>

        <style>{`
          .page { background:#000; color:#fff; padding:30px; }

          .skel {
            background: linear-gradient(
              90deg,
              #111 25%,
              #1a1a1a 37%,
              #111 63%
            );
            background-size: 400% 100%;
            animation: shimmer 1.4s infinite;
            border-radius: 8px;
          }

          .skel-title { height:28px; width:60%; margin-bottom:10px; }
          .skel-subtitle { height:14px; width:40%; margin-bottom:24px; }

          .skel-image {
            width:100%;
            aspect-ratio:16/9;
            border-radius:14px;
          }

          .skel-card {
            height:80px;
            margin-top:16px;
            border-radius:10px;
          }

          .skel-price {
            height:26px;
            width:160px;
          }

          .skel-btn {
            height:44px;
            flex:1;
            border-radius:8px;
          }

          @keyframes shimmer {
            0% { background-position: 100% 0; }
            100% { background-position: 0 0; }
          }
        `}</style>
      </>
    );
  }

  /* ================= FEATURE CALCULATIONS ================= */
  // FEATURE #3 & #4: Loan conditionals - EXACT SAME PATTERN AS FEATURED CARS PAGE
  const hasLoan = car.loan?.available === true;

  const loanData = car.loan?.precomputed ?? null;

  const firstTenure = loanData?.tenures
    ? loanData.tenures[Object.keys(loanData.tenures)[0]]
    : null;

  // FEATURE #6: Image navigation data
  const allCarImages = [car.featured_image, ...(car.images || []).map(i => i.url)].filter(Boolean);
  const uniqueImages = [...new Set(allCarImages)];

  // FEATURE #6: Navigation functions
  const navigateImage = (direction) => {
    const newIndex = direction === 'next'
      ? (currentImageIndex + 1) % uniqueImages.length
      : (currentImageIndex - 1 + uniqueImages.length) % uniqueImages.length;

    setCurrentImageIndex(newIndex);
    setActiveImage(uniqueImages[newIndex]);
  };

  const thumbnails = (car.images || [])
    .map((i) => i.url)
    .filter((u) => u && u !== activeImage);

  return (
    <>
      <div className="page">

        {/* TITLE - FEATURE #1: Rating Badge */}
        <div className="titleRow">
          <h3>
            {car.brand.name} {car.model} – {car.year}
            {car.is_verified && <span className="verified">✔ Verified</span>}
            {/* FEATURE #1: Rating Badge (static for now - API doesn't have rating field) */}
            <span className="ratingBadge">⭐ 3.0</span>
          </h3>
          <p className="subtitle">
            {car.condition.replace("_", " ")} · {car.mileage} KM ·{" "}
            {car.engine_specs || "—"} · {car.transmission}
          </p>
        </div>

        {/* GALLERY + INFO */}
        <div className="top">
          <div className="gallery">
            <div className="mainImage">
              {/* FEATURE #5: Image Size Control */}
             <img
  src={`${baseUrl}${activeImage}`}
  alt={car.model}
  className="mainImg"
/>

              {/* FEATURE #2: Loan Availability Tag - EXACT SAME AS FEATURED CARS */}
              {hasLoan && (
                <span className="loanTag">Car Loan Available</span>
              )}

              {/* FEATURE #6: Image Navigation (LEFT/RIGHT) */}
              {uniqueImages.length > 1 && (
                <>
                  <button
                    className="navArrow left"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateImage('prev');
                    }}
                  >
                    ‹
                  </button>
                  <button
                    className="navArrow right"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateImage('next');
                    }}
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {thumbnails.length > 0 && (
              <div className="thumbs">
                {thumbnails.map((img, i) => (
                  <img
                    key={i}
                    src={`${baseUrl}${img}`}
                    className="thumb"
                    onClick={() => {
                      const index = uniqueImages.findIndex(u => u === img);
                      if (index >= 0) setCurrentImageIndex(index);
                      setActiveImage(img);
                    }}
                    alt=""
                  />
                ))}
              </div>
            )}
          </div>

          {/* FEATURE #7: Hide Static Info Cards on Mobile */}
          <div className="infoPanel">
            <div className="infoCard dark">
              <h4>Verified Cars</h4>
              <p>
                Every listed vehicle undergoes a strict verification process to ensure
                reliability and transparency. Our experts inspect mechanical condition,
                exterior and interior quality, ownership documents, service records,
                and accident history. This process helps buyers make confident decisions,
                reduces risk, and guarantees that only genuine, roadworthy cars appear on our platform safely.
              </p>
            </div>

            <div className="infoCard light">
              <h4>Dedicated Support Team</h4>
              <p>
                Our dedicated support team is made up of trained professionals who understand the buying process in detail.
                They provide timely assistance, answer questions clearly, resolve issues quickly, and offer guidance from first inquiry to final delivery,
                ensuring a smooth, stress-free experience for every customer across all communication channels and touchpoints.
              </p>
            </div>

            <div className="infoCard yellow">
              <h4>Great Maintenance Contract</h4>
              <p>
                Our maintenance contract connects customers with trusted, professional service
                partners for dependable after-sales care. It covers routine servicing, inspections,
                and timely repairs, helping vehicles remain in excellent condition.
                This partnership reduces ownership stress,
                controls maintenance costs, and ensures long-term performance, safety,
                and value throughout the vehicle’s lifespan for every owner.
              </p>
            </div>
          </div>
        </div>

        {/* PRICE + ACTIONS */}
        <div className="priceRow">
          <div>
            <p className="price">₦{Number(car.price).toLocaleString()}</p>
            <small>{car.location}</small>
          </div>

          {/* FEATURE #3: Conditional Loan Section - EXACT SAME AS FEATURED CARS */}
          {hasLoan && loanData && firstTenure ? (
            <div>
              <p className="monthly">
                ₦{Number(firstTenure.monthly_payment).toLocaleString()} / Mo
              </p>
              <small>{loanData.down_payment_percent}% Down payment</small>
            </div>
          ) : hasLoan ? (
            <small className="noCalc">
              Loan available – calculation shown on application
            </small>
          ) : null}

        </div>

        {/* ACTIONS - EXACT SAME PATTERN AS FEATURED CARS */}
        <div className="actions">
          <button className="outline" onClick={() => setShowContact(true)}>
            Contact Seller
          </button>

          {/* FEATURE #4: Conditional "Apply for Loan" Button - EXACT SAME AS FEATURED CARS */}
          {hasLoan && (
            <button
              className="solid"
              onClick={() => router.push(`/cars/${car.id}/loan`)}
            >
              Apply For Loan
            </button>
          )}
        </div>

        {/* SPECS */}
        <div className="specFeatureGrid">

          <div className="specs card">
            <h3 className="sectionTitle">Car Specs</h3>
            <table>
              <tbody>
                <tr><td>Brand</td><td>{car.brand?.name}</td></tr>
                <tr><td>Model</td><td>{car.model}</td></tr>
                <tr><td>Trim</td><td>{car.trim || "N/A"}</td></tr>
                <tr><td>Year</td><td>{car.year}</td></tr>
                <tr><td>Condition</td><td>{car.condition?.replace(/_/g, " ") || "N/A"}</td></tr>
                <tr><td>Body Type</td><td>{car.body_type?.name || "N/A"}</td></tr>
                <tr><td>Fuel Type</td><td>{car.fuel_type}</td></tr>
                <tr><td>Transmission</td><td>{car.transmission}</td></tr>
                <tr><td>Drive Type</td><td>{car.drive_type?.toUpperCase() || "N/A"}</td></tr>
                <tr><td>Engine</td><td>{car.engine_specs || "N/A"}</td></tr>
                <tr><td>Mileage</td><td>{Number(car.mileage).toLocaleString()} KM</td></tr>
                <tr><td>Interior Color</td><td>{car.interior_color}</td></tr>
                <tr><td>Exterior Color</td><td>{car.exterior_color}</td></tr>
                <tr><td>Location</td><td>{car.location}</td></tr>
                <tr><td>Vehicle ID</td><td>{car.reference_code}</td></tr>
                <tr><td>Registered</td><td>{car.is_verified ? "Yes" : "No"}</td></tr>
              </tbody>
            </table>
          </div>

          <div className="features card">
            <h3 className="sectionTitle">Car Features</h3>
            <div className="featureGrid">
              {car.features.map((f, i) => (
                <span key={i}>{f}</span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {showContact && (
        <SellContact car={car} onClose={() => setShowContact(false)} />
      )}

      <style>{`
/* ================= THEME VARIABLES ================= */
/* ================= THEME VARIABLES ================= */
:root {
  --bg: #ffffff;
  --surface: #ffffff;
  --card-bg: #f8f9fb;
  --border: #e5e7eb;

  --text: #111827;
  --muted: #6b7280;

  --accent: #ef4444;
  --rating-bg: #fde68a;
  --rating-text: #92400e;
}

[data-theme="dark"] {
  --bg: #000000;
  --surface: #111111;
  --card-bg: #0b0b0b;
  --border: #1f2937;

  --text: #ffffff;
  --muted: #9ca3af;
}

/* ================= PAGE ================= */
.page {
  background: var(--bg);
  color: var(--text);
  padding: 24px;
  max-width: 1400px;
  margin: auto;
}

/* ================= TITLES ================= */
.titleRow h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
}

.subtitle {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  margin-top: 8px;
  padding: 6px 12px;

  font-size: 12px;
  font-weight: 500;
  line-height: 1;

  color: #1a4ed8;
  background: rgba(230, 240, 255, 0.9);

  border-radius: 999px;
  border: 1px solid rgba(26, 78, 216, 0.15);

  backdrop-filter: blur(6px);
}
[data-theme="dark"] .subtitle {
  background: rgba(30, 58, 138, 0.25);
  color: #93c5fd;
  border-color: rgba(147, 197, 253, 0.25);
}


.verified {
  color: #22c55e;
  margin-left: 8px;
  font-size: 12px;
}

.ratingBadge {
  background: var(--rating-bg);
  color: var(--rating-text);
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  margin-left: 8px;
}

/* ================= TOP LAYOUT ================= */
.top {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
  margin-top: 16px;
}

/* ================= IMAGE ================= */
.mainImage {
  width: 100%;
  background: var(--surface);
  border-radius: 16px;
  overflow: hidden;
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
}

.mainImage img {
  width: 100%;
  height: auto;
  max-height: 520px;
  object-fit: contain;
}

/* ================= LOAN BADGE ================= */
.loanTag {
  position: absolute;
  top: 14px;
  left: 14px;
  z-index: 10;

  background: rgba(230, 240, 255, 0.95);
  color: #1a4ed8;
  padding: 6px 12px;
  font-size: 11px;
  border-radius: 999px;
  font-weight: 600;
  backdrop-filter: blur(6px);
}

/* ================= NAV ARROWS ================= */
.navArrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.55);
  color: white;
  border: none;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  z-index: 10;
}

.navArrow.left { left: 12px; }
.navArrow.right { right: 12px; }

/* ================= THUMBNAILS ================= */
.thumbs {
  display: flex;
  gap: 10px;
  margin-top: 14px;
  overflow-x: auto;
  padding-bottom: 6px;
}

.thumb {
  width: 96px;
  height: 72px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid var(--border);
  opacity: 0.6;
  cursor: pointer;
}

.thumb:hover {
  opacity: 1;
}

/* ================= INFO PANEL ================= */
.infoPanel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.infoCard {
  padding: 16px;
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.6;
  border: 1px solid var(--border);
  background: var(--card-bg);
}

.infoCard.dark {
  background: #1f2350;
  color: #fff;
}

.infoCard.light {
  background: #d7eff7;
  color: #000;
}

.infoCard.yellow {
  background: #ffd27a;
  color: #000;
}

/* ================= PRICE ================= */
.priceRow {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin: 28px 0;
}

.price {
  font-size: 26px;
  font-weight: 700;
}

.noCalc {
  color: var(--muted);
  font-size: 12px;
}

/* ================= ACTIONS ================= */
.actions {
  display: flex;
  gap: 12px;
  margin-bottom: 36px;
}

.outline {
  border: 1px solid var(--accent);
  background: transparent;
  color: var(--accent);
  padding: 12px;
  flex: 1;
  border-radius: 12px;
  font-weight: 600;
}

.solid {
  background: var(--accent);
  border: none;
  color: #fff;
  padding: 12px;
  flex: 1;
  border-radius: 12px;
  font-weight: 600;
}

/* ================= SPECS + FEATURES ================= */
.specFeatureGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 40px;
}

.card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 22px;
}

/* ================= TABLE ================= */
table {
  width: 100%;
  border-collapse: collapse;
}

td {
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
  font-size: 14px;
}

/* ================= FEATURES ================= */
.featureGrid {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.featureGrid span {
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 11px;
  color: var(--muted);
}

/* ================= RESPONSIVE ================= */
@media (max-width: 900px) {
  .top {
    grid-template-columns: 1fr;
  }

  .specFeatureGrid {
    grid-template-columns: 1fr;
  }

  .mainImage img {
    max-height: 60vh;
  }
}
/* =====================================================
   📱 MOBILE-ONLY LAYOUT (NEW)
===================================================== */
@media (max-width: 768px) {

  /* Page padding tighter */
  .page {
    padding: 16px;
  }

  /* Stack everything naturally */
  .top {
    display: block;
  }

  /* ================= IMAGE (MOBILE HERO) ================= */
  .mainImage {
    width: 100%;
    aspect-ratio: 4 / 5;       /* 🔥 taller image for cars */
    border-radius: 16px;
    margin-bottom: 14px;
  }

  .mainImage img {
    width: 100%;
    height: 100%;
    object-fit: contain;       /* 🔥 NEVER crop */
    max-height: none;
  }

  /* Center arrows better on mobile */
  .navArrow {
    width: 34px;
    height: 34px;
    font-size: 16px;
  }

  /* ================= TITLE UNDER IMAGE ================= */
  .titleRow h3 {
    font-size: 18px;
    line-height: 1.3;
  }

  .subtitle {
    font-size: 12px;
  }

  /* ================= PRICE BLOCK ================= */
  .priceRow {
    flex-direction: flex;
    align-items: flex-start;
    gap: 6px;
    margin: 18px 0;
  }

  .price {
    font-size: 22px;
  }

  /* ================= ACTION BUTTONS ================= */
  .actions {
    flex-direction: column;
    gap: 10px;

    position: sticky;          /* 🔥 sticky CTA */
    bottom: 0;
    background: var(--bg);
    padding: 12px 0;
    z-index: 20;
  }

  .actions button {
    width: 100%;
    font-size: 14px;
    padding: 14px;
  }

  /* ================= THUMBNAILS ================= */
  .thumbs {
    margin-top: 12px;
    padding-bottom: 8px;
  }

  .thumb {
    width: 72px;
    height: 72px;
  }

  /* ================= SPECS ================= */
  .specFeatureGrid {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  table td {
    font-size: 13px;
  }

  /* ================= FEATURES ================= */
  .featureGrid span {
    font-size: 10px;
    padding: 5px 10px;
  }

  /* ================= INFO PANEL ================= */
  .infoPanel {
    display: none; /* already intended */
  }
}

}

      `}</style>
    </>
  );
}