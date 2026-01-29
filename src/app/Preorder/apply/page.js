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
    vehicle_type: "car",
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
    additional_notes: "",
  });

  function update(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function submit(e) {
    e.preventDefault();

    const errors = [];

    if (!form.first_name) errors.push("First name is required");
    if (!form.last_name) errors.push("Last name is required");
    if (!form.email) errors.push("Email is required");
    if (!form.phone) errors.push("Phone number is required");
    if (!form.destination_country) {
      errors.push("Destination country is required");
    }

    if (!form.vehicle_type) {
      errors.push("Vehicle type is required");
    } else if (!["car", "electric_bike", "electric_scooter"].includes(form.vehicle_type)) {
      errors.push("Vehicle type must be: car, electric_bike, or electric_scooter");
    }

    if (form.vehicle_type === "car") {
      if (!form.brand) errors.push("Brand is required for cars");
      if (!form.model) errors.push("Model is required for cars");
    }

    if (form.budget_min && Number(form.budget_min) <= 0) {
      errors.push("Minimum budget must be greater than 0");
    }

    if (form.budget_max && Number(form.budget_max) <= 0) {
      errors.push("Maximum budget must be greater than 0");
    }

    if (
      form.budget_min &&
      form.budget_max &&
      Number(form.budget_min) > Number(form.budget_max)
    ) {
      errors.push("Minimum budget cannot be higher than maximum budget");
    }

    if (errors.length > 0) {
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
      vehicle_type: form.vehicle_type,
      brand: form.brand || undefined,
      model: form.model || undefined,
      year: form.year || undefined,
      trim: form.trim || undefined,
      fuel_type: form.fuel_type || undefined,
      transmission: form.transmission || undefined,
      budget_min: form.budget_min ? Number(form.budget_min) : undefined,
      budget_max: form.budget_max ? Number(form.budget_max) : undefined,
      destination_country: form.destination_country,
      destination_port: form.destination_port || undefined,
      additional_notes: form.additional_notes || undefined,
    };

    if (form.vehicle_type !== "car") {
      if (!form.brand) delete payload.brand;
      if (!form.model) delete payload.model;
    }

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

  const isCar = form.vehicle_type === "car";
  const showCarSpecificFields = form.vehicle_type === "car";

  return (
    <div className="preorder-form-namespace">
      <form className="preorder-form" onSubmit={submit}>
        <h2 className="preorder-form__title">Vehicle Pre-Order Form</h2>

        <div className="preorder-form__grid">
          <input 
            className="preorder-form__input" 
            placeholder="First name*" 
            onChange={(e) => update("first_name", e.target.value)} 
          />
          <input 
            className="preorder-form__input" 
            placeholder="Last name*" 
            onChange={(e) => update("last_name", e.target.value)} 
          />
          <input 
            className="preorder-form__input" 
            type="email" 
            placeholder="Email*" 
            onChange={(e) => update("email", e.target.value)} 
          />
          <input 
            className="preorder-form__input" 
            placeholder="Phone number*" 
            onChange={(e) => update("phone", e.target.value)} 
          />
          
          <div className="preorder-form__vehicle-type">
            <label className="preorder-form__vehicle-type-label">Vehicle Type*</label>
            <div className="preorder-form__radio-group">
              <label className="preorder-form__radio-label">
                <input
                  className="preorder-form__radio-input"
                  type="radio"
                  name="vehicle_type"
                  value="car"
                  checked={form.vehicle_type === "car"}
                  onChange={(e) => update("vehicle_type", e.target.value)}
                />
                Car
              </label>
              <label className="preorder-form__radio-label">
                <input
                  className="preorder-form__radio-input"
                  type="radio"
                  name="vehicle_type"
                  value="electric_bike"
                  checked={form.vehicle_type === "electric_bike"}
                  onChange={(e) => update("vehicle_type", e.target.value)}
                />
                Electric Bike
              </label>
              <label className="preorder-form__radio-label">
                <input
                  className="preorder-form__radio-input"
                  type="radio"
                  name="vehicle_type"
                  value="electric_scooter"
                  checked={form.vehicle_type === "electric_scooter"}
                  onChange={(e) => update("vehicle_type", e.target.value)}
                />
                Electric Scooter
              </label>
            </div>
          </div>

          <input 
            className="preorder-form__input" 
            placeholder={`Brand${isCar ? '*' : ' (optional)'}`} 
            onChange={(e) => update("brand", e.target.value)} 
          />
          <input 
            className="preorder-form__input" 
            placeholder={`Model${isCar ? '*' : ' (optional)'}`} 
            onChange={(e) => update("model", e.target.value)} 
          />

          {showCarSpecificFields && (
            <>
              <input 
                className="preorder-form__input" 
                inputMode="numeric" 
                pattern="[0-9]*" 
                placeholder="Year (optional)" 
                onChange={(e) => update("year", e.target.value)} 
              />
              <input 
                className="preorder-form__input" 
                placeholder="Trim (optional)" 
                onChange={(e) => update("trim", e.target.value)} 
              />
              <input 
                className="preorder-form__input" 
                placeholder="Fuel type (optional)" 
                onChange={(e) => update("fuel_type", e.target.value)} 
              />
              <input 
                className="preorder-form__input" 
                placeholder="Transmission (optional)" 
                onChange={(e) => update("transmission", e.target.value)} 
              />
            </>
          )}

          <input 
            className="preorder-form__input" 
            inputMode="numeric" 
            pattern="[0-9]*" 
            placeholder="Minimum budget (₦)" 
            onChange={(e) => update("budget_min", e.target.value)} 
          />
          <input 
            className="preorder-form__input" 
            inputMode="numeric" 
            pattern="[0-9]*" 
            placeholder="Maximum budget (₦)" 
            onChange={(e) => update("budget_max", e.target.value)} 
          />

          <input 
            className="preorder-form__input" 
            placeholder="Destination country*" 
            onChange={(e) => update("destination_country", e.target.value)} 
          />
          <input 
            className="preorder-form__input" 
            placeholder="Destination port (optional)" 
            onChange={(e) => update("destination_port", e.target.value)} 
          />
        </div>

        <textarea
          className="preorder-form__textarea"
          placeholder="Additional notes (optional)"
          onChange={(e) => update("additional_notes", e.target.value)}
        />

        <button className="preorder-form__submit-btn" disabled={loading}>
          {loading ? "Submitting..." : "Submit Pre-Order"}
        </button>
      </form>

      {showPopup && (
        <div className="preorder-form__overlay">
          <div className="preorder-form__popup">
            <pre style={{ whiteSpace: "pre-wrap", textAlign: "left" }}>
              {popupMessage}
            </pre>

            {whatsappUrl && (
              <button
                className="preorder-form__whatsapp-btn"
                onClick={() => (window.location.href = whatsappUrl)}
              >
                Chat Admin on WhatsApp
              </button>
            )}

            <button
              className="preorder-form__close-btn"
              onClick={() => {
                setShowPopup(false);
                router.push("/Preorder/apply");
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .preorder-form-namespace {
          /* Namespace wrapper */
        }
        
        .preorder-form-namespace .preorder-form {
          max-width: 1100px;
          margin: 40px auto;
          padding: 40px;
          background: #000;
          color: #fff;
          border-radius: 16px;
          border: 1px solid #111;
        }

        .preorder-form-namespace .preorder-form__title {
          font-size: 22px;
          margin-bottom: 28px;
        }

        .preorder-form-namespace .preorder-form__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .preorder-form-namespace .preorder-form__vehicle-type {
          grid-column: 1 / -1;
          margin-bottom: 10px;
        }

        .preorder-form-namespace .preorder-form__vehicle-type-label {
          display: block;
          margin-bottom: 10px;
          font-weight: 500;
        }

        .preorder-form-namespace .preorder-form__radio-group {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .preorder-form-namespace .preorder-form__radio-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .preorder-form-namespace .preorder-form__radio-input {
          margin: 0;
          width: 18px;
          height: 18px;
        }

        .preorder-form-namespace .preorder-form__input {
          padding: 14px;
          border-radius: 10px;
          border: 1px solid #111;
          background: #0b0b0b;
          color: #fff;
          width: 100%;
          box-sizing: border-box;
        }

        .preorder-form-namespace .preorder-form__textarea {
          padding: 14px;
          border-radius: 10px;
          border: 1px solid #111;
          background: #0b0b0b;
          color: #fff;
          width: 100%;
          box-sizing: border-box;
          margin-top: 16px;
          min-height: 100px;
          resize: vertical;
        }

        .preorder-form-namespace .preorder-form__submit-btn {
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

        .preorder-form-namespace .preorder-form__submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .preorder-form-namespace .preorder-form__whatsapp-btn {
          background: #25d366;
          border: none;
          padding: 16px;
          width: 100%;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          color: #fff;
          margin-top: 10px;
        }

        .preorder-form-namespace .preorder-form__close-btn {
          background: #333;
          border: none;
          padding: 16px;
          width: 100%;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          color: #fff;
          margin-top: 10px;
        }

        .preorder-form-namespace .preorder-form__overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .preorder-form-namespace .preorder-form__popup {
          background: #0b0b0b;
          border: 1px solid #222;
          padding: 30px;
          border-radius: 16px;
          max-width: 400px;
          width: 90%;
        }

        .preorder-form-namespace .preorder-form__popup pre {
          margin: 0 0 20px 0;
          font-family: inherit;
          color: #fff;
        }

        @media (max-width: 900px) {
          .preorder-form-namespace .preorder-form__grid {
            grid-template-columns: 1fr;
          }
          .preorder-form-namespace .preorder-form__radio-group {
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
}