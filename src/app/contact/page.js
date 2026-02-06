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

      <style jsx>{`
/* ================= GLOBAL THEME VARIABLES ================= */
:global(:root) {
  --bg-main: #f5f7fb;
  --bg-card: #ffffff;
  --bg-input: #ffffff;
  --border-color: #e5e7eb;
  --text-main: #111111;
  --text-muted: #6b7280;
  --accent: red;
  --shadow-card: 0 10px 30px rgba(0, 0, 0, 0.08);
}

:global([data-theme="dark"]) {
  --bg-main: #000000;
  --bg-card: #0b0b0b;
  --bg-input: #0f0f0f;
  --border-color: #1f1f1f;
  --text-main: #ffffff;
  --text-muted: #cccccc;
  --accent: red;
  --shadow-card: 0 14px 45px rgba(0, 0, 0, 0.65);
}

/* ================= CONTACT PAGE ================= */
.contact-wrapper {
  min-height: 100vh;
  background: radial-gradient(
    circle at top,
    var(--bg-card),
    var(--bg-main)
  );
  color: var(--text-main);
  padding: 90px 20px 70px;
}

/* ================= INTRO ================= */
.contact-intro {
  max-width: 800px;
  margin: 0 auto 40px;
  text-align: center;
}

.contact-headline {
  font-size: 34px;
  font-weight: 700;
  margin-bottom: 16px;
  color: var(--accent);
}

.contact-subtext {
  font-size: 16px;
  line-height: 1.7;
  color: var(--text-muted);
}

/* ================= FORM CARD ================= */
.contact-form {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px;
  background: var(--bg-card);
  border-radius: 18px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-card);
  color: var(--text-main);
}

.contact-title {
  font-size: 22px;
  margin-bottom: 10px;
}

.contact-note {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 25px;
}

/* ================= GRID ================= */
.contact-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

/* ================= INPUTS ================= */
.contact-form input,
.contact-form textarea {
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: var(--bg-input);
  color: var(--text-main);
}

.contact-form input::placeholder,
.contact-form textarea::placeholder {
  color: var(--text-muted);
}

.contact-form textarea {
  min-height: 140px;
  margin-bottom: 20px;
  resize: vertical;
}

/* ================= BUTTON ================= */
.contact-form button {
  background: var(--accent);
  border: none;
  padding: 16px;
  width: 100%;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  color: #ffffff;
}

.contact-form button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ================= POPUP ================= */
.contact-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.contact-popup {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  padding: 30px;
  border-radius: 18px;
  width: 90%;
  max-width: 420px;
  text-align: center;
  box-shadow: var(--shadow-card);
  color: var(--text-main);
}

.contact-popup p,
.contact-popup pre {
  color: var(--text-muted);
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 20px;
  white-space: pre-wrap;
}

.contact-popup button {
  background: var(--accent);
  border: none;
  padding: 12px 18px;
  border-radius: 12px;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
  width: 100%;
}

/* ================= RESPONSIVE ================= */
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
