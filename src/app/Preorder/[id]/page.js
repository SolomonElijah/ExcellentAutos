"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";

const currencyFormatter = new Intl.NumberFormat("en-NG");

export default function PreOrderForm() {
  const router = useRouter();
  const { id } = useParams();

  /* ================= FORM STATE ================= */
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

  const [errors, setErrors] = useState({});
  const debounceTimers = useRef({});

  const [car, setCar] = useState({
    brand: "",
    model: "",
    year: "",
    trim: "",
    fuel_type: "",
    transmission: "",
  });

  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ show: false, message: "", whatsapp: null });

  /* ================= FETCH CAR ================= */
  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const res = await api(`/cars/${id}`);
        const c = res.data;

        setCar({
          brand: c.brand?.name || "",
          model: c.model || "",
          year: c.year ? String(c.year) : "",
          trim: c.trim || "",
          fuel_type: c.fuel_type || "",
          transmission: c.transmission || "",
        });
      } catch (e) {
        console.error("Car fetch failed", e);
      }
    })();
  }, [id]);

  /* ================= DEBOUNCED VALIDATION ================= */
  function validateField(name, value) {
    let message = "";

    if (name === "email" && value) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        message = "Invalid email address";
      }
    }

    if (name === "phone" && value) {
      if (!/^\+?\d{7,15}$/.test(value)) {
        message = "Invalid phone number";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: message }));
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    if (debounceTimers.current[name]) {
      clearTimeout(debounceTimers.current[name]);
    }

    debounceTimers.current[name] = setTimeout(() => {
      validateField(name, value);
    }, 500);
  }

  /* ================= CURRENCY INPUT ================= */
  function handleBudgetChange(e) {
    const { name, value } = e.target;

    const raw = value.replace(/[^\d]/g, "");

    setForm((prev) => ({
      ...prev,
      [name]: raw,
    }));
  }

  function formatCurrency(value) {
    if (!value) return "";
    return `₦${currencyFormatter.format(Number(value))}`;
  }

  /* ================= SUBMIT ================= */
  async function handleSubmit(e) {
    e.preventDefault();

    const submitErrors = {};
    ["first_name", "last_name", "email", "phone", "destination_country"].forEach(
      (field) => {
        if (!form[field]) submitErrors[field] = "This field is required";
      }
    );

    if (
      form.budget_min &&
      form.budget_max &&
      Number(form.budget_min) > Number(form.budget_max)
    ) {
      submitErrors.budget_max = "Maximum must be greater than minimum";
    }

    if (Object.keys(submitErrors).length) {
      setErrors(submitErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await api("/pre-orders", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          vehicle_type: "car",
          ...car,
          budget_min: form.budget_min ? Number(form.budget_min) : undefined,
          budget_max: form.budget_max ? Number(form.budget_max) : undefined,
          car_id: id,
        }),
      });

      setPopup({
        show: true,
        message: "Pre-order submitted successfully",
        whatsapp: res?.redirect || null,
      });
    } catch {
      setPopup({ show: true, message: "Submission failed", whatsapp: null });
    } finally {
      setLoading(false);
    }
  }

  /* ================= RENDER ================= */
  return (
    <div className="wrapper">
      <form className="form" onSubmit={handleSubmit} noValidate>
        <h2>Car Pre-Order Form</h2>

        <div className="grid">
          {[
            ["First Name", "first_name"],
            ["Last Name", "last_name"],
            ["Email", "email"],
            ["Phone Number", "phone"],
          ].map(([label, name]) => (
            <div className="field" key={name}>
              <label>{label}</label>
              <input
                name={name}
                value={form[name]}
                onChange={handleChange}
              />
              {errors[name] && <span className="error">{errors[name]}</span>}
            </div>
          ))}

          {Object.entries(car).map(([key, value]) => (
            <div className="field" key={key}>
              <label>{key.replace("_", " ").toUpperCase()}</label>
              <input value={value} readOnly className="locked" />
            </div>
          ))}

          {[
            ["Minimum Budget (₦)", "budget_min"],
            ["Maximum Budget (₦)", "budget_max"],
          ].map(([label, name]) => (
            <div className="field" key={name}>
              <label>{label}</label>
              <input
                value={formatCurrency(form[name])}
                onChange={handleBudgetChange}
              />
              {errors[name] && <span className="error">{errors[name]}</span>}
            </div>
          ))}

          {[
            ["Destination Country", "destination_country"],
            ["Destination Port", "destination_port"],
          ].map(([label, name]) => (
            <div className="field" key={name}>
              <label>{label}</label>
              <input
                name={name}
                value={form[name]}
                onChange={handleChange}
              />
              {errors[name] && <span className="error">{errors[name]}</span>}
            </div>
          ))}
        </div>

        <div className="field">
          <label>Additional Notes</label>
          <textarea
            name="additional_notes"
            value={form.additional_notes}
            onChange={handleChange}
          />
        </div>

        <button disabled={loading}>
          {loading ? "Submitting…" : "Submit Pre-Order"}
        </button>
      </form>

      {popup.show && (
        <div className="overlay">
          <div className="popup">
            <pre>{popup.message}</pre>

            {popup.whatsapp && (
              <button
                className="whatsapp"
                onClick={() => (window.location.href = popup.whatsapp)}
              >
                Chat admin on WhatsApp
              </button>
            )}

            <button onClick={() => router.push("/")}>Close</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .wrapper {
          padding: 40px;
        }

        .form {
          max-width: 1100px;
          margin: auto;
          background: #000;
          color: #fff;
          padding: 40px;
          border-radius: 16px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .field {
          display: flex;
          flex-direction: column;
        }

        label {
          font-size: 13px;
          margin-bottom: 6px;
          color: #aaa;
        }

        input,
        textarea {
          padding: 14px;
          border-radius: 10px;
          background: #0b0b0b;
          border: 1px solid #111;
          color: #fff;
        }

        .locked {
          background: #111;
          color: #777;
        }

        .error {
          margin-top: 4px;
          font-size: 12px;
          color: #f87171;
        }

        button {
          margin-top: 24px;
          padding: 16px;
          border-radius: 10px;
          background: red;
          color: #fff;
          font-weight: 600;
        }

        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
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

        .whatsapp {
          background: #25d366;
          margin-top: 12px;
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
