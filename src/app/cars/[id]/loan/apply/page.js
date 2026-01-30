"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";


export default function LoanApplicationForm() {
  const { id } = useParams(); // car_id
  const [loading, setLoading] = useState(false);

  // POPUP STATE
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
    desired_monthly_payment: "",
    desired_interest_rate: "",
    loan_term_months: "",
    roadworthiness: true,
    licence_renewal: true,
    credit_consent: false,
    terms_accepted: false,
  });

  function update(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function submit(e) {
    e.preventDefault();

    /* =========================
       CLIENT-SIDE VALIDATION
    ========================= */
    const errors = [];

    if (!form.first_name) errors.push("First name is required");
    if (!form.last_name) errors.push("Last name is required");
    if (!form.email) errors.push("Email is required");
    if (!form.phone) errors.push("Phone number is required");
    if (!form.date_of_birth) errors.push("Date of birth is required");
    if (!form.nin) errors.push("NIN is required");
    if (!form.bvn) errors.push("BVN is required");
    if (!form.gender) errors.push("Gender is required");
    if (!form.employment_type) errors.push("Employment type is required");
    if (!form.nationality) errors.push("Nationality is required");
    if (!form.state_of_residence) errors.push("State of residence is required");
    if (!form.nationality_status) errors.push("Nationality status is required");

    if (!form.desired_monthly_payment || Number(form.desired_monthly_payment) <= 0) {
      errors.push("Desired monthly payment must be greater than 0");
    }

    if (!form.desired_interest_rate || Number(form.desired_interest_rate) <= 0) {
      errors.push("Interest rate must be greater than 0");
    }

    const allowedTerms = [6, 12, 18, 24, 36];
    if (!allowedTerms.includes(Number(form.loan_term_months))) {
      errors.push("Loan term must be 6, 12, 18, 24, or 36 months");
    }

    if (!form.credit_consent) errors.push("Credit consent must be accepted");
    if (!form.terms_accepted) errors.push("Terms must be accepted");

    // ❌ STOP — DO NOT SEND REQUEST
    if (errors.length > 0) {
      setPopupMessage(errors.join("\n"));
      setShowPopup(true);
      return;
    }

    /* =========================
       SAFE TO SUBMIT
    ========================= */
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
      desired_monthly_payment: Number(form.desired_monthly_payment),
      desired_interest_rate: interestRate,
      loan_term_months: Number(form.loan_term_months),
      roadworthiness: form.roadworthiness,
      licence_renewal: form.licence_renewal,
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
      setPopupMessage("Failed to submit application. Please try again.");
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

          
         <div className="field">
  <label>Date of Birth</label>
  <input
    type="date"
    value={form.date_of_birth}
    onChange={(e) => update("date_of_birth", e.target.value)}
  />
</div>


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

          <input type="number" placeholder="Desired monthly payment" onChange={(e) => update("desired_monthly_payment", e.target.value)} />
          <input type="number" placeholder="Interest rate (%)" onChange={(e) => update("desired_interest_rate", e.target.value)} />
          <input type="number" placeholder="Loan term (6, 12, 18, 24, 36 months)" onChange={(e) => update("loan_term_months", e.target.value)} />
        </div>

        {/* CREDIT CONSENT */}
        <div className="consent-block">
          <label className="consent-title">
            <input
              type="checkbox"
              onChange={(e) => update("credit_consent", e.target.checked)}
            />
            <strong>Credit consent</strong>
          </label>

          <p className="consent-text">
            I hereby consent that Excellent J&C Autos is allowed to make enquiries and access my credit
            information regarding my credit history with any credit bureau. I also consent
            to Excellent J&C Autos sharing my credit information with their banking partners as required
            by law in order to finalise or fulfil my loan agreement as part of this application.
            I consent that Excellent J&C Autos reports the conclusion of any credit agreement with me to
            the relevant credit reporting regulator. I hereby declare that the information
            provided by me is true and correct.
          </p>
        </div>

        {/* ACCEPT TERMS */}
        <div className="consent-block">
          <label className="consent-title">
            <input
              type="checkbox"
              onChange={(e) => update("terms_accepted", e.target.checked)}
            />
            <strong>Accept terms</strong>
          </label>

          <p className="consent-text">
  I agree to the:
  <br />
  (a) terms and Conditions of the platform (
  <Link href="/terms">terms of service</Link>
  ) and the
  <br />
  (b) privacy policy of the platform (
  <Link href="/privacy">privacy policy</Link>
  ).
</p>

        </div>


        <button disabled={loading}>
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>

      {showPopup && (
        <div className="overlay">
          <div className="popup">
            <pre style={{ whiteSpace: "pre-wrap", textAlign: "left" }}>
              {popupMessage}
            </pre>
            <button onClick={() => setShowPopup(false)}>OK</button>
          </div>
        </div>
      )}

      <style>{`
        .page {
          max-width: 1200px;
          margin: 40px auto;
          padding: 40px;
          background: #000;
          color: #fff;
          border-radius: 16px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        input, select {
          padding: 14px;
          border-radius: 10px;
          background: #0b0b0b;
          border: 1px solid #111;
          color: #fff;
        }

        .checks {
          margin: 24px 0;
          display: flex;
          gap: 24px;
          font-size: 13px;
          color: #ccc;
        }

        .checks-note {
          font-size: 0.85rem;
          color: #777;
          margin-top: 20px;
        }

        .consent-block {
  margin-top: 28px;
  padding: 16px;
  border: 1px solid #111;
  border-radius: 12px;
  background: #0b0b0b;
}

.consent-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #fff;
}

.consent-text {
  margin-top: 10px;
  font-size: 13px;
  line-height: 1.6;
  color: #aaa;
}

.consent-text a {
  color: #ff4444;
  text-decoration: underline;
}


        button {
          background: red;
          border: none;
          padding: 16px;
          width: 100%;
          border-radius: 10px;
          font-weight: 600;
          color: #fff;
          margin-top: 16px;
        }

        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.75);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .popup {
          background: #0b0b0b;
          padding: 30px;
          border-radius: 16px;
          text-align: center;
          max-width: 500px;
          width: 90%;
        }

        @media (max-width: 900px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }

        .field {
  display: flex;
  flex-direction: column;
}

.field label {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #ccc;
}
.field input,
.field select {
  font-size: 14px;
  padding: 14px;
  border-radius: 10px;
  background: #0b0b0b;
  border: 1px solid #111;
  color: #fff;
}
.field input:focus,
.field select:focus {
  outline: none;
  border-color: red;
  box-shadow: 0 0 0 1px rgba(255, 0, 0, 0.4);
}


      `}</style>
    </>
  );
}
