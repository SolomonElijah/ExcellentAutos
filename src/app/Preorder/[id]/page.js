"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function PreOrderForm() {
  const router = useRouter();
  const { id } = useParams();

  /* ================= USER INPUT STATE ================= */
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    budget_min: "",
    budget_max: "",
    destination_country: "",
    destination_port: "",
    additional_notes: "",
  });

  /* ================= PREFILLED CAR DATA (LOCKED) ================= */
  const [carData, setCarData] = useState({
    brand: "",
    model: "",
    year: "",
    trim: "",
    fuel_type: "",
    transmission: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState(null);

  /* ================= PREFILL FROM CAR ================= */
  useEffect(() => {
    if (!id) return;

    async function fetchCar() {
      try {
        const res = await api(`/cars/${id}`);
        const car = res.data;

        setCarData({
          brand: car.brand?.name || "",
          model: car.model || "",
          year: car.year ? String(car.year) : "",
          trim: car.trim || "",
          fuel_type: car.fuel_type || "",
          transmission: car.transmission || "",
        });
      } catch (err) {
        console.error("Failed to load car data", err);
      }
    }

    fetchCar();
  }, [id]);

  function update(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  /* ================= SUBMIT ================= */
  async function submit(e) {
    e.preventDefault();

    const errors = [];
    if (!form.first_name) errors.push("First name is required");
    if (!form.last_name) errors.push("Last name is required");
    if (!form.email) errors.push("Email is required");
    if (!form.phone) errors.push("Phone number is required");
    if (!form.destination_country) errors.push("Destination country is required");

    if (
      form.budget_min &&
      form.budget_max &&
      Number(form.budget_min) > Number(form.budget_max)
    ) {
      errors.push("Minimum budget cannot exceed maximum budget");
    }

    if (errors.length) {
      setPopupMessage(errors.join("\n"));
      setShowPopup(true);
      return;
    }

    setLoading(true);

    const payload = {
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      phone: form.phone,

      vehicle_type: "car",

      brand: carData.brand,
      model: carData.model,
      year: carData.year || undefined,
      trim: carData.trim || undefined,
      fuel_type: carData.fuel_type || undefined,
      transmission: carData.transmission || undefined,

      budget_min: form.budget_min ? Number(form.budget_min) : undefined,
      budget_max: form.budget_max ? Number(form.budget_max) : undefined,

      destination_country: form.destination_country,
      destination_port: form.destination_port || undefined,
      additional_notes: form.additional_notes || undefined,

      car_id: id,
    };

    try {
      const res = await api("/pre-orders", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setPopupMessage("Pre-order submitted successfully");
      setWhatsappUrl(res?.redirect || null);
      setShowPopup(true);
    } catch {
      setPopupMessage("Failed to submit pre-order");
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  }

  /* ================= FIELD COMPONENT ================= */
  const Field = ({ label, locked, children }) => (
    <div className="field">
      <label className="field__label">
        {label}
        {locked && <span className="locked-badge">Locked</span>}
      </label>
      {children}
    </div>
  );

  const noAutoFill = {
    autoComplete: "off",
    autoCorrect: "off",
    autoCapitalize: "none",
    spellCheck: false,
  };

  return (
    <div className="preorder-form-namespace">
      <form className="preorder-form" onSubmit={submit} autoComplete="off">
        <h2 className="title">Car Pre-Order Form</h2>

        <div className="grid">
          <Field label="First Name">
            <input className="input" {...noAutoFill} onChange={(e) => update("first_name", e.target.value)} />
          </Field>

          <Field label="Last Name">
            <input className="input" {...noAutoFill} onChange={(e) => update("last_name", e.target.value)} />
          </Field>

          <Field label="Email">
            <input type="email" className="input" {...noAutoFill} onChange={(e) => update("email", e.target.value)} />
          </Field>

          <Field label="Phone Number">
            <input type="tel" className="input" {...noAutoFill} onChange={(e) => update("phone", e.target.value)} />
          </Field>

          <Field label="Brand" locked>
            <input className="input locked" readOnly defaultValue={carData.brand} />
          </Field>

          <Field label="Model" locked>
            <input className="input locked" readOnly defaultValue={carData.model} />
          </Field>

          <Field label="Year" locked>
            <input className="input locked" readOnly defaultValue={carData.year} />
          </Field>

          <Field label="Trim" locked>
            <input className="input locked" readOnly defaultValue={carData.trim} />
          </Field>

          <Field label="Fuel Type" locked>
            <input className="input locked" readOnly defaultValue={carData.fuel_type} />
          </Field>

          <Field label="Transmission" locked>
            <input className="input locked" readOnly defaultValue={carData.transmission} />
          </Field>

          <Field label="Minimum Budget (₦)">
            <input className="input" inputMode="numeric" {...noAutoFill} onChange={(e) => update("budget_min", e.target.value)} />
          </Field>

          <Field label="Maximum Budget (₦)">
            <input className="input" inputMode="numeric" {...noAutoFill} onChange={(e) => update("budget_max", e.target.value)} />
          </Field>

          <Field label="Destination Country">
            <input className="input" {...noAutoFill} onChange={(e) => update("destination_country", e.target.value)} />
          </Field>

          <Field label="Destination Port">
            <input className="input" {...noAutoFill} onChange={(e) => update("destination_port", e.target.value)} />
          </Field>
        </div>

        <div className="field">
          <label className="field__label">Additional Notes</label>
          <textarea className="textarea" {...noAutoFill} onChange={(e) => update("additional_notes", e.target.value)} />
        </div>

        <button className="submit-btn" disabled={loading}>
          {loading ? "Submitting..." : "Submit Pre-Order"}
        </button>
      </form>

      {showPopup && (
        <div className="overlay">
          <div className="popup">
            <pre>{popupMessage}</pre>

            {whatsappUrl && (
              <button className="whatsapp-btn" onClick={() => (window.location.href = whatsappUrl)}>
                Chat Admin on WhatsApp
              </button>
            )}

            <button className="close-btn" onClick={() => router.push("/")}>
              Dismiss
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .preorder-form {
          max-width: 1100px;
          margin: 40px auto;
          padding: 40px;
          background: #000;
          color: #fff;
          border-radius: 16px;
          border: 1px solid #111;
        }

        .title {
          margin-bottom: 24px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .field__label {
          font-size: 13px;
          color: #aaa;
        }

        .locked-badge {
          margin-left: 6px;
          font-size: 11px;
          color: #facc15;
        }

        .input,
        .textarea {
          padding: 14px;
          border-radius: 10px;
          border: 1px solid #111;
          background: #0b0b0b;
          color: #fff;
          font-size: 16px;
        }

        .locked {
          background: #111;
          color: #bbb;
        }

        .textarea {
          min-height: 100px;
        }

        .submit-btn {
          margin-top: 22px;
          background: red;
          padding: 16px;
          width: 100%;
          border-radius: 10px;
          font-weight: 600;
          color: #fff;
        }

        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,.75);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .popup {
          background: #0b0b0b;
          padding: 30px;
          border-radius: 16px;
          width: 90%;
          max-width: 400px;
        }

        .whatsapp-btn {
          background: #25d366;
          padding: 16px;
          width: 100%;
          border-radius: 10px;
          margin-top: 12px;
          color: #fff;
          font-weight: 600;
        }

        .close-btn {
          background: #333;
          padding: 16px;
          width: 100%;
          border-radius: 10px;
          margin-top: 10px;
          color: #fff;
        }

        @media (max-width: 900px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
