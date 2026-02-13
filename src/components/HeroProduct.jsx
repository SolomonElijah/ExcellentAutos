"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import useSWR from "swr";
import { api, API_BASE_URL } from "@/lib/api";
import SellContact from "@/components/SellContact";

/* =========================
   FETCHER
========================= */
const fetcher = async (url) => {
  const res = await api(url);
  return res.data || [];
};

/* =========================
   CARD COMPONENT (REQUIRED FOR HOOK SAFETY)
========================= */
function CarCard({ car, onContact }) {
  const router = useRouter();

  /* ===== IMAGES ===== */
  const images = [
    car.featured_image,
    ...(car.images?.map((img) => img.url) || []),
  ].filter(Boolean);

  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () =>
    setIndex((i) => (i === 0 ? images.length - 1 : i - 1));

  /* ===== SWIPE ===== */
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const onTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
  };

  /* ===== LOAN ===== */
  const hasLoan = car.loan?.available === true;
  const loanData = car.loan?.precomputed;




const downPaymentPercent =
  loanData?.down_payment_percent ?? 0;

const downPaymentAmount =
  Math.round(
    (Number(car.price) * downPaymentPercent) / 100
  );



  const firstTenure =
    loanData?.tenures &&
    (Array.isArray(loanData.tenures)
      ? loanData.tenures[0]
      : loanData.tenures[Object.keys(loanData.tenures)[0]]);

  return (
    <div className="card">
      <div
        className="imgWrap"
        onClick={() => router.push(`/cars/${car.id}`)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <img
          src={`${API_BASE_URL.replace("/api", "")}${images[index]}`}
          alt={`${car.year} ${car.brand?.name} ${car.model}`}
          className="img"
          loading="lazy"
          decoding="async"
          fetchPriority="low"
        />
{images.length > 1 && (
  <div className="dots">
    {images.map((_, i) => (
      <span
        key={i}
        className={`dot ${i === index ? "active" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          setIndex(i);
        }}
      />
    ))}
  </div>
)}

        {hasLoan && (
          <span className="loanTag">Car Loan Available</span>
        )}
      </div>

      <div className="body">
        <h3 onClick={() => router.push(`/cars/${car.id}`)}>
          {car.year} {car.brand?.name} {car.model}
        </h3>

        <div className="meta metaRow">
          <div className="metaLeft">
            <span>
              {car.condition === "foreign_used" ? "Foreign" : "Local"}
            </span>
            <span>{car.mileage}kms</span>
            <span>{car.engine_specs || "—"}</span>
          </div>
          <span className="rating">⭐ 3.0</span>
        </div>

        <div className="priceRow">
          <div>
            <p className="price">₦{Number(car.price).toLocaleString()}</p>
            <small>{car.location}</small>
          </div>

          {loanData && firstTenure && (
            <div>
              <p className="monthly">
                ₦{Number(downPaymentAmount).toLocaleString()}
              </p>
              <small>{loanData.down_payment_percent}% Down payment</small>
            </div>
          )}
        </div>

        <div className="actions">
          <button
            className="outline"
            onClick={(e) => {
              e.stopPropagation();
              onContact(car);
            }}
          >
            Contact Seller
          </button>

          {hasLoan && (
            <button
              className="solid"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/cars/${car.id}/loan`);
              }}
            >
              Apply For Loan
            </button>
          )}
        </div>

        <div className="preorder-cta">
          <button
            className="preorder-btn"
            onClick={() => router.push(`/preorder/${car.id}`)}
          >
            <span className="preorder-btn__main">Pre-Order Same Car and Get 10% Discount</span>
            {/* <span className="preorder-btn__badge">10% OFF</span> */}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================
   MAIN COMPONENT
========================= */
export default function HeroProduct() {
  const [showContact, setShowContact] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  const { data: cars = [], isLoading } = useSWR(
    "/cars/featured-cars",
    fetcher
  );

  return (
    <>
      <section className="wrapper">
        <h2 className="title">Featured cars</h2>

        <div className="grid">
          {isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div className="card skeleton" key={i} />
            ))}

          {!isLoading &&
            cars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                onContact={(c) => {
                  setSelectedCar(c);
                  setShowContact(true);
                }}
              />
            ))}
        </div>

        <div className="center">
          <a href="/cars" className="seeMore">
            See More
          </a>
        </div>
      </section>

      {showContact && (
        <SellContact
          car={selectedCar}
          onClose={() => setShowContact(false)}
        />
      )}
 


      {/* STYLES — UNCHANGED + SMALL ADDITIONS */}
      <style>{`
       /* ================= SECTION ================= */
/* ================= THEME TOKENS ================= */
:root {
  --background: #ffffff;
  --foreground: #0f172a;

  --card-bg: #ffffff;
  --card-text: #0f172a;
  --card-border: #e5e7eb;

  --image-bg: #f3f4f6;

  --pill-bg: #eef2ff;
  --pill-text: #3730a3;

  --rating-bg: #fff7ed;
  --rating-text: #f59e0b;

  --accent: #dc2626;
}

/* ================= DARK MODE ================= */
[data-theme="dark"] {
  --background: #000000;
  --foreground: #ffffff;

  --card-bg: #0b0b0b;
  --card-text: #ffffff;
  --card-border: #1f2937;

  --image-bg: #111827;

  --pill-bg: #111827;
  --pill-text: #c7d2fe;

  --rating-bg: #1f2937;
  --rating-text: #facc15;

  --accent: #ef4444;
}

/* ================= SECTION ================= */
.wrapper {
  background: var(--background);
  color: var(--foreground);
  padding: 50px 40px;
}

.title {
  font-size: 22px;
  margin-bottom: 25px;
  font-weight: 600;
}

/* ================= GRID ================= */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
}

/* ================= CARD ================= */
.card {
  background: var(--card-bg);
  color: var(--card-text);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--card-border);
  cursor: pointer;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.08);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.15);
}

/* ================= IMAGE ================= */
.imgWrap {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: var(--image-bg);
  border-bottom: 1px solid var(--card-border);
  overflow: hidden;
  touch-action: pan-y;
}

.img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ================= IMAGE DOTS ================= */
.dots {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
}

.dot.active {
  background: #ffffff;
  transform: scale(1.2);
}

/* ================= BODY ================= */
.body {
  padding: 16px;
}

.body h3 {
  font-size: 16px;
  margin-bottom: 10px;
  font-weight: 600;
}

/* ================= META ================= */
.meta {
  display: flex;
  gap: 8px;
  font-size: 11px;
  margin-bottom: 12px;
  justify-content: space-between;
  align-items: center;
}

.meta span {
  background: var(--pill-bg);
  color: var(--pill-text);
  padding: 6px 12px;
  border-radius: 999px;
  font-weight: 600;
}

.rating {
  background: var(--rating-bg);
  color: var(--rating-text);
}

/* ================= PRICE ================= */
.priceRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.price {
  font-size: 18px;
  font-weight: 700;
}

.monthly {
  font-size: 15px;
  font-weight: 700;
  color: var(--accent);
}

/* ================= ACTIONS ================= */
.actions {
  display: flex;
  gap: 10px;
}

.actions button {
  flex: 1;
  padding: 10px;
  font-size: 12px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.outline {
  background: transparent;
  border: 1px solid var(--accent);
  color: var(--accent);
}

.solid {
  background: var(--accent);
  border: none;
  color: #ffffff;
}

/* ================= LOAN TAG ================= */
.loanTag {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: var(--pill-bg);
  color: var(--pill-text);
  padding: 6px 12px;
  font-size: 11px;
  border-radius: 999px;
  font-weight: 600;
}

/* ================= CTA ================= */
.preorder-cta {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}

.preorder-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 14px 24px;
  background: linear-gradient(135deg, #e11d48, #b91c1c);
  color: #ffffff;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(225, 29, 72, 0.35);
}

.preorder-btn__badge {
  background: #ffffff;
  color: #b91c1c;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
}

/* ================= SEE MORE ================= */
.center {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.seeMore {
  border: 1px solid var(--accent);
  color: var(--accent);
  padding: 12px 30px;
  border-radius: 999px;
  font-weight: 600;
}

/* ================= RESPONSIVE ================= */
@media (max-width: 1100px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 700px) {
  .wrapper {
    padding: 20px 16px;
  }

  .grid {
    grid-template-columns: 1fr;
  }

  .title {
    margin-bottom: 18px;
  }

  .center {
    margin-top: 20px;
  }
}

      `}</style>
    </>
  );
}
