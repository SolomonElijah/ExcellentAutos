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

                <div className="loanRow highlight">
                  <span className="label">Down Payment ({downPaymentPercent}%)</span>
                  <span className="value">₦{Number(downPaymentAmount).toLocaleString()}</span>
                </div>

                <div className="loanRow">
                  <span className="label">Loan Amount</span>
                  <span className="value">₦{Number(loanAmount).toLocaleString()}</span>
                </div>

                {firstTenure && (
                  <div className="loanRow highlight">
                    <span className="label">Estimated monthly payment ({firstTenureKey?.replace('m_', '')} months)</span>
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

              {/* <div className="locationNote">
                <small>📍 {car.location}</small>
              </div> */}

               {!loading && (
            <button
              className="applyBtn"
              onClick={() => router.push(`/cars/${id}/loan/apply`)}
            >
              Start Application
            </button>
          )}
            </>
          )}
        </div>

 <LoanCal car={car} />
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
/* ================= THEME VARIABLES ================= */
:root {
  --bg: #ffffff;
  --surface: #ffffff;
  --card: #f8f9fb;
  --border: #e5e7eb;

  --text: #111827;
  --muted: #6b7280;

  --accent: #ef4444;
  --accent-soft: rgba(239, 68, 68, 0.1);
}

[data-theme="dark"] {
  --bg: #000000;
  --surface: #0b0b0b;
  --card: #111111;
  --border: #1f2937;

  --text: #ffffff;
  --muted: #9ca3af;
}

/* ================= PAGE ================= */
.page {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 40px;
  padding: 50px;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;

  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  box-sizing: border-box;
}

/* ================= PANELS ================= */
.left,
.right {
  background: var(--surface);
  padding: 32px;
  border-radius: 20px;
  border: 1px solid var(--border);
  min-width: 0; /* ✅ CRITICAL FIX */
}

/* ================= IMAGE ================= */
.carImg {
  width: 100%;
  max-width: 420px;
  margin: 0 auto 20px;
  display: block;
  border-radius: 16px;
  object-fit: contain;
}

/* ================= TITLE ================= */
.carName {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
}

/* ================= LOAN DETAILS ================= */
.loanDetails {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.loanRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px dashed var(--border);
}

.loanRow:last-child {
  border-bottom: none;
}

.loanRow .label {
  font-size: 13px;
  color: var(--muted);
}

.loanRow .value {
  font-size: 15px;
  font-weight: 600;
  min-width: 0;
  word-break: break-word;
}

/* ================= HIGHLIGHT ================= */
.loanRow.highlight {
  background: linear-gradient(
    135deg,
    rgba(239, 68, 68, 0.12),
    rgba(239, 68, 68, 0.05)
  );
  border: 1px solid rgba(239, 68, 68, 0.35);
  padding: 18px 20px;
  border-radius: 16px;
  margin: 14px 0;
  box-shadow: 0 6px 18px rgba(239, 68, 68, 0.15);
  transition: transform 0.2s ease;
}

.loanRow.highlight:hover {
  transform: translateY(-2px);
}

.loanRow.highlight .label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
}

.loanRow.highlight .value {
  color: var(--accent);
  font-size: 22px;
  font-weight: 800;
}

/* ================= LOCATION ================= */
.locationNote {
  margin-top: 18px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
  color: var(--muted);
  font-size: 13px;
}

/* ================= RIGHT PANEL ================= */
.title {
  text-align: center;
  font-size: 18px;
  margin-bottom: 30px;
  color: var(--accent);
}

/* ================= STEPS ================= */
.steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  margin-bottom: 40px;
}

.step {
  text-align: center;
}

.icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--card);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin: 0 auto 14px;
}

/* ================= CTA ================= */
.applyBtn {
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
  display: block;

  background: linear-gradient(135deg, #ef4444, #b91c1c);
  color: #fff;
  border: none;
  padding: 16px;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

.applyBtn:hover {
  opacity: 0.9;
}

/* ================= SKELETON ================= */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--card) 25%,
    rgba(255,255,255,0.08) 37%,
    var(--card) 63%
  );
  background-size: 400% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: 10px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ================= MOBILE LAYOUT ================= */
/* ================= MOBILE LAYOUT ================= */
@media (max-width: 900px) {
  .page {
    grid-template-columns: 1fr;
    padding: 20px;
    gap: 20px;
  }

  .left,
  .right {
    padding: 20px;
  }

  .steps {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .loanRow {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }

  .loanRow .label {
    flex: 1;
    min-width: 0;
  }

  .loanRow .value {
    flex-shrink: 1;
    min-width: 0;
    text-align: right;
    word-break: break-word;
  }

  .loanRow.highlight .value {
    font-size: 18px;
  }
}


/* ================= SMALL PHONES ================= */
@media (max-width: 600px) {
  .carName {
    font-size: 18px;
  }

  .applyBtn {
    font-size: 14px;
    padding: 14px;
  }
}
`}</style>

    </>
  );
}