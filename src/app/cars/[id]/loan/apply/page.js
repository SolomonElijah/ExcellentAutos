"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";

export default function LoanApplicationForm() {
  const { id } = useParams(); // car_id
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // 🔥 POPUP STATE (ADDED)
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    nin: "",
    bvn: "",
    employment_type: "",
    gender: "",
    nationality_status: "",
    nationality: "",
    state_of_residence: "",
    equity_contribution: "",
    desired_monthly_payment: "",
    desired_interest_rate: "",
    loan_term_months: "",
    roadworthiness: true,
    licence_renewal: true,
    fee_payment_type: "upfront",
    upfront_items: [],
    credit_consent: false,
    terms_accepted: false,
  });

  function update(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function submit(e) {
    e.preventDefault();

    // ❌ REPLACED alert()
    if (!form.credit_consent || !form.terms_accepted) {
      setPopupMessage("You must accept credit consent and terms");
      setShowPopup(true);
      return;
    }

    if (form.fee_payment_type === "upfront" && form.upfront_items.length === 0) {
      setPopupMessage("Select at least one upfront item");
      setShowPopup(true);
      return;
    }

    const allowedTerms = [6, 12, 18, 24, 36];
    if (!allowedTerms.includes(Number(form.loan_term_months))) {
      setPopupMessage("Loan term must be 6, 12, 18, 24, or 36 months");
      setShowPopup(true);
      return;
    }

    const interestRate = Math.min(
      100,
      Math.max(1, Number(form.desired_interest_rate))
    );

    setLoading(true);

    const payload = {
      car_id: Number(id),
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      phone: form.phone,
      date_of_birth: form.date_of_birth,
      nin: form.nin,
      bvn: form.bvn,
      employment_type: form.employment_type,
      gender: form.gender,
      nationality_status: form.nationality_status,
      nationality: form.nationality,
      state_of_residence: form.state_of_residence,
      equity_contribution: Number(form.equity_contribution),
      desired_monthly_payment: Number(form.desired_monthly_payment),
      desired_interest_rate: interestRate,
      loan_term_months: Number(form.loan_term_months),
      roadworthiness: form.roadworthiness,
      licence_renewal: form.licence_renewal,
      fee_payment_type: form.fee_payment_type,
      upfront_items: form.upfront_items,
      credit_consent: form.credit_consent,
      terms_accepted: form.terms_accepted,
    };

    try {
      await api("/loan-applications", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setPopupMessage("Loan application submitted successfully");
      setShowPopup(true);
    } catch (err) {
      console.error(err);
      setPopupMessage("Failed to submit application");
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form className="page" onSubmit={submit}>
        <h2 className="title">Loan Application</h2>

        <div className="grid">
          <input placeholder="First name" onChange={(e) => update("first_name", e.target.value)} />
          <input placeholder="Last name" onChange={(e) => update("last_name", e.target.value)} />
          <input type="email" placeholder="Email" onChange={(e) => update("email", e.target.value)} />
          <input placeholder="Phone number" onChange={(e) => update("phone", e.target.value)} />
          <input type="date" onChange={(e) => update("date_of_birth", e.target.value)} />

          <select onChange={(e) => update("gender", e.target.value)}>
            <option value="">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <input placeholder="NIN" onChange={(e) => update("nin", e.target.value)} />
          <input placeholder="BVN" onChange={(e) => update("bvn", e.target.value)} />

          <select onChange={(e) => update("employment_type", e.target.value)}>
            <option value="">Employment type</option>
            <option value="salary">Salary</option>
            <option value="business">Business</option>
          </select>

          <input placeholder="Nationality" onChange={(e) => update("nationality", e.target.value)} />
          <input placeholder="State of residence" onChange={(e) => update("state_of_residence", e.target.value)} />

          <select onChange={(e) => update("nationality_status", e.target.value)}>
            <option value="">Nationality status</option>
            <option value="citizen">Citizen</option>
            <option value="resident">Resident</option>
          </select>

          <input type="number" placeholder="Equity contribution" onChange={(e) => update("equity_contribution", e.target.value)} />
          <input type="number" placeholder="Desired monthly payment" onChange={(e) => update("desired_monthly_payment", e.target.value)} />
          <input type="number" placeholder="Interest rate (%)" onChange={(e) => update("desired_interest_rate", e.target.value)} />
          <input type="number" placeholder="Loan term  6, 12, 18, 24, or 36 months" onChange={(e) => update("loan_term_months", e.target.value)} />
        </div>

        <div className="checks">
          <label>
            <input
              type="checkbox"
              onChange={(e) =>
                update(
                  "upfront_items",
                  e.target.checked
                    ? [...form.upfront_items, "plate_number"]
                    : form.upfront_items.filter((i) => i !== "plate_number")
                )
              }
            />
            Plate number
          </label>

          <label>
            <input
              type="checkbox"
              onChange={(e) =>
                update(
                  "upfront_items",
                  e.target.checked
                    ? [...form.upfront_items, "insurance"]
                    : form.upfront_items.filter((i) => i !== "insurance")
                )
              }
            />
            Insurance
          </label>
        </div>

        <div className="checks">
          <label>
            <input type="checkbox" onChange={(e) => update("credit_consent", e.target.checked)} />
            Credit consent
          </label>
          <label>
            <input type="checkbox" onChange={(e) => update("terms_accepted", e.target.checked)} />
            Accept terms
          </label>
        </div>

        <button disabled={loading}>
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>

      {/* 🔥 POPUP OVERLAY */}
      {showPopup && (
        <div className="overlay">
          <div className="popup">
            <p>{popupMessage}</p>
            <button onClick={() => setShowPopup(false)}>OK</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .page {
          max-width: 1200px;
          margin: 40px auto;
          padding: 40px;
          background: #000;
          color: #fff;
          border-radius: 16px;
          border: 1px solid #111;
        }

        .title {
          font-size: 22px;
          margin-bottom: 28px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        input,
        select {
          padding: 14px;
          border-radius: 10px;
          border: 1px solid #111;
          background: #0b0b0b;
          color: #fff;
        }

        .checks {
          margin: 28px 0;
          display: flex;
          gap: 24px;
          font-size: 13px;
          color: #ccc;
        }

        button {
          background: red;
          border: none;
          padding: 16px;
          width: 100%;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          color: #fff;
        }

        button:disabled {
          opacity: 0.6;
        }

        /* POPUP */
        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .popup {
          background: #0b0b0b;
          border: 1px solid #222;
          padding: 30px;
          border-radius: 16px;
          text-align: center;
          max-width: 400px;
          width: 90%;
        }

        .popup p {
          margin-bottom: 20px;
        }

        @media (max-width: 900px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
