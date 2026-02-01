"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function PreOrderForm() {
  const router = useRouter();
  const { id } = useParams(); // ✅ car ID from route

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
    additional_notes: "",
  });

  /* ================= PREFILL FROM CAR ================= */
  useEffect(() => {
    if (!id) return;

    async function prefillCar() {
      try {
        const res = await api(`/cars/${id}`);
        const car = res.data;

        setForm((f) => ({
          ...f,
          brand: car.brand?.name || "",
          model: car.model || "",
          year: car.year ? String(car.year) : "",
          trim: car.trim || "",
          fuel_type: car.fuel_type || "",
          transmission: car.transmission || "",
        }));
      } catch (err) {
        console.error("Failed to prefill car data", err);
      }
    }

    prefillCar();
  }, [id]);

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
    if (!form.brand) errors.push("Brand is required");
    if (!form.model) errors.push("Model is required");
    if (!form.destination_country) errors.push("Destination country is required");

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
      brand: form.brand,
      model: form.model,
      year: form.year ? Number(form.year) : undefined,
      trim: form.trim || undefined,
      fuel_type: form.fuel_type || undefined,
      transmission: form.transmission || undefined,
      budget_min: form.budget_min ? Number(form.budget_min) : undefined,
      budget_max: form.budget_max ? Number(form.budget_max) : undefined,
      destination_country: form.destination_country,
      destination_port: form.destination_port || undefined,
      additional_notes: form.additional_notes || undefined,
      car_id: id, // ✅ link preorder to car
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
    <div className="preorder-form-namespace">
      <form className="preorder-form" onSubmit={submit}>
        <h2 className="preorder-form__title">Car Pre-Order Form</h2>

        <div className="preorder-form__grid">
          <input className="preorder-form__input" placeholder="First name*" value={form.first_name} onChange={(e) => update("first_name", e.target.value)} />
          <input className="preorder-form__input" placeholder="Last name*" value={form.last_name} onChange={(e) => update("last_name", e.target.value)} />
          <input className="preorder-form__input" type="email" placeholder="Email*" value={form.email} onChange={(e) => update("email", e.target.value)} />
          <input className="preorder-form__input" type="tel" placeholder="Phone number*" value={form.phone} onChange={(e) => update("phone", e.target.value)} />

          <input className="preorder-form__input" placeholder="Brand*" value={form.brand} onChange={(e) => update("brand", e.target.value)} />
          <input className="preorder-form__input" placeholder="Model*" value={form.model} onChange={(e) => update("model", e.target.value)} />
          <input className="preorder-form__input" placeholder="Year (optional)" value={form.year} onChange={(e) => update("year", e.target.value)} />
          <input className="preorder-form__input" placeholder="Trim (optional)" value={form.trim} onChange={(e) => update("trim", e.target.value)} />
          <input className="preorder-form__input" placeholder="Fuel type (optional)" value={form.fuel_type} onChange={(e) => update("fuel_type", e.target.value)} />
          <input className="preorder-form__input" placeholder="Transmission (optional)" value={form.transmission} onChange={(e) => update("transmission", e.target.value)} />

          <input className="preorder-form__input" placeholder="Minimum budget (₦)" value={form.budget_min} onChange={(e) => update("budget_min", e.target.value)} />
          <input className="preorder-form__input" placeholder="Maximum budget (₦)" value={form.budget_max} onChange={(e) => update("budget_max", e.target.value)} />

          <input className="preorder-form__input" placeholder="Destination country*" value={form.destination_country} onChange={(e) => update("destination_country", e.target.value)} />
          <input className="preorder-form__input" placeholder="Destination port (optional)" value={form.destination_port} onChange={(e) => update("destination_port", e.target.value)} />
        </div>

        <textarea
          className="preorder-form__textarea"
          placeholder="Additional notes (optional)"
          value={form.additional_notes}
          onChange={(e) => update("additional_notes", e.target.value)}
        />

        <button className="preorder-form__submit-btn" disabled={loading}>
          {loading ? "Submitting..." : "Submit Pre-Order"}
        </button>
      </form>

      {showPopup && (
        <div className="preorder-form__overlay">
          <div className="preorder-form__popup">
            <pre>{popupMessage}</pre>

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
                router.push("/");
              }}
            >
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

        .preorder-form__title {
          font-size: 22px;
          margin-bottom: 28px;
        }

        .preorder-form__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

       .preorder-form__input,
.preorder-form__textarea {
  padding: 14px;
  border-radius: 10px;
  border: 1px solid #111;
  background: #0b0b0b;
  color: #fff;
  width: 100%;

  font-size: 16px;          /* ✅ STOP mobile zoom */
  line-height: 1.4;
}


        .preorder-form__textarea {
          margin-top: 16px;
          min-height: 100px;
        }

        .preorder-form__submit-btn {
          background: red;
          padding: 16px;
          width: 100%;
          border-radius: 10px;
          margin-top: 12px;
          font-weight: 600;
          cursor: pointer;
           color: #fff;
        }

        .preorder-form__overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .preorder-form__popup {
          background: #0b0b0b;
          padding: 30px;
          border-radius: 16px;
          max-width: 400px;
          width: 90%;
        }

        .preorder-form__whatsapp-btn {
          background: #25d366;
          padding: 16px;
          width: 100%;
          border-radius: 10px;
          margin-top: 10px;
          cursor: pointer;
        }

        .preorder-form__close-btn {
          background: #333;
          padding: 16px;
          width: 100%;
          border-radius: 10px;
          margin-top: 10px;
          cursor: pointer;
        }

        @media (max-width: 900px) {
          .preorder-form__grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
