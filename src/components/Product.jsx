"use client";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import useSWR from "swr";
import { api, API_BASE_URL } from "@/lib/api";
import SellContact from "@/components/SellContact";
import CarsFilterBar from "@/components/CarsFilterBar";
import CarsSearchHeader from "@/components/CarsSearchHeader";

/* =========================
   FETCHER
========================= */
const fetcher = async (url) => {
  const res = await api(url);
  return res; // 🔥 return full API response (data + meta)
};

function CarImageSlider({ car, onClick, children  }) {
  const images = [
    car.featured_image,
    ...(car.images?.map((img) => img.url) || []),
  ].filter(Boolean);

  const [index, setIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () =>
    setIndex((i) => (i === 0 ? images.length - 1 : i - 1));

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

  return (
   <div
  className="imgWrap"
  onClick={onClick}
  onTouchStart={onTouchStart}
  onTouchMove={onTouchMove}
  onTouchEnd={onTouchEnd}
>
  <img
    src={`${API_BASE_URL.replace("/api", "")}${images[index]}`}
    alt="Car image"
    className="img"
    loading="lazy"
    decoding="async"
    fetchPriority="low"
  />

  {/* 🔥 THIS LINE FIXES EVERYTHING */}
  {children}

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
</div>

  );
}

export default function Product() {
  const router = useRouter();

  /* =========================
     STATE
  ========================= */
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});

  const searchParams = useSearchParams();



  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());

    setSearch(params.search || "");
    setPage(params.page ? Number(params.page) : 1);

    const { search: _, page: __, ...rest } = params;

    // 🔥 FIX FOR YEAR & LOCATION FILTERS
    if (rest.year_min) {
      rest.year_min = parseInt(rest.year_min);
      if (isNaN(rest.year_min)) delete rest.year_min;
    }
    if (rest.year_max) {
      rest.year_max = parseInt(rest.year_max);
      if (isNaN(rest.year_max)) delete rest.year_max;
    }

    // Clean empty values
    Object.keys(rest).forEach(key => {
      if (rest[key] === '' || rest[key] === null || rest[key] === undefined) {
        delete rest[key];
      }
    });


    console.log('🔧 Filters being sent to API:', rest);

    setFilters(rest);
  }, [searchParams]);



  // 🔹 CONTACT MODAL STATE
  const [showContact, setShowContact] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  /* =========================
     SWR
  ========================= */
  const params = new URLSearchParams({
    page,
    ...filters,
  });

  if (search) {
    params.set("search", search);
  }

  const query = params.toString();


  const { data, isLoading } = useSWR(
    `/cars?${query}`,
    fetcher,
    {
      refreshInterval: 60000,
      revalidateOnFocus: false,
    }
  );

  const cars = data?.data || [];
  const meta = data?.meta;

  return (
    <>
      {/* SEARCH */}
      <CarsSearchHeader
        onSearch={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onClear={() => {
          setSearch("");
          setFilters({});
          setPage(1);
        }}
      />

      {/* FILTER BAR */}
      <CarsFilterBar
        onApply={(newFilters) => {
          setFilters(newFilters);
          setPage(1);
        }}
      />



      <section className="wrapper">
        <h2 className="title">Find cars</h2>
        <div className="grid">
          {isLoading &&
            Array.from({ length: 12 }).map((_, i) => (
              <div className="card skeleton" key={i}>
                <div className="imgWrap shimmer" />
                <div className="body">
                  <div className="line w80 shimmer" />
                  <div className="meta">
                    <div className="tag shimmer" />
                    <div className="tag shimmer" />
                    <div className="tag shimmer" />
                  </div>
                  <div className="priceRow">
                    <div className="line w60 shimmer" />
                    <div className="line w40 shimmer" />
                  </div>
                  <div className="actions">
                    <div className="btn shimmer" />
                    <div className="btn shimmer" />
                  </div>
                </div>
              </div>
            ))}

          {/* ADDED: No results message */}
          {!isLoading && cars.length === 0 && (
            <div className="no-results">
              <h3>No cars found</h3>
              <p>Try adjusting your filters or search term</p>
              <button
                className="clear-btn"
                onClick={() => {
                  setSearch("");
                  setFilters({});
                  setPage(1);
                  router.replace(window.location.pathname);
                }}
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* MODIFIED: Added cars.length > 0 condition */}
          {!isLoading && cars.length > 0 &&
            cars.map((car) => {
              const hasLoan = car.loan?.available === true;

              const loanData = car.loan?.precomputed ?? null;



              const downPaymentPercent =
  loanData?.down_payment_percent ?? 0;

const downPaymentAmount =
  Math.round(
    (Number(car.price) * downPaymentPercent) / 100
  );

              const firstTenure = loanData?.tenures
                ? loanData.tenures[Object.keys(loanData.tenures)[0]]
                : null;


              return (
                <div className="card" key={car.id}>
     <CarImageSlider
  car={car}
  onClick={() => router.push(`/cars/${car.id}`)}
>
  {hasLoan && (
    <span className="loanTag">Car Loan Available</span>
  )}
</CarImageSlider>


                  <div className="body">
                    <h3 onClick={() => router.push(`/cars/${car.id}`)}>
                      {car.year} {car.brand.name} {car.model}
                    </h3>

                    {/* META ROW — RATING RIGHT */}
                    <div className="meta metaRow">
                      <div className="metaLeft">
                        <span>
                          {car.condition === "foreign_used"
                            ? "Foreign"
                            : "Local"}
                        </span>
                        <span>{car.mileage}kms</span>
                        <span>{car.engine_specs || "—"}</span>
                      </div>

                      <span className="rating">⭐ 3.0</span>
                    </div>

                    <div className="priceRow">
                      <div>
                        <p className="price">
                          ₦{Number(car.price).toLocaleString()}
                        </p>
                        <small>{car.location}</small>
                      </div>

                      {hasLoan && loanData && firstTenure ? (
                        <div>
                          <p className="monthly">
                             ₦{Number(downPaymentAmount).toLocaleString()}
                          </p>
                          <small>
                            {loanData.down_payment_percent}% Down payment
                          </small>
                        </div>
                      ) : hasLoan ? (
                        <small className="noCalc">

                        </small>
                      ) : null}
                    </div>


                    <div className="actions">
                      <button
                        className="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCar(car);
                          setShowContact(true);
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
            })}
        </div>



        {meta && meta.last_page > 1 && (
          <div className="pagination">
            <button
              disabled={meta.current_page === 1}
              onClick={() => {
                const newPage = meta.current_page - 1;
                setPage(newPage);
                // Update URL with page number
                const params = new URLSearchParams(window.location.search);
                if (newPage > 1) {
                  params.set("page", newPage.toString());
                } else {
                  params.delete("page");
                }
                const newUrl = params.toString() ? `?${params.toString()}` : "";
                router.replace(`${window.location.pathname}${newUrl}`, { scroll: false });
              }}
            >
              Prev
            </button>

            <span>
              Page {meta.current_page} of {meta.last_page}
            </span>

            <button
              disabled={meta.current_page === meta.last_page}
              onClick={() => {
                const newPage = meta.current_page + 1;
                setPage(newPage);
                // Update URL with page number
                const params = new URLSearchParams(window.location.search);
                params.set("page", newPage.toString());
                const newUrl = params.toString() ? `?${params.toString()}` : "";
                router.replace(`${window.location.pathname}${newUrl}`, { scroll: false });
              }}
            >
              Next
            </button>
          </div>
        )}
      </section>

      {showContact && (
        <SellContact
          car={selectedCar}
          onClose={() => setShowContact(false)}
        />
      )}

      {/* STYLES — COMPLETELY UNCHANGED + SMALL ADDITIONS */}
      <style>{`
   /* ================= THEME VARIABLES ================= */
:root {
  --bg: #ffffff;
  --card-bg: #f8f9fb;
  --surface: #ffffff;
  --border: #e5e7eb;
  --text: #111827;
  --muted: #6b7280;
  --accent: #ef4444;
}

[data-theme="dark"] {
  --bg: #000000;
  --card-bg: #0b0b0b;
  --surface: #111111;
  --border: #1f2937;
  --text: #ffffff;
  --muted: #9ca3af;
}

/* ================= PAGINATION ================= */
.pagination {
  margin-top: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.pagination button {
  padding: 10px 18px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;

  background: var(--card-bg);
  color: var(--text);
  border: 1px solid var(--border);

  transition: background 0.15s ease,
              color 0.15s ease,
              box-shadow 0.15s ease,
              transform 0.15s ease;
}

.pagination button:hover:not(:disabled) {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
  box-shadow: 0 10px 28px rgba(239, 68, 68, 0.35);
  transform: translateY(-1px);
}

.pagination button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.pagination span {
  font-size: 13px;
  font-weight: 600;
  color: var(--muted);
  padding: 6px 10px;
}

/* ================= LAYOUT ================= */
.wrapper {
  background: var(--bg);
  color: var(--text);
  padding: 50px 40px;
  min-height: 100vh;
}

.title {
  font-size: 22px;
  margin-bottom: 25px;
  font-weight: 600;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
}

/* ================= CARD ================= */
.card {
  background: var(--card-bg);
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid var(--border);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
}

/* ================= IMAGE ================= */
.imgWrap {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #111;
  overflow: hidden;
   z-index: 1;  
}

.img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ================= IMAGE DOTS ================= */
.dots {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
  z-index: 2;
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.45);
  cursor: pointer;
}

.dot.active {
  background: #ffffff;
}

/* ================= LOAN BADGE (ON IMAGE) ================= */
.loanTag {
  position: absolute;
  top: 12px;
  left: 12px;

  z-index: 10;                 /* 🔥 force above image + dots */
  pointer-events: none;        /* 🔥 prevents hover dependency */

  background: rgba(230, 240, 255, 0.95);
  color: #1a4ed8;
  padding: 6px 12px;
  font-size: 11px;
  border-radius: 999px;
  font-weight: 600;

  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(6px);

  opacity: 1;                  /* 🔥 force visible */
  visibility: visible;         /* 🔥 force visible */
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
  flex-wrap: wrap;
  gap: 8px;
  font-size: 11px;
  margin-bottom: 12px;
}

.metaRow {
  justify-content: space-between;
  align-items: center;
}

.metaLeft {
  display: flex;
  gap: 8px;
}

.meta span {
  background: var(--pill-bg, #eef2ff);
  color: var(--pill-text, #3730a3);
  padding: 6px 12px;
  border-radius: 999px;
  font-weight: 600;
}

.rating {
  background: #fde68a;
  color: #92400e;
  font-weight: 600;
}

/* ================= PRICE ================= */
.priceRow {
  display: flex;
  justify-content: space-between;
  margin-bottom: 14px;
}

.price,
.monthly {
  font-weight: 600;
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
  border-radius: 10px;
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
  color: #fff;
}

/* ================= PREORDER CTA ================= */
.preorder-cta {
  margin-top: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.preorder-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 14px 24px;
  background: linear-gradient(135deg, #e11d48, #b91c1c);
  color: #fff;
  border: none;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  box-shadow: 0 8px 24px rgba(225, 29, 72, 0.35);
}

.preorder-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 32px rgba(225, 29, 72, 0.45);
}

.preorder-btn__badge {
  background: #fff;
  color: #b91c1c;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
}

/* ================= NO RESULTS ================= */
.no-results {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  background: var(--card-bg);
  border-radius: 16px;
  border: 1px solid var(--border);
}

.no-results p {
  color: var(--muted);
}

/* ================= RESPONSIVE ================= */
@media (max-width: 1100px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 700px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

      `}</style>
    </>
  );
}