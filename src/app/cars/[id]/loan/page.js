"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api, API_BASE_URL } from "@/lib/api";

export default function CarLoanPage() {
  const { id } = useParams();
  const router = useRouter();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCar() {
      try {
        const res = await api("/cars"); // 🔒 DO NOT TOUCH
        const cars = res.data;
        const found = cars.find(c => String(c.id) === String(id));
        if (found) setCar(found);
      } finally {
        setLoading(false);
      }
    }
    loadCar();
  }, [id]);

  const baseUrl = API_BASE_URL.replace("/api", "");

  return (
    <>
      <div className="page">
        {/* LEFT */}
        <div className="left">
          {loading ? (
            <>
              <div className="skeleton img" />
              <div className="skeleton text lg" />
              <div className="skeleton text sm" />
              <div className="skeleton row" />
            </>
          ) : (
            <>
              <img
                src={`${baseUrl}${car.featured_image}`}
                alt={car.model}
                className="carImg"
              />

              <h3 className="carName">
                {car.year} {car.brand.name} {car.model}
              </h3>

              <div className="priceRow">
                <div>
                  <p className="price">
                    ₦{Number(car.price).toLocaleString()}
                  </p>
                  <small className="location">{car.location}</small>
                </div>

                <div className="loanBox">
                  <p className="monthly">
                    ₦{Number(car.estimated_monthly_repayment).toLocaleString()} / Mo
                  </p>
                  <small>
                    ₦{(
                      (car.min_down_payment_percent / 100) *
                      Number(car.price)
                    ).toLocaleString()} Down payment
                  </small>
                </div>
              </div>
            </>
          )}
        </div>

        {/* RIGHT */}
        <div className="right">
          <h3 className="title">How Loan Financing Works</h3>

          <div className="steps">
            {loading ? (
              <>
                <div className="step">
                  <div className="skeleton icon" />
                  <div className="skeleton text sm" />
                </div>
                <div className="step">
                  <div className="skeleton icon" />
                  <div className="skeleton text sm" />
                </div>
                <div className="step">
                  <div className="skeleton icon" />
                  <div className="skeleton text sm" />
                </div>
              </>
            ) : (
              <>
                <div className="step">
                  <div className="icon">📝</div>
                  <p>Fill the loan application form. It takes just a few minutes.</p>
                </div>

                <div className="step">
                  <div className="icon">📞</div>
                  <p>
                    Get feedback from our financial partner after review.
                  </p>
                </div>

                <div className="step">
                  <div className="icon">🚗</div>
                  <p>
                    Inspect the car, complete your down payment, and drive home.
                  </p>
                </div>
              </>
            )}
          </div>

          {!loading && (
            <button
              className="applyBtn"
              onClick={() => router.push(`/cars/${id}/loan/apply`)}
            >
              Start Application
            </button>
          )}
        </div>
      </div>

      <style>{`
        .page {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 40px;
          padding: 50px;
          background: #000;
          color: #fff;
          min-height: 100vh;
        }

        .left,
        .right {
          background: #0b0b0b;
          padding: 30px;
          border-radius: 16px;
          border: 1px solid #111;
        }

        .carImg {
          width: 100%;
          max-width: 360px;
          border-radius: 12px;
          margin-bottom: 16px;
        }

        .carName {
          font-size: 18px;
          margin-bottom: 14px;
        }

        .priceRow {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          font-size: 14px;
        }

        .price {
          font-weight: 700;
          font-size: 18px;
        }

        .location {
          color: #aaa;
        }

        .loanBox {
          text-align: right;
        }

        .monthly {
          font-weight: 600;
        }

        .title {
          text-align: center;
          margin-bottom: 30px;
          color: red;
        }

        .steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          margin-bottom: 40px;
          text-align: center;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .icon {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: #111;
          border: 1px solid #222;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 30px;
          margin-bottom: 14px;
        }

        .applyBtn {
          display: block;
          margin: 0 auto;
          background: red;
          color: #fff;
          border: none;
          padding: 14px 32px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
        }

        /* SKELETON */
        .skeleton {
          background: linear-gradient(
            90deg,
            #111 25%,
            #1a1a1a 37%,
            #111 63%
          );
          background-size: 400% 100%;
          animation: shimmer 1.4s ease infinite;
          border-radius: 8px;
        }

        .skeleton.img {
          width: 100%;
          height: 180px;
          margin-bottom: 16px;
        }

        .skeleton.text {
          height: 14px;
          width: 100%;
          margin-bottom: 10px;
        }

        .skeleton.text.sm {
          width: 70%;
        }

        .skeleton.text.lg {
          width: 90%;
        }

        .skeleton.row {
          height: 40px;
          width: 100%;
        }

        .skeleton.icon {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          margin-bottom: 14px;
        }

        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        @media (max-width: 900px) {
          .page {
            grid-template-columns: 1fr;
          }

          .steps {
            grid-template-columns: 1fr;
          }

          .priceRow {
            flex-direction: column;
          }

          .loanBox {
            text-align: left;
          }
        }
      `}</style>
    </>
  );
}
