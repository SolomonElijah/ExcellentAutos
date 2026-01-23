"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";

export default function PreOrderForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState(null);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    brand: "",
    model: "",
    year: "",
    trim: "",
    fuel_type: "",
    transmission: "",
    budget_min: "",
    budget_max: "",
    destination_country: "",
    destination_port: "",
    loan_required: false,
    additional_notes: "",
  });

  function update(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);

    const payload = {
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      phone: form.phone,
      brand: form.brand,
      model: form.model,
      year: form.year || undefined,
      trim: form.trim || undefined,
      fuel_type: form.fuel_type || undefined,
      transmission: form.transmission || undefined,
      budget_min: form.budget_min ? Number(form.budget_min) : undefined,
      budget_max: form.budget_max ? Number(form.budget_max) : undefined,
      destination_country: form.destination_country,
      destination_port: form.destination_port || undefined,
      loan_required: Boolean(form.loan_required),
      additional_notes: form.additional_notes || undefined,
    };

    try {
      const res = await api("/pre-orders", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setPopupMessage("Pre-order submitted successfully");
      setWhatsappUrl(res?.redirect || null);
      setShowPopup(true);
    } catch (err) {
      console.error(err);
      setPopupMessage("Failed to submit pre-order. Please try again.");
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form className="page" onSubmit={submit}>
        <h2 className="title">Vehicle Pre-Order Form</h2>

        <div className="grid">
          <input placeholder="First name" onChange={(e) => update("first_name", e.target.value)} />
          <input placeholder="Last name" onChange={(e) => update("last_name", e.target.value)} />
          <input type="email" placeholder="Email" onChange={(e) => update("email", e.target.value)} />
          <input placeholder="Phone number" onChange={(e) => update("phone", e.target.value)} />
          <input placeholder="Brand" onChange={(e) => update("brand", e.target.value)} />
          <input placeholder="Model" onChange={(e) => update("model", e.target.value)} />

          <input inputMode="numeric" pattern="[0-9]*" placeholder="Year" onChange={(e) => update("year", e.target.value)} />
          <input placeholder="Trim (optional)" onChange={(e) => update("trim", e.target.value)} />

          <input placeholder="Fuel type" onChange={(e) => update("fuel_type", e.target.value)} />
          <input placeholder="Transmission" onChange={(e) => update("transmission", e.target.value)} />

          <input inputMode="numeric" pattern="[0-9]*" placeholder="Minimum budget (₦)" onChange={(e) => update("budget_min", e.target.value)} />
          <input inputMode="numeric" pattern="[0-9]*" placeholder="Maximum budget (₦)" onChange={(e) => update("budget_max", e.target.value)} />

          <input placeholder="Destination country" onChange={(e) => update("destination_country", e.target.value)} />
          <input placeholder="Destination port (optional)" onChange={(e) => update("destination_port", e.target.value)} />
        </div>

        <textarea placeholder="Additional notes (optional)" onChange={(e) => update("additional_notes", e.target.value)} />

        <label className="checkbox">
          <input type="checkbox" onChange={(e) => update("loan_required", e.target.checked)} />
          Loan required
        </label>

        <button disabled={loading}>
          {loading ? "Submitting..." : "Submit Pre-Order"}
        </button>
      </form>

      {/* ✅ POPUP OVERLAY */}
      {showPopup && (
        <div className="overlay">
          <div className="popup">
            <p>{popupMessage}</p>

            {whatsappUrl && (
              <button
                className="wa-btn"
                onClick={() => {
                  window.location.href = whatsappUrl;
                }}
              >
                Chat Admin on WhatsApp
              </button>
            )}

            <button
              onClick={() => {
                setShowPopup(false);
                router.push("/");
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <style >{`
        .page {
          max-width: 1100px;
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
        textarea {
          padding: 14px;
          border-radius: 10px;
          border: 1px solid #111;
          background: #0b0b0b;
          color: #fff;
        }

        textarea {
          margin-top: 16px;
          min-height: 100px;
        }

        .checkbox {
          margin: 20px 0;
          display: flex;
          gap: 8px;
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
          margin-top: 10px;
        }

        .wa-btn {
          background: #25d366;
        }

        button:disabled {
          opacity: 0.6;
        }

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

        @media (max-width: 900px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
