"use client";

import { useRouter } from "next/navigation";

export default function SellLanding() {
  const router = useRouter();

  return (
    <>
      <section className="wrapper">
        {/* HERO SECTION */}
        <div className="sell-hero">
          <div className="sell-hero-content">
            <h1 className="sell-headline">
              We Are Here to Help You Sell Your Car
            </h1>

            <p className="sell-subtext">
              The easiest and most reliable way to sell or swap your car in Nigeria.
              We connect you with verified buyers and handle the process professionally
              from inspection to closing.
            </p>

            <button
              className="primary-cta"
              onClick={() => router.push("/sell/apply")}
            >
              Book an Inspection
            </button>
          </div>

          <div className="sell-hero-image">
            <img src="/sellpics.png" alt="Sell your car" />
          </div>
        </div>


        {/* TRUST INDICATORS */}
        <div className="trust">
          <span>✔ Trusted car dealers</span>
          <span>✔ Fast inspection process</span>
          <span>✔ Transparent pricing</span>
        </div>

        {/* WHY SECTION */}
        <div className="why">
          <h2>Why Sell With Excellent Autos Nigeria?</h2>

          <div className="why-grid">
            <div className="why-card">
              <h3>Faster Sales</h3>
              <p>
                Cars inspected by Excellent Autos Nigeria sell significantly
                faster than cars without inspection.
              </p>
            </div>

            <div className="why-card">
              <h3>Fair Market Value</h3>
              <p>
                We help you price your car correctly to attract serious buyers
                without undervaluing your vehicle.
              </p>
            </div>

            <div className="why-card">
              <h3>Stress-Free Process</h3>
              <p>
                We handle buyer screening, inspection and negotiation so you
                don’t have to deal with unserious calls.
              </p>
            </div>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className="steps-section">
          <h2>How It Works</h2>

          <div className="steps">
            <div className="step">
              <div className="icon">📝</div>
              <p>
                Submit your vehicle details and choose whether you want to sell
                or swap.
              </p>
            </div>

            <div className="step">
              <div className="icon">🔍</div>
              <p>
                Our team inspects your vehicle at your preferred location and
                verifies its condition.
              </p>
            </div>

            <div className="step">
              <div className="icon">🤝</div>
              <p>
                We connect you with verified buyers or swap options and guide
                you through the final process.
              </p>
            </div>
          </div>
        </div>

        {/* FINAL CTA */}
        <div className="final-cta">
          <h2>Ready to Sell or Swap Your Car?</h2>
          <p>
            Book an inspection today and let our team handle everything for you.
          </p>

          <button
            className="secondary-cta"
            onClick={() => router.push("/sell/apply")}
          >
            Start Sell / Swap Request
          </button>
        </div>
      </section>

      <style >{`
        /* ================= THEME VARIABLES ================= */
:root {
  --bg: #ffffff;
  --surface: #ffffff;
  --card: #f9fafb;
  --border: #e5e7eb;

  --text: #111827;
  --muted: #6b7280;

  --accent: #ef4444;
  --accent-hover: #cc0000;

  --success: #16a34a;
}

[data-theme="dark"] {
  --bg: #000000;
  --surface: #0b0b0b;
  --card: #0b0b0b;
  --border: #111;

  --text: #ffffff;
  --muted: #cccccc;
}

/* ================= PAGE ================= */
.wrapper {
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  padding: 60px 20px;
}

/* ================= SELL HERO ================= */
.sell-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  padding: 30px 20px;
  max-width: 1200px;
  margin: 0 auto 60px;
}

.sell-hero-content {
  max-width: 520px;
}

.sell-headline {
  font-size: 40px;
  font-weight: 800;
  color: var(--accent);
  margin-bottom: 16px;
}

.sell-subtext {
  font-size: 15px;
  line-height: 1.7;
  color: var(--muted);
  margin-bottom: 24px;
}

.sell-hero-image img {
  max-width: 480px;
  width: 90%;
  height: auto;
  display: block;
}

/* ================= CTA ================= */
.primary-cta,
.secondary-cta {
  background: var(--accent);
  border: none;
  padding: 16px 44px;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  color: #fff;
}

.primary-cta:hover,
.secondary-cta:hover {
  background: var(--accent-hover);
}

/* ================= TRUST ================= */
.trust {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
  margin-bottom: 70px;
  color: var(--success);
  font-size: 14px;
}

/* ================= WHY ================= */
.why {
  max-width: 1000px;
  margin: 0 auto 80px;
  text-align: center;
}

.why h2 {
  font-size: 26px;
  margin-bottom: 40px;
}

.why-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.why-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 30px;
}

.why-card h3 {
  margin-bottom: 12px;
  font-size: 18px;
  color: var(--accent);
}

.why-card p {
  font-size: 14px;
  line-height: 1.6;
  color: var(--muted);
}

/* ================= STEPS ================= */
.steps-section {
  max-width: 900px;
  margin: 0 auto 80px;
  text-align: center;
}

.steps-section h2 {
  font-size: 26px;
  margin-bottom: 50px;
}

.steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

.step {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 30px 20px;
}

.icon {
  font-size: 40px;
  margin-bottom: 16px;
}

/* ================= FINAL CTA ================= */
.final-cta {
  text-align: center;
  padding: 60px 20px;
  border-top: 1px solid var(--border);
}

.final-cta h2 {
  font-size: 28px;
  margin-bottom: 16px;
  color: var(--accent);
}

.final-cta p {
  color: var(--muted);
  margin-bottom: 30px;
}

/* ================= RESPONSIVE ================= */
@media (max-width: 900px) {
  .sell-hero {
    flex-direction: column;
    text-align: center;
  }

  .sell-hero-image {
    display: none;
  }

  .sell-headline {
    font-size: 26px;
  }

  .why-grid,
  .steps {
    grid-template-columns: 1fr;
  }
}

      `}</style>
    </>
  );
}
