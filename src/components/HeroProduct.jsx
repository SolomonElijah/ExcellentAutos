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
      cars.map((car) => {
        // ✅ DEFINE hasLoan PROPERLY
        const hasLoan = car.loan?.available === true;

        const loanData = car.loan?.precomputed;

        const firstTenure =
          loanData?.tenures &&
          (Array.isArray(loanData.tenures)
            ? loanData.tenures[0]
            : loanData.tenures[Object.keys(loanData.tenures)[0]]);

        return (
          <div className="card" key={car.id}>
            <div
              className="imgWrap"
              onClick={() => router.push(`/cars/${car.id}`)}
            >
              <img
                src={`${API_BASE_URL.replace("/api", "")}${car.featured_image}`}
                alt={`${car.year} ${car.brand?.name} ${car.model}`}
                className="img"
              />

              {/* ✅ LOAN TAG */}
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
                  <p className="price">
                    ₦{Number(car.price).toLocaleString()}
                  </p>
                  <small>{car.location}</small>
                </div>

                {/* ✅ MONTHLY PAYMENT ONLY IF PRECOMPUTED EXISTS */}
                {loanData && firstTenure && (
                  <div>
                    <p className="monthly">
                      ₦{Number(firstTenure.monthly_payment).toLocaleString()} / Mo
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
                    setSelectedCar(car);
                    setShowContact(true);
                  }}
                >
                  Contact Seller
                </button>

                {/* ✅ APPLY FOR LOAN BUTTON */}
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
    <span className="preorder-btn__main">Pre-Order This Car</span>
    <span className="preorder-btn__badge">5% OFF</span>
  </button>
</div>


            </div>
          </div>
        );
      })}
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

        /* === ADDED ONLY === */
        .metaRow {
          justify-content: space-between;
          align-items: center;
        }

        .metaLeft {
          display: flex;
          gap: 8px;
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
        }

        .preorder-cta {
  margin-top: 16px;
  display: flex;
  justify-content: center;   /* ✅ center horizontally */
  align-items: center;
}

.preorder-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 14px 24px;
  background: linear-gradient(135deg, #e11d48, #b91c1c);
  color: #fff;
  border: none;
  border-radius: 14px;
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

      `}</style>
    </>
  );
}
