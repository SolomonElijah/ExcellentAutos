"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";

export default function LoanApplicationForm() {
  const { id } = useParams(); // car_id
  const [loading, setLoading] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",                 // ✅ ADDED
    phone: "",
    whatsapp: "",
    employment_type: "",
    gender: "",
    address: "",
    preferred_deposit: "",
    preferred_tenure: "",
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
    if (!form.email) errors.push("Email address is required"); // ✅
    if (!form.phone) errors.push("Phone number is required");
    if (!form.whatsapp) errors.push("WhatsApp number is required");
    if (!form.employment_type) errors.push("Employment type is required");
    if (!form.gender) errors.push("Gender is required");
    if (!form.address) errors.push("Address is required");
    if (!form.preferred_deposit) errors.push("Preferred deposit is required");

    const allowedTenure = [6, 12, 24, 36, 48, 60];
    if (!allowedTenure.includes(Number(form.preferred_tenure))) {
      errors.push("Loan tenure must be 6, 12, 24, 36, 48, or 60 months");
    }

    if (!form.credit_consent) errors.push("Credit consent must be accepted");
    if (!form.terms_accepted) errors.push("Terms must be accepted");

    if (errors.length) {
      setPopupMessage(errors.join("\n"));
      setShowPopup(true);
      return;
    }

    /* =========================
       SUBMIT PAYLOAD (BACKEND SAFE)
    ========================= */
    setLoading(true);

    const payload = {
      car_id: Number(id),

      // Applicant
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email, // ✅
      phone: form.phone,
      whatsapp_number: form.whatsapp,
      address: form.address,

      // ENUM SAFE
      employment_type:
        form.employment_type === "business"
          ? "business_owner"
          : form.employment_type,

      gender: form.gender,

      // Loan
      preferred_deposit: form.preferred_deposit,
      loan_term_months: Number(form.preferred_tenure),

      // Legal
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
      <div className="loan-application-namespace">
        <form className="page" onSubmit={submit}>
          <h2 className="title">Loan Application</h2>

          <div className="grid">
            <input placeholder="First name" onChange={(e) => update("first_name", e.target.value)} />
            <input placeholder="Last name" onChange={(e) => update("last_name", e.target.value)} />

            {/* ✅ EMAIL */}
            <input
              type="email"
              placeholder="Email address"
              onChange={(e) => update("email", e.target.value)}
            />

            <input placeholder="Phone number" onChange={(e) => update("phone", e.target.value)} />
            <input placeholder="WhatsApp number" onChange={(e) => update("whatsapp", e.target.value)} />

            <select onChange={(e) => update("employment_type", e.target.value)}>
              <option value="">Employment type</option>
              <option value="salary">Salary earner</option>
              <option value="business">Business owner</option>
              <option value="self_employed">Self employed</option>
            </select>

            <select onChange={(e) => update("gender", e.target.value)}>
              <option value="">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            <input placeholder="Address" onChange={(e) => update("address", e.target.value)} />

            <select onChange={(e) => update("preferred_deposit", e.target.value)}>
              <option value="">Preferred deposit</option>
              <option value="40%">40%</option>
              <option value="50%">50%</option>
              <option value="60%+">60% and above</option>
            </select>

            <select onChange={(e) => update("preferred_tenure", e.target.value)}>
              <option value="">Loan tenure</option>
              <option value="6">6 months</option>
              <option value="12">12 months</option>
              <option value="24">24 months</option>
              <option value="36">36 months</option>
              <option value="48">48 months</option>
              <option value="60">60 months</option>
            </select>
          </div>

          <div className="consent-block">
            <label className="consent-title">
              <input type="checkbox" onChange={(e) => update("credit_consent", e.target.checked)} />
              <strong>Credit consent</strong>
            </label>
            <p className="consent-text">
              I authorize Excellent J&C Autos to access, share, and report my credit
              information with credit bureaus and banking partners as required to
              process this loan, and confirm all details provided are accurate.
            </p>
          </div>

          <div className="consent-block">
            <label className="consent-title">
              <input type="checkbox" onChange={(e) => update("terms_accepted", e.target.checked)} />
              <strong>Accept terms</strong>
            </label>
            <p className="consent-text">
              I agree to the{" "}
              <Link href="/terms">terms of service</Link> and{" "}
              <Link href="/privacy">privacy policy</Link>.
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
      </div>

      <style>{`
        .loan-application-namespace .page {
          max-width: 1200px;
          margin: 40px auto;
          padding: 40px;
          background: #000;
          color: #fff;
          border-radius: 16px;
        }

        .loan-application-namespace .grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .loan-application-namespace input,
        .loan-application-namespace select {
          padding: 14px;
          border-radius: 10px;
          background: #0b0b0b;
          border: 1px solid #111;
          color: #fff;
        }

        .loan-application-namespace .consent-block {
          margin-top: 28px;
          padding: 16px;
          border: 1px solid #111;
          border-radius: 12px;
          background: #0b0b0b;
        }

        .loan-application-namespace button {
          background: red;
          border: none;
          padding: 16px;
          width: 100%;
          border-radius: 10px;
          color: #fff;
          margin-top: 16px;
        }

        @media (max-width: 900px) {
          .loan-application-namespace .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
