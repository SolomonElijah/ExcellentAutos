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

    /* =========================
       CLIENT-SIDE VALIDATION
    ========================= */
    const errors = [];

    if (!form.name) errors.push("Full name is required");
    if (!form.email) errors.push("Email address is required");
    if (!form.phone) errors.push("Phone number is required");
    if (!form.message) errors.push("Message cannot be empty");

    // simple email sanity check
    if (
      form.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      errors.push("Please enter a valid email address");
    }

    // ❌ STOP if any error
    if (errors.length > 0) {
      setPopupMessage(errors.join("\n"));
      setShowPopup(true);
      return;
    }

    /* =========================
       SAFE TO SUBMIT
    ========================= */
    setLoading(true);

    try {
      const res = await api("/contact", {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (res?.success) {
        setPopupMessage(res.message || "Message sent successfully");
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        setPopupMessage("Failed to send message. Please try again.");
      }
    } catch {
      setPopupMessage("Unable to send message at the moment.");
    } finally {
      setShowPopup(true);
      setLoading(false);
    }
  }

  return (
    <>
      <section className="contact-wrapper">
        {/* INTRO */}
        <div className="contact-intro">
          <h1 className="contact-headline">
            Contact Excellent Autos Nigeria
          </h1>
          <p className="contact-subtext">
            Have a question, need clarification, or want to learn more about our
            services? Send us a message and our team will respond as soon as
            possible.
          </p>
        </div>

        {/* FORM */}
        <form className="contact-form" onSubmit={submit}>
          <h2 className="contact-title">Send Us a Message</h2>

          <p className="contact-note">
            This form is for general enquiries only.
          </p>

          <div className="contact-grid">
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
            placeholder="Write your message here. Include as much detail as possible."
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
        <div className="contact-overlay">
          <div className="contact-popup">
            <pre style={{ whiteSpace: "pre-wrap", textAlign: "left" }}>
              {popupMessage}
            </pre>
            <button onClick={() => setShowPopup(false)}>OK</button>
          </div>
        </div>
      )}

      <style>{`
        /* ================= CONTACT PAGE ONLY ================= */

        .contact-wrapper {
          min-height: 100vh;
          background: radial-gradient(circle at top, #111, #000);
          color: #fff;
          padding: 90px 20px 70px;
        }

        .contact-intro {
          max-width: 800px;
          margin: 0 auto 40px;
          text-align: center;
        }

        .contact-headline {
          font-size: 34px;
          font-weight: 700;
          margin-bottom: 16px;
          color: red;
        }

        .contact-subtext {
          font-size: 16px;
          line-height: 1.7;
          color: #ccc;
        }

        .contact-form {
          max-width: 900px;
          margin: 0 auto;
          padding: 40px;
          background: #000;
          border-radius: 16px;
          border: 1px solid #111;
        }

        .contact-title {
          font-size: 22px;
          margin-bottom: 10px;
        }

        .contact-note {
          font-size: 14px;
          color: #aaa;
          margin-bottom: 25px;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 16px;
        }

        .contact-form input,
        .contact-form textarea {
          width: 100%;
          padding: 14px;
          border-radius: 10px;
          border: 1px solid #111;
          background: #0b0b0b;
          color: #fff;
        }

        .contact-form textarea {
          min-height: 140px;
          margin-bottom: 20px;
          resize: vertical;
        }

        .contact-form button {
          background: red;
          border: none;
          padding: 16px;
          width: 100%;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          color: #fff;
        }

        .contact-form button:disabled {
          opacity: 0.6;
        }

        /* POPUP */
       .contact-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.contact-popup {
  background: #0b0b0b;
  border: 1px solid #222;
  padding: 30px;
  border-radius: 16px;
  width: 90%;
  max-width: 420px;
  text-align: center;
}

.contact-popup p,
.contact-popup pre {
  color: #fff;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 20px;
  white-space: pre-wrap;
}

.contact-popup button {
  background: red;
  border: none;
  padding: 12px 18px;
  border-radius: 10px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  width: 100%;
}


        @media (max-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr;
          }

          .contact-headline {
            font-size: 28px;
          }
        }
      `}</style>
    </>
  );
}
