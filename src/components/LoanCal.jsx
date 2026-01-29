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
        .loanCal {
          margin: 30px 0;
          padding: 20px;
          border-radius: 14px;
          background: #0f0f0f;
          border: 1px solid #222;
        }

        .loanCalTitle {
          text-align: center;
          margin-bottom: 20px;
          font-size: 16px;
          font-weight: 600;
        }

        .tenureList {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 20px;
          justify-content: center;
        }

        .tenureBtn {
          padding: 8px 14px;
          background: #111;
          border: 1px solid #222;
          color: #fff;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
        }

        .tenureBtn.active {
          background: red;
          border-color: red;
          font-weight: 600;
        }

        .calDetails {
          display: flex;
          flex-direction: column;
          gap: 12px;
          font-size: 14px;
        }

        .row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #222;
          padding-bottom: 8px;
        }

        .row:last-child {
          border-bottom: none;
        }

        .highlight {
          margin-top: 10px;
          padding: 14px;
          background: rgba(255, 0, 0, 0.1);
          border: 1px solid rgba(255, 0, 0, 0.3);
          border-radius: 8px;
          font-size: 16px;
          font-weight: 700;
          color: red;
        }
      `}</style>
    </div>
  );
}
