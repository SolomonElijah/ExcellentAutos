"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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

export default function HeroProduct() {
  const router = useRouter();

  // CONTACT MODAL STATE
  const [showContact, setShowContact] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  /* =========================
     FETCH FEATURED CARS
  ========================= */
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
              <div className="card" key={car.id}>
                <div
                  className="imgWrap"
                  onClick={() => router.push(`/cars/${car.id}`)}
                >
                  {/* ✅ FIX: USE NORMAL IMG */}
                  <img
                    src={`${API_BASE_URL.replace("/api", "")}${car.featured_image}`}
                    alt={`${car.year} ${car.brand?.name} ${car.model}`}
                    className="img"
                  />
                </div>

                <div className="body">
                  <h3 onClick={() => router.push(`/cars/${car.id}`)}>
                    {car.year} {car.brand?.name} {car.model}
                  </h3>

                  <div className="meta">
                    <span>
                      {car.condition === "foreign_used" ? "Foreign" : "Local"}
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

                    {car.loan_available && (
                      <div>
                        <p className="monthly">
                          ₦
                          {Number(
                            car.estimated_monthly_repayment
                          ).toLocaleString()}{" "}
                          / Mo
                        </p>
                        <small>
                          {car.min_down_payment_percent}% Down payment
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

      {/* STYLES — COMPLETELY UNCHANGED */}
      <style>{`
        .wrapper {
          background: #000;
          color: #fff;
          padding: 50px 40px;
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
          position: relative;
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
          cursor: pointer;
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

        .center {
          display: flex;
          justify-content: center;
          margin-top: 30px;
        }

        .seeMore {
          background: transparent;
          border: 1px solid red;
          color: #fff;
          padding: 12px 30px;
          border-radius: 10px;
          cursor: pointer;
        }

        @media (max-width: 1100px) {
          .grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 700px) {
          .wrapper {
            padding: 30px 20px;
          }

          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
