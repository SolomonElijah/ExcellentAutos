"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function SellSwapForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState(null);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    location: "",

    type: "sell",

    brand: "",
    model: "",
    year: "",
    condition: "",
    mileage: "",
    expected_price: "",

    desired_car: "",

    inspection_date: "",
    inspection_address: "",
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
      phone: form.phone,
      email: form.email,
      location: form.location,

      type: form.type,

      brand: form.brand,
      model: form.model,
      year: form.year,
      condition: form.condition,
      mileage: Number(form.mileage),
      expected_price: Number(form.expected_price),

      inspection_date: form.inspection_date,
      inspection_address: form.inspection_address,
    };

    if (form.type === "swap") {
      payload.desired_car = form.desired_car;
    }

    try {
      const res = await api("/sell-swap", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setPopupMessage("Request submitted successfully");
      setWhatsappUrl(res?.whatsapp_url || null);
      setShowPopup(true);
    } catch (err) {
      console.error(err);
      setPopupMessage("Failed to submit request. Please try again.");
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form className="page" onSubmit={submit}>
        <h2 className="title">Sell or Swap Your Car</h2>

        {/* CUSTOMER INFO */}
        <div className="grid">
          <input placeholder="First name" onChange={(e) => update("first_name", e.target.value)} />
          <input placeholder="Last name" onChange={(e) => update("last_name", e.target.value)} />
          <input placeholder="Phone number" onChange={(e) => update("phone", e.target.value)} />
          <input type="email" placeholder="Email" onChange={(e) => update("email", e.target.value)} />
          <input placeholder="Location / City" onChange={(e) => update("location", e.target.value)} />
        </div>

        {/* TYPE */}
        <div className="toggle">
          <button
            type="button"
            className={form.type === "sell" ? "active" : ""}
            onClick={() => update("type", "sell")}
          >
            Sell
          </button>
          <button
            type="button"
            className={form.type === "swap" ? "active" : ""}
            onClick={() => update("type", "swap")}
          >
            Swap
          </button>
        </div>

        {/* VEHICLE INFO */}
        <div className="grid">
          <input placeholder="Vehicle brand" onChange={(e) => update("brand", e.target.value)} />
          <input placeholder="Vehicle model" onChange={(e) => update("model", e.target.value)} />
          <input placeholder="Year" onChange={(e) => update("year", e.target.value)} />
          <input placeholder="Condition (Good, Fair, Excellent)" onChange={(e) => update("condition", e.target.value)} />
          <input placeholder="Mileage (km)" onChange={(e) => update("mileage", e.target.value)} />
          <input placeholder="Expected price (₦)" onChange={(e) => update("expected_price", e.target.value)} />
        </div>

        {/* SWAP ONLY */}
        {form.type === "swap" && (
          <div className="grid">
            <input
              placeholder="Desired car (for swap)"
              onChange={(e) => update("desired_car", e.target.value)}
            />
          </div>
        )}


        {/* INSPECTION */}
        <div className="grid">
          <input type="date" onChange={(e) => update("inspection_date", e.target.value)} />
          <input placeholder="Inspection address" onChange={(e) => update("inspection_address", e.target.value)} />
        </div>

        <button disabled={loading}>
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>

      {/* POPUP */}
      {showPopup && (
        <div className="overlay">
          <div className="popup">
            <p>{popupMessage}</p>

            {whatsappUrl && (
              <button
                className="wa"
                onClick={() => (window.location.href = whatsappUrl)}
              >
                Chat Admin on WhatsApp
              </button>
            )}

            <button onClick={() => router.push("/")}>Close</button>
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
          margin-bottom: 30px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 16px;
        }

        input {
          padding: 14px;
          border-radius: 10px;
          border: 1px solid #111;
          background: #0b0b0b;
          color: #fff;
        }
          input {
  box-sizing: border-box;
  width: 100%;
}

   .page .toggle {
  display: flex;
  gap: 12px;
  margin: 20px 0;
}

.page .toggle button {
  flex: 1;
}

        .toggle button {
          flex: 1;
          padding: 14px;
          border-radius: 10px;
          border: 1px solid #111;
          background: #0b0b0b;
          color: #fff;
          cursor: pointer;
        }

        .toggle .active {
          background: red;
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
          margin-top: 16px;
        }

        .wa {
          background: #25d366;
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
