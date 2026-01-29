"use client";

import { useRouter } from "next/navigation";

export default function PreOrderLanding() {
  const router = useRouter();

  return (
    <>
      <section className="wrapper">
        {/* HERO */}
        <div className="preorder-hero">
          <div className="preorder-hero-content">
            <h1 className="preorder-headline">
              Pre-Order Your Car With Confidence
            </h1>

            <p className="preorder-subtext">
              Looking for a specific car? Excellent Autos Nigeria helps you pre-order
              quality vehicles from trusted sources, inspect them properly, and deliver
              safely to your destination.
            </p>

            <button
              className="primary-cta"
              onClick={() => router.push("/Preorder/apply")}
            >
              Start Pre-Order
            </button>
          </div>

          <div className="preorder-hero-image">
            <img src="/PreOrderPics.png" alt="Pre-order a car" />
          </div>
        </div>


        {/* TRUST STRIP */}
        <div className="trust">
          <span>✔ Trusted sourcing partners</span>
          <span>✔ Thorough vehicle inspection</span>
          <span>✔ Nationwide & international delivery</span>
        </div>

        {/* HOW IT WORKS */}
        <div className="steps-section">
          <h2 className="title">How Pre-Order Works</h2>

          <div className="steps">
            {/* STEP 1 */}
            <div className="step">
              <div className="icon">📝</div>
              <h3>Submit Your Request</h3>
              <p className="text">
                Fill the pre-order form with your preferred brand, model,
                budget, fuel type, and destination details.
              </p>
            </div>

            {/* STEP 2 */}
            <div className="step">
              <div className="icon">📞</div>
              <h3>Get Expert Feedback</h3>
              <p className="text">
                Our sourcing team reviews your request and contacts you within
                24 hours with availability and recommendations.
              </p>
            </div>

            {/* STEP 3 */}
            <div className="step">
              <div className="icon">🚗</div>
              <h3>Sourcing & Inspection</h3>
              <p className="text">
                We source the vehicle, conduct proper inspection, verify
                documents, and confirm condition before proceeding.
              </p>
            </div>
          </div>
        </div>

        {/* VALUE SECTION */}
        <div className="value">
          <h2>Why Pre-Order With Us?</h2>

          <div className="value-grid">
            <div className="value-card">
              <h4>No Guesswork</h4>
              <p>
                You get clear information, inspection reports, and guidance
                before making any payment.
              </p>
            </div>

            <div className="value-card">
              <h4>Access to More Options</h4>
              <p>
                Pre-ordering gives you access to vehicles not publicly listed
                in the market.
              </p>
            </div>

            <div className="value-card">
              <h4>Secure Delivery</h4>
              <p>
                We handle shipping and delivery logistics to ensure your car
                arrives safely.
              </p>
            </div>
          </div>
        </div>

        {/* FINAL CTA */}
        <div className="final-cta">
          <h2>Ready to Get Your Car?</h2>
          <p>
            Start your pre-order today and let our team handle the rest.
          </p>

          <button
            className="secondary-cta"
            onClick={() => router.push("/Preorder/apply")}
          >
            Proceed to Pre-Order
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
          color: #fff;
          border: none;
          padding: 16px 44px;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
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

        .steps-section {
          max-width: 1000px;
          margin: 0 auto 80px;
          text-align: center;
        }

        .title {
          font-size: 26px;
          margin-bottom: 50px;
          font-weight: 600;
        }

        .steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
        }

        .step {
          background: #0b0b0b;
          border: 1px solid #111;
          border-radius: 18px;
          padding: 30px 20px;
        }

        .step h3 {
          margin: 10px 0;
          font-size: 17px;
          color: red;
        }

        .icon {
          font-size: 40px;
          margin-bottom: 12px;
        }

        .text {
          font-size: 14px;
          line-height: 1.6;
          color: #ccc;
        }

        .value {
          max-width: 1000px;
          margin: 0 auto 80px;
          text-align: center;
        }

        .value h2 {
          font-size: 26px;
          margin-bottom: 40px;
        }

        .value-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }

        .value-card {
          background: #0b0b0b;
          border: 1px solid #111;
          border-radius: 18px;
          padding: 30px;
        }

        .value-card h4 {
          color: red;
          margin-bottom: 10px;
        }

        .value-card p {
          font-size: 14px;
          color: #ccc;
          line-height: 1.6;
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
          .steps,
          .value-grid {
            grid-template-columns: 1fr;
          }

          .headline {
            font-size: 28px;
          }
        }


        /* ================= PREORDER HERO ================= */

.preorder-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  padding: 30px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.preorder-hero-content {
  max-width: 520px;
}

.preorder-headline {
  font-size: 40px;
  font-weight: 700;
  color: red;
  margin-bottom: 16px;
}

.preorder-subtext {
  font-size: 15px;
  line-height: 1.7;
  color: #ccc;
  margin-bottom: 24px;
}

.preorder-hero-image img {
  max-width: 480px;
  width: 90%;
  height: auto;
  display: block;
}

/* ===== MOBILE ===== */
@media (max-width: 900px) {
  .preorder-hero {
    flex-direction: column;
    text-align: center;
  }

  .preorder-hero-image {
    display: none; /* 🔥 hide image on phones */
  }

  .preorder-headline {
    font-size: 26px;
  }
}

      `}</style>
    </>
  );
}
