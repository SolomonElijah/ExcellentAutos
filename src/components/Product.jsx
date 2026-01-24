"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
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
  return res;
};

export default function Product() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /* =========================
     STATE
  ========================= */
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});

  /* =========================
     READ URL PARAMS (HERO)
  ========================= */
  useEffect(() => {
    const urlSearch = searchParams.get("search");
    const priceMin = searchParams.get("price_min");
    const priceMax = searchParams.get("price_max");

    if (urlSearch) setSearch(urlSearch);

    if (priceMin || priceMax) {
      setFilters((prev) => ({
        ...prev,
        ...(priceMin && { price_min: priceMin }),
        ...(priceMax && { price_max: priceMax }),
      }));
    }

    if (urlSearch || priceMin || priceMax) setPage(1);
  }, []);

  /* =========================
     CONTACT MODAL
  ========================= */
  const [showContact, setShowContact] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  /* =========================
     SWR
  ========================= */
  const query = new URLSearchParams({
    search,
    page,
    ...filters,
  }).toString();

  const { data, isLoading } = useSWR(`/cars?${query}`, fetcher, {
    refreshInterval: 60000,
    revalidateOnFocus: false,
  });

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

          {!isLoading &&
            cars.map((car) => {
              /* =========================
                 SAFE LOAN DEFAULT (m_6)
              ========================= */
              const tenures = car.loan?.precomputed?.tenures || {};
              const defaultTenure =
                tenures.m_6 || tenures[Object.keys(tenures)[0]];

              return (
                <div className="card" key={car.id}>
                  <div
                    className="imgWrap"
                    onClick={() => router.push(`/cars/${car.id}`)}
                  >
                    <img
                      src={`${API_BASE_URL.replace(
                        "/api",
                        ""
                      )}${car.featured_image}`}
                      alt={`${car.year} ${car.brand.name} ${car.model}`}
                      className="img"
                    />
                  </div>

                  <div className="body">
                    <h3 onClick={() => router.push(`/cars/${car.id}`)}>
                      {car.year} {car.brand.name} {car.model}
                    </h3>

                    <div className="meta">
                      <span>
                        {car.condition === "foreign_used"
                          ? "Foreign"
                          : "Local"}
                      </span>
                      <span>{car.mileage}kms</span>
                      <span>{car.engine_specs || "—"}</span>
                      <span className="rating">⭐ 6.0</span>
                    </div>

                    <div className="priceRow">
                      <div>
                        <p className="price">
                          ₦{Number(car.price).toLocaleString()}
                        </p>
                        <small>{car.location}</small>
                      </div>

                      {car.loan_available && defaultTenure && (
                        <div>
                          <p className="monthly">
                            ₦
                            {Number(
                              defaultTenure.monthly_payment
                            ).toLocaleString()}{" "}
                            / Mo
                          </p>
                          <small>
                            {
                              car.loan?.precomputed
                                ?.down_payment_percent
                            }
                            % Down payment
                          </small>
                        </div>
                      )}
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

                      <button
                        className="solid"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/cars/${car.id}/loan`);
                        }}
                      >
                        Apply For Loan
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
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </button>

            <span>
              Page {meta.current_page} of {meta.last_page}
            </span>

            <button
              disabled={meta.current_page === meta.last_page}
              onClick={() => setPage((p) => p + 1)}
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

    

      {/* STYLES — COMPLETELY UNCHANGED */}
      <style >{`
        .wrapper {
          background: #000;
          color: #fff;
          padding: 50px 40px;
          min-height: 100vh;
        }

        .title {
          font-size: 22px;
          margin-bottom: 25px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 25px;
        }

        .card {
          background: #0b0b0b;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #111;
          cursor: pointer;
        }

        .imgWrap {
          width: 100%;
          aspect-ratio: 16 / 9;
          background: #111;
        }

        .img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .body {
          padding: 16px;
        }

        .body h3 {
          font-size: 16px;
          margin-bottom: 10px;
        }

        .meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          font-size: 11px;
          margin-bottom: 12px;
        }

        .meta span {
          background: #111;
          padding: 4px 8px;
          border-radius: 6px;
        }

        .rating {
          background: #222;
        }

        .priceRow {
          display: flex;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .price,
        .monthly {
          font-weight: 600;
        }

        .actions {
          display: flex;
          gap: 10px;
        }

        .actions button {
          flex: 1;
          padding: 10px;
          font-size: 12px;
          border-radius: 8px;
        }

        .outline {
          background: transparent;
          border: 1px solid red;
          color: #fff;
        }

        .solid {
          background: red;
          border: none;
          color: #fff;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 15px;
          margin-top: 40px;
        }

        .pagination button {
          background: #111;
          border: 1px solid #222;
          color: #fff;
          padding: 8px 14px;
          border-radius: 6px;
          cursor: pointer;
        }

        .pagination button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .skeleton {
          pointer-events: none;
        }

        .shimmer {
          background: linear-gradient(
            90deg,
            #111 25%,
            #1a1a1a 37%,
            #111 63%
          );
          background-size: 400% 100%;
          animation: shimmer 1.4s ease infinite;
        }

        .line {
          height: 12px;
          border-radius: 6px;
          margin-bottom: 10px;
        }

        .w80 {
          width: 80%;
        }

        .w60 {
          width: 60%;
        }

        .w40 {
          width: 40%;
        }

        .tag {
          width: 50px;
          height: 16px;
          border-radius: 6px;
        }

        .btn {
          height: 32px;
          border-radius: 8px;
          flex: 1;
        }

        @keyframes shimmer {
          0% {
            background-position: -400px 0;
          }
          100% {
            background-position: 400px 0;
          }
        }

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
