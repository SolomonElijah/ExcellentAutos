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
              <option value="">Preferred Loan tenure</option>
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
                  Chat us on WhatsApp to continue
                </a>
              )}

              <button onClick={() => setShowPopup(false)}>Close</button>
            </div>
          </div>
        )}
      </div>

      <style>{`
       /* ================= THEME ================= */
.loan-application-namespace {
  --bg: #ffffff;
  --surface: #ffffff;
  --card: #f9fafb;
  --border: #e5e7eb;

  --text: #111827;
  --muted: #6b7280;

  --accent: #ef4444;
  --success: #22c55e;
  --error: #ef4444;

  padding: 16px;
  padding-top: 96px;
  min-height: 100dvh;
  background: var(--bg);
  color: var(--text);
}

[data-theme="dark"] .loan-application-namespace {
  --bg: #000000;
  --surface: #0b0b0b;
  --card: #0b0b0b;
  --border: #1f2937;

  --text: #ffffff;
  --muted: #9ca3af;
}

/* ================= FORM CARD ================= */
.page {
  max-width: 980px;
  margin: auto;
  padding: 28px;
  background: var(--card);
  border-radius: 20px;
  border: 1px solid var(--border);
}

.title {
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 24px;
}

/* ================= GRID ================= */
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

/* ================= INPUTS ================= */
input,
select {
  width: 100%;
  padding: 14px 16px;
  border-radius: 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text);
  font-size: 16px;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

input::placeholder {
  color: var(--muted);
}

input:focus,
select:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}

/* ================= CONSENT BLOCK (FIXED) ================= */
.consent-block {
  margin-top: 20px;
  padding: 16px;
  background: var(--surface);
  border-radius: 14px;
  border: 1px solid var(--border);
}

.consent-title {
  display: inline-flex;          /* 🔥 FIX: no full-width flex */
  align-items: center;
  gap: 6px;                      /* tighter spacing */
  font-size: 14px;
  margin-bottom: 6px;
}

.consent-title input[type="checkbox"] {
  width: 16px;
  height: 16px;
  margin: 0;                     /* remove browser spacing */
  accent-color: var(--accent);
}

.consent-block p {
  margin: 6px 0 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--muted);
}

.consent-block a {
  color: var(--accent);
  text-decoration: underline;
}

/* ================= SUBMIT ================= */
button {
  width: 100%;
  padding: 16px;
  margin-top: 24px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(135deg, #ef4444, #b91c1c);
  color: #fff;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

button:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 28px rgba(239, 68, 68, 0.35);
}

/* ================= POPUP ================= */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.popup {
  background: var(--surface);
  padding: 26px;
  border-radius: 20px;
  width: 92%;
  max-width: 440px;
  text-align: center;
  border: 1px solid var(--border);
}

.popup.success {
  border-color: var(--success);
}

.popup.error {
  border-color: var(--error);
}

.popup-icon {
  font-size: 36px;
  margin-bottom: 12px;
}

.popup h3 {
  margin-bottom: 12px;
  font-size: 18px;
}

.popup ul {
  text-align: left;
  margin: 12px 0;
  padding-left: 18px;
  color: var(--muted);
}

.popup p {
  color: var(--muted);
}

.popup button {
  margin-top: 16px;
}

/* ================= WHATSAPP ================= */
.whatsapp-btn {
  display: block;
  margin-top: 16px;
  padding: 14px;
  border-radius: 14px;
  background: #25d366;
  color: #000;
  font-weight: 800;
  text-decoration: none;
}

/* ================= RESPONSIVE ================= */
@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .page {
    padding: 36px;
  }
}

      `}</style>
    </>
  );
}
