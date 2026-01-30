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
                style={{ maxHeight: '500px', objectFit: 'contain' }}
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

      .noCalc {
  color: #aaa;
  font-size: 12px;
}

        .page {
  background: #000;
  color: #fff;
  padding: 30px;
}

.titleRow h3 {
  margin: 0;
}

.verified {
  color: #22c55e;
  margin-left: 8px;
  font-size: 12px;
}

.subtitle {
  color: #aaa;
  margin-top: 6px;
}

.sectionTitle {
  color: red;
  margin-bottom: 16px;
}

/* ================= TOP LAYOUT ================= */
.top {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}


/* ================= IMAGE ================= */
.mainImage {
  flex: 0 0 70%;          /* image takes ~70% width */
  max-height: 340px;     /* ~30% smaller than before */
  border-radius: 14px;
  background: #111;
  position: relative;
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;
}


.mainImage img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
}

.infoPanel {
  flex: 0 0 50%;     /* info panel takes ~30% width */
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.infoCard {
  margin-top: 0;
}


/* ================= THUMBS ================= */
.thumbs {
  display: flex;
  gap: 10px;
  margin-top: 12px;
  overflow-x: auto;
}

.thumb {
  width: 100px;
  height: 100px;
  object-fit: cover;
  opacity: 0.7;
  cursor: pointer;
  border-radius: 6px;
}

.thumb:hover {
  opacity: 1;
}

/* ================= INFO CARDS ================= */
.infoCard {
  padding: 16px;
  border-radius: 10px;
  font-size: 16px;
  margin-top: 1opx;
}

.dark { background: #1f2350; }
.light { background: #d7eff7; color: #000; }
.yellow { background: #ffd27a; color: #000; }

/* ================= PRICE + ACTIONS ================= */
.priceRow {
  display: flex;
  justify-content: space-between;
  margin: 32px 0;
  align-items: flex-end;
}

.price {
  font-size: 24px;
  font-weight: bold;
}

.page .actions {
  display: flex;
  gap: 12px;
  margin-bottom: 40px;
}

.outline {
  border: 1px solid red;
  background: transparent;
  color: #fff;
  padding: 12px;
  flex: 1;
  border-radius: 8px;
}

.solid {
  background: red;
  border: none;
  color: #fff;
  padding: 12px;
  flex: 1;
  border-radius: 8px;
}

/* ================= TABLE ================= */
table {
  width: 100%;
  border-collapse: collapse;
}

td {
  padding: 10px 0;
  border-bottom: 1px solid #111;
}

/* ================= FEATURES ================= */
.featureGrid {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.featureGrid span {
  background: #111;
  padding: 6px 10px;
  border-radius: 20px;
  font-size: 11px;
}

/* ================= SPECS + FEATURES ================= */
.specFeatureGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 40px;
}

.card {
  background: #0d0d0d;
  border: 1px solid #111;
  border-radius: 16px;
  padding: 22px;
}

/* ================= BADGES ================= */
.ratingBadge {
  background: #222;
  color: #ffd700;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  margin-left: 8px;
}

.loanTag {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: #e6f0ff;
  color: #1a4ed8;
  padding: 4px 8px;
  font-size: 11px;
  border-radius: 10px;
  z-index: 10;
}

/* ================= ARROWS ================= */
.navArrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.navArrow.left { left: 10px; }
.navArrow.right { right: 10px; }

/* ================= VISIBILITY ================= */
.hidden { display: none; }

@media (min-width: 768px) {
  .hidden.md\:block { display: block; }
}

@media (max-width: 900px) {
  .top { grid-template-columns: 1fr; }
  .specFeatureGrid { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .navArrow {
    width: 32px;
    height: 32px;
    font-size: 16px;
  }
}
@media (max-width: 900px) {
  .top {
    flex-direction: column;
  }

  .mainImage,
  .infoPanel {
    flex: 1 1 100%;
    max-height: none;
  }
}
  
/* ===== HIDE INFO PANEL ON MOBILE ===== */
@media (max-width: 768px) {
  .infoPanel {
    display: none;
  }
}

      `}</style>
    </>
  );
}