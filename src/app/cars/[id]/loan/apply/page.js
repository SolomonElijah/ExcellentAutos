"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";

export default function LoanApplicationForm() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [popup, setPopup] = useState({
    type: "error", // error | success
    message: "",
    whatsappUrl: null,
  });

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
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

    const errors = [];

    if (!form.first_name) errors.push("First name is required");
    if (!form.last_name) errors.push("Last name is required");
    if (!form.email) errors.push("Email address is required");
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
      setPopup({ type: "error", message: errors, whatsappUrl: null });
      setShowPopup(true);
      return;
    }

    setLoading(true);

    const payload = {
      car_id: Number(id),
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      phone: form.phone,
      whatsapp_number: form.whatsapp,
      address: form.address,
      employment_type: form.employment_type,
      gender: form.gender,
      preferred_deposit: form.preferred_deposit,
      loan_term_months: Number(form.preferred_tenure),
      credit_consent: form.credit_consent,
      terms_accepted: form.terms_accepted,
    };

   try {
  const data = await api("/loan-applications", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  setPopup({
    type: "success",
    message: "Loan application submitted successfully",
    whatsappUrl: data.redirect || null,
  });

  setShowPopup(true);
}
 catch (err) {
      console.error(err);
      setPopup({
        type: "error",
        message: "Failed to submit application. Please try again.",
        whatsappUrl: null,
      });
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
            <input type="email" placeholder="Email address" onChange={(e) => update("email", e.target.value)} />
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
            <p>
              I authorize Excellent J&C Autos to access, share, and report my credit
              information with credit bureaus and banking partners.
            </p>
          </div>

          <div className="consent-block">
            <label className="consent-title">
              <input type="checkbox" onChange={(e) => update("terms_accepted", e.target.checked)} />
              <strong>Accept terms</strong>
            </label>
            <p>
              I agree to the <Link href="/terms">terms of service</Link> and{" "}
              <Link href="/privacy">privacy policy</Link>.
            </p>
          </div>

          <button disabled={loading}>
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>

        {showPopup && (
          <div className="overlay">
            <div className={`popup ${popup.type}`}>
              <div className="popup-icon">
                {popup.type === "success" ? "✓" : "⚠"}
              </div>

              <h3>{popup.type === "success" ? "Application Submitted" : "Please fix the following"}</h3>

              {Array.isArray(popup.message) ? (
                <ul>
                  {popup.message.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              ) : (
                <p>{popup.message}</p>
              )}

              {popup.type === "success" && popup.whatsappUrl && (
                <a
                  href={popup.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-btn"
                >
                  Chat on WhatsApp
                </a>
              )}

              <button onClick={() => setShowPopup(false)}>Close</button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .loan-application-namespace {
          padding: 16px;
          padding-top: 96px; /* FIX header overlap */
          min-height: 100dvh;
          scroll-margin-top: 96px;
        }

        .page {
          max-width: 900px;
          margin: auto;
          padding: 20px;
          background: #000;
          color: #fff;
          border-radius: 14px;
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }

        input, select {
          padding: 14px;
          border-radius: 10px;
          background: #0b0b0b;
          border: 1px solid #1a1a1a;
          color: #fff;
          font-size: 16px; /* FIX iOS zoom + shifting */
        }

        .consent-block {
          margin-top: 20px;
          padding: 14px;
          background: #0b0b0b;
          border-radius: 12px;
          border: 1px solid #1a1a1a;
        }

        button {
          width: 100%;
          padding: 16px;
          margin-top: 20px;
          border-radius: 12px;
          border: none;
          background: red;
          color: white;
          font-weight: 600;
        }

        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,.75);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }

        .popup {
          background: #0b0b0b;
          padding: 24px;
          border-radius: 16px;
          width: 90%;
          max-width: 420px;
          text-align: center;
          color: #fff;
        }

        .popup.success { border: 1px solid #00c853; }
        .popup.error { border: 1px solid #ff5252; }

        .popup-icon {
          font-size: 32px;
          margin-bottom: 10px;
        }

        .whatsapp-btn {
          display: block;
          margin-top: 16px;
          padding: 14px;
          border-radius: 12px;
          background: #25D366;
          color: #000;
          font-weight: 700;
          text-decoration: none;
        }

        @media (min-width: 768px) {
          .grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (min-width: 1024px) {
          .grid { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>
    </>
  );
}
