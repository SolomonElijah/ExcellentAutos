"use client";

import { useState } from "react";

export default function LoanCal({ car }) {
  if (!car?.loan?.available || !car?.loan?.precomputed) return null;

  const loanData = car.loan.precomputed;
  const tenures = loanData.tenures || {};

  const tenureKeys = Object.keys(tenures);
  if (tenureKeys.length === 0) return null;

  const [selectedKey, setSelectedKey] = useState(tenureKeys[0]);
  const selected = tenures[selectedKey];

  const downPaymentPercent = loanData.down_payment_percent || 0;
  const downPaymentAmount = (downPaymentPercent / 100) * car.price;

  return (
    <div className="loanCal">
      <h4 className="loanCalTitle">Loan Calculator</h4>

      {/* TENURE SELECTOR */}
      <div className="tenureList">
        {tenureKeys.map(key => {
          const months = key.replace("m_", "");
          return (
            <button
              key={key}
              className={`tenureBtn ${selectedKey === key ? "active" : ""}`}
              onClick={() => setSelectedKey(key)}
            >
              {months} months
            </button>
          );
        })}
      </div>

      {/* BREAKDOWN */}
      <div className="calDetails">
        <div className="row">
          <span>Car Price</span>
          <span>₦{Number(car.price).toLocaleString()}</span>
        </div>

        <div className="row">
          <span>Down Payment ({downPaymentPercent}%)</span>
          <span>₦{Number(downPaymentAmount).toLocaleString()}</span>
        </div>

        <div className="row">
          <span>Loan Amount</span>
          <span>₦{Number(selected.loan_amount).toLocaleString()}</span>
        </div>

        <div className="row highlight">
          <span>Monthly Payment</span>
          <span>₦{Number(selected.monthly_payment).toLocaleString()}</span>
        </div>

        <div className="row">
          <span>Total Interest</span>
          <span>₦{Number(selected.total_interest).toLocaleString()}</span>
        </div>

        <div className="row">
          <span>Total Payable</span>
          <span>₦{Number(selected.total_payable).toLocaleString()}</span>
        </div>
      </div>

      <style>{`
       /* ================= THEME ================= */
.loanCal {
  margin: 32px 0;
  padding: 24px;
  border-radius: 18px;
  background: var(--card, #111);
  border: 1px solid var(--border, #222);
}

/* ================= TITLE ================= */
.loanCalTitle {
  text-align: center;
  margin-bottom: 22px;
  font-size: 16px;
  font-weight: 600;
  color: var(--text, #fff);
}

/* ================= TENURE SELECTOR ================= */
.tenureList {
  display: flex;
  gap: 10px;
  margin-bottom: 22px;
  justify-content: center;
  flex-wrap: wrap;
}

.tenureBtn {
  padding: 10px 16px;
  background: var(--surface, #111);
  border: 1px solid var(--border, #222);
  color: var(--text, #fff);
  border-radius: 999px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.tenureBtn:hover {
  border-color: var(--accent, red);
}

.tenureBtn.active {
  background: var(--accent, red);
  border-color: var(--accent, red);
  color: #fff;
  font-weight: 600;
}

/* ================= DETAILS ================= */
.calDetails {
  display: flex;
  flex-direction: column;
  gap: 14px;
  font-size: 14px;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px dashed var(--border, #222);
  color: var(--text, #fff);
}

.row span:first-child {
  color: var(--muted, #aaa);
  font-size: 13px;
}

.row:last-child {
  border-bottom: none;
}

/* ================= MONTHLY HIGHLIGHT ================= */
.row.highlight {
  margin-top: 14px;
  padding: 16px;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 14px;
  font-size: 16px;
  font-weight: 700;
  color: var(--accent, red);
}

.row.highlight span:first-child {
  color: var(--text, #fff);
}

/* ================= MOBILE ================= */
@media (max-width: 768px) {
  .loanCal {
    padding: 20px;
  }

  .tenureList {
    flex-wrap: nowrap;
    overflow-x: auto;
    justify-content: flex-start;
    padding-bottom: 6px;
  }

  .tenureBtn {
    white-space: nowrap;
    flex-shrink: 0;
  }

  .row {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .row span:last-child {
    align-self: flex-end;
    font-weight: 600;
  }
}

      `}</style>
    </div>
  );
}
