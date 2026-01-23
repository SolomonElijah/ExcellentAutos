"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  function update(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      message: form.message,
    };

    try {
      const res = await api("/contact", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (res?.success) {
        setPopupMessage(res.message);
        setShowPopup(true);
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        setPopupMessage("Failed to send message. Please try again.");
        setShowPopup(true);
      }
    } catch (err) {
      console.error(err);
      setPopupMessage("Unable to send message at the moment.");
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="wrapper">
        {/* INTRO */}
        <div className="intro">
          <h1 className="headline">Contact Excellent Autos Nigeria</h1>
          <p className="subtext">
            Have a question, need clarification, or want to learn more about our
            services? Send us a message and our team will respond as soon as
            possible.
          </p>
        </div>

        {/* FORM */}
        <form className="page" onSubmit={submit}>
          <h2 className="title">Send Us a Message</h2>

          <p className="form-note">
            This form is for general enquiries only. If you want to sell, swap,
            or pre-order a car, please use the appropriate service pages.
          </p>

          <div className="grid">
            <input
              placeholder="Your full name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />

            <input
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />

            <input
              placeholder="Phone number"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
          </div>

          <textarea
            placeholder="Write your message here. Include as much detail as possible so we can assist you properly."
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
          />

          <button disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </section>

      {/* POPUP */}
      {showPopup && (
        <div className="overlay">
          <div className="popup">
            <p>{popupMessage}</p>
            <button onClick={() => setShowPopup(false)}>OK</button>
          </div>
        </div>
      )}

      <style >{`
        .wrapper {
          min-height: 100vh;
          background: radial-gradient(circle at top, #111, #000);
          color: #fff;
          padding: 60px 20px;
        }

        .intro {
          max-width: 800px;
          margin: 0 auto 40px;
          text-align: center;
        }

        .headline {
          font-size: 34px;
          font-weight: 700;
          margin-bottom: 16px;
          color: red;
        }

        .subtext {
          font-size: 16px;
          line-height: 1.7;
          color: #ccc;
        }

        .page {
          max-width: 900px;
          margin: 0 auto;
          padding: 40px;
          background: #000;
          border-radius: 16px;
          border: 1px solid #111;
        }

        .title {
          font-size: 22px;
          margin-bottom: 10px;
        }

        .form-note {
          font-size: 14px;
          color: #aaa;
          margin-bottom: 25px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 16px;
        }

        input,
        textarea {
          width: 100%;
          box-sizing: border-box;
          padding: 14px;
          border-radius: 10px;
          border: 1px solid #111;
          background: #0b0b0b;
          color: #fff;
        }

        textarea {
          min-height: 140px;
          margin-bottom: 20px;
          resize: vertical;
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

          .headline {
            font-size: 28px;
          }
        }
      `}</style>
    </>
  );
}
