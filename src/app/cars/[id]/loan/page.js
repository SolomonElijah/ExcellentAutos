"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api, API_BASE_URL } from "@/lib/api";
import LoanCal from "@/components/LoanCal";


export default function CarLoanPage() {
  const { id } = useParams();
  const router = useRouter();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  async function loadCar() {
    try {
      const res = await api(`/cars/${id}`); // ✅ CORRECT
      setCar(res.data);
    } catch (err) {
      console.error("Failed to load loan car", err);
      router.push("/cars");
    } finally {
      setLoading(false);
    }
  }

  loadCar();
}, [id, router]);


  const baseUrl = API_BASE_URL.replace("/api", "");

  /* ================= LOAN CALCULATIONS ================= */
  const hasValidLoan = car?.loan?.available === true;
  const loanData = car?.loan?.precomputed;

  // Get first available tenure
  let firstTenure = null;
  let firstTenureKey = null;

  if (loanData?.tenures) {
    const tenureKeys = Object.keys(loanData.tenures);
    if (tenureKeys.length > 0) {
      firstTenureKey = tenureKeys[0];
      firstTenure = loanData.tenures[firstTenureKey];
    }
  }

  // Calculate loan amounts
  const downPaymentPercent = loanData?.down_payment_percent || 0;
  const downPaymentAmount = (downPaymentPercent / 100) * (car?.price || 0);
  const loanAmount = (car?.price || 0) - downPaymentAmount;

  // Redirect if no valid loan
  useEffect(() => {
    if (!loading && car && !hasValidLoan) {
      router.push(`/cars/${id}`);
    }
  }, [loading, car, hasValidLoan, id, router]);

  if (!hasValidLoan && !loading) {
    return null; // Will redirect
  }

  return (
    <>
      <div className="page">
        {/* LEFT - CAR INFO WITH LOAN DETAILS */}
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

              {/* LOAN DETAILS INSTEAD OF NORMAL PRICE */}
              <div className="loanDetails">
                <div className="loanRow">
                  <span className="label">Car Price</span>
                  <span className="value">₦{Number(car.price).toLocaleString()}</span>
                </div>

                <div className="loanRow">
                  <span className="label">Down Payment ({downPaymentPercent}%)</span>
                  <span className="value">₦{Number(downPaymentAmount).toLocaleString()}</span>
                </div>

                <div className="loanRow">
                  <span className="label">Loan Amount</span>
                  <span className="value">₦{Number(loanAmount).toLocaleString()}</span>
                </div>

                {firstTenure && (
                  <div className="loanRow highlight">
                    <span className="label">Monthly Payment ({firstTenureKey?.replace('m_', '')} months)</span>
                    <span className="value">₦{Number(firstTenure.monthly_payment).toLocaleString()}</span>
                  </div>
                )}

                {/* INTEREST RATE */}
                {loanData?.interest_rate && (
                  <div className="loanRow">
                    <span className="label">Interest Rate</span>
                    <span className="value">{loanData.interest_rate}%</span>
                  </div>
                )}

                {/* TOTAL PAYABLE */}
                {firstTenure?.total_payable && (
                  <div className="loanRow">
                    <span className="label">Total Payable</span>
                    <span className="value">₦{Number(firstTenure.total_payable).toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="locationNote">
                <small>📍 {car.location}</small>
              </div>
            </>
          )}
        </div>

        {/* RIGHT - LOAN PROCESS INFO */}
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
          <LoanCal car={car} />


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
          margin-bottom: 20px;
        }

        /* LOAN DETAILS STYLING */
        .loanDetails {
          margin-bottom: 20px;
        }

        .loanRow {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #222;
        }

        .loanRow:last-child {
          border-bottom: none;
        }

        .loanRow .label {
          color: #aaa;
          font-size: 14px;
        }

        .loanRow .value {
          font-weight: 600;
          font-size: 16px;
        }

        .loanRow.highlight {
          background: rgba(255, 0, 0, 0.1);
          padding: 16px;
          border-radius: 8px;
          margin: 10px 0;
          border: 1px solid rgba(255, 0, 0, 0.3);
        }

        .loanRow.highlight .label {
          color: #fff;
          font-weight: 600;
        }

        .loanRow.highlight .value {
          color: red;
          font-size: 20px;
          font-weight: 700;
        }

        .locationNote {
          margin-top: 20px;
          padding-top: 15px;
          border-top: 1px solid #222;
          color: #aaa;
          font-size: 14px;
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
          width: 100%;
          max-width: 300px;
        }

        .applyBtn:hover {
          background: #cc0000;
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

          .loanRow {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }

          .loanRow .value {
            align-self: flex-end;
          }
        }

        @media (max-width: 600px) {
          .page {
            padding: 20px;
          }

          .left,
          .right {
            padding: 20px;
          }
        }
      `}</style>
    </>
  );
}