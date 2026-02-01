"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function PreOrderForm() {
  const router = useRouter();
  const { id } = useParams();

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
    if (!form.destination_country) errors.push("Destination country is required");

    if (
      form.budget_min &&
      form.budget_max &&
      Number(form.budget_min) > Number(form.budget_max)
    ) {
      errors.push("Minimum budget cannot be higher than maximum budget");
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
      setPopupMessage("Failed to submit pre-order.");
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  }

  const Field = ({ label, children, locked }) => (
    <div className="field">
      <label className="field__label">
        {label}
        {locked && <span className="locked-badge">Locked</span>}
      </label>
      {children}
    </div>
  );

  return (
    <div className="preorder-form-namespace">
      <form className="preorder-form" onSubmit={submit}>
        <h2>Car Pre-Order Form</h2>

        <div className="preorder-form__grid">
          <Field label="First Name">
            <input className="input" onChange={(e) => update("first_name", e.target.value)} />
          </Field>

          <Field label="Last Name">
            <input className="input" onChange={(e) => update("last_name", e.target.value)} />
          </Field>

          <Field label="Email">
            <input type="email" className="input" onChange={(e) => update("email", e.target.value)} />
          </Field>

          <Field label="Phone Number">
            <input type="tel" className="input" onChange={(e) => update("phone", e.target.value)} />
          </Field>

          <Field label="Brand" locked>
            <input className="input locked" readOnly value={form.brand} />
          </Field>

          <Field label="Model" locked>
            <input className="input locked" readOnly value={form.model} />
          </Field>

          <Field label="Year" locked>
            <input className="input locked" readOnly value={form.year} />
          </Field>

          <Field label="Trim" locked>
            <input className="input locked" readOnly value={form.trim} />
          </Field>

          <Field label="Fuel Type" locked>
            <input className="input locked" readOnly value={form.fuel_type} />
          </Field>

          <Field label="Transmission" locked>
            <input className="input locked" readOnly value={form.transmission} />
          </Field>

          <Field label="Minimum Budget (₦)">
            <input className="input" onChange={(e) => update("budget_min", e.target.value)} />
          </Field>

          <Field label="Maximum Budget (₦)">
            <input className="input" onChange={(e) => update("budget_max", e.target.value)} />
          </Field>

          <Field label="Destination Country">
            <input className="input" onChange={(e) => update("destination_country", e.target.value)} />
          </Field>

          <Field label="Destination Port">
            <input className="input" onChange={(e) => update("destination_port", e.target.value)} />
          </Field>
        </div>

        <div className="field">
          <label className="field__label">Additional Notes</label>
          <textarea className="textarea" onChange={(e) => update("additional_notes", e.target.value)} />
        </div>

        <button className="submit-btn" disabled={loading}>
          {loading ? "Submitting..." : "Submit Pre-Order"}
        </button>
      </form>

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

        .preorder-form__grid {
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

        .submit-btn {
          margin-top: 22px;
          background: red;
          padding: 16px;
          width: 100%;
          border-radius: 10px;
          color: #fff;
          font-weight: 600;
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
