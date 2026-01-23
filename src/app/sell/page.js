"use client";

import { useRouter } from "next/navigation";

export default function SellLanding() {
  const router = useRouter();

  return (
    <>
      <section className="wrapper">
        {/* HERO SECTION */}
        <div className="hero">
          <h1 className="headline">We Are Here to Help You Sell Your Car</h1>
          <p className="subtext">
            The easiest and most reliable way to sell or swap your car in
            Nigeria. We connect you with verified buyers and handle the process
            professionally from inspection to closing.
          </p>

          <button
            className="primary-cta"
            onClick={() => router.push("/sell/apply")}
          >
            Book an Inspection
          </button>
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
        .wrapper {
          min-height: 100vh;
          background: radial-gradient(circle at top, #111, #000);
          color: #fff;
          padding: 60px 20px;
        }

        .hero {
          max-width: 900px;
          margin: 0 auto 60px;
          text-align: center;
        }

        .headline {
          font-size: 36px;
          font-weight: 700;
          margin-bottom: 20px;
          color: red;
        }

        .subtext {
          font-size: 16px;
          line-height: 1.7;
          color: #ccc;
          margin-bottom: 30px;
        }

        .primary-cta,
        .secondary-cta {
          background: red;
          border: none;
          padding: 16px 44px;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          color: #fff;
        }

        .trust {
          display: flex;
          justify-content: center;
          gap: 30px;
          flex-wrap: wrap;
          margin-bottom: 70px;
          color: green;
          font-size: 14px;
        }

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
          background: #0b0b0b;
          border: 1px solid #111;
          border-radius: 18px;
          padding: 30px;
        }

        .why-card h3 {
          margin-bottom: 12px;
          font-size: 18px;
          color: red;
        }

        .why-card p {
          font-size: 14px;
          line-height: 1.6;
          color: #ccc;
        }

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
          background: #0b0b0b;
          border: 1px solid #111;
          border-radius: 16px;
          padding: 30px 20px;
        }

        .icon {
          font-size: 40px;
          margin-bottom: 16px;
        }

        .final-cta {
          text-align: center;
          padding: 60px 20px;
          border-top: 1px solid #111;
        }

        .final-cta h2 {
          font-size: 28px;
          margin-bottom: 16px;
          color: red;
        }

        .final-cta p {
          color: #ccc;
          margin-bottom: 30px;
        }

        @media (max-width: 900px) {
          .why-grid,
          .steps {
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
