"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

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

  /* ================= HANDLERS ================= */
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const errors = [];
    if (!form.first_name) errors.push("First name required");
    if (!form.last_name) errors.push("Last name required");
    if (!form.email) errors.push("Email required");
    if (!form.phone) errors.push("Phone required");
    if (!form.destination_country) errors.push("Destination country required");

    if (
      form.budget_min &&
      form.budget_max &&
      Number(form.budget_min) > Number(form.budget_max)
    ) {
      errors.push("Min budget cannot exceed max budget");
    }

    if (errors.length) {
      setPopup({ show: true, message: errors.join("\n"), whatsapp: null });
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
            ["Email", "email", "email"],
            ["Phone Number", "phone", "tel"],
          ].map(([label, name, type = "text"]) => (
            <div className="field" key={name}>
              <label htmlFor={name}>{label}</label>
              <input
                id={name}
                name={name}
                type={type}
                value={form[name]}
                onChange={handleChange}
              />
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
            ["Destination Country", "destination_country"],
            ["Destination Port", "destination_port"],
          ].map(([label, name]) => (
            <div className="field" key={name}>
              <label htmlFor={name}>{label}</label>
              <input
                id={name}
                name={name}
                value={form[name]}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>

        <div className="field">
          <label htmlFor="notes">Additional Notes</label>
          <textarea
            id="notes"
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
                Chat on WhatsApp
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

        h2 {
          margin-bottom: 24px;
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
          font-size: 16px;
        }

        .locked {
          background: #111;
          color: #888;
        }

        textarea {
          min-height: 120px;
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
