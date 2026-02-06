"use client";

export default function AboutUsPage() {
  return (
    <>
      <section className="wrapper">
        {/* HERO */}
        <div className="hero">

          <div className="hero-text">
            <h1>Excellent J&amp;C Autos Parts & Engineering Ltd</h1>
            <p>
              Buy, Sell, Swap &amp; Pre-Order Cars with Confidence.
            </p>
          </div>
        </div>
<div className="spacer" />
        {/* ABOUT CONTENT */}
        <div className="content">
          <h2>Who We Are</h2>
          <p>
            Excellent J&amp;C Autos Parts &amp; Engineering Ltd is a trusted
            automotive company based in Lagos, Nigeria. We specialize in car
            sales, car swap, car pre-orders, and vehicle financing solutions.
            Our mission is to make car ownership accessible, transparent, and
            stress-free for individuals and businesses.
          </p>

          <p>
            With years of experience in the automobile industry and a strong
            network of local and international partners, we help customers
            source quality vehicles from Nigeria, the USA, Canada, South Korea,
            UAE, and other countries.
          </p>

          <h2>What We Do</h2>

          <ul className="services">
            <li>Car Sales (New &amp; Used)</li>
            <li>Car Swap Services</li>
            <li>Pre-Order Cars from Any Country</li>
            <li>Car Loan &amp; Financing Services</li>
            <li>Vehicle Inspection &amp; Verification</li>
          </ul>

          <h2>Why Choose Us</h2>

          <div className="reasons">
            <div className="reason">
              <h4>Trusted &amp; Reliable</h4>
              <p>
                We operate with transparency and integrity, ensuring every
                transaction is clear and secure.
              </p>
            </div>

            <div className="reason">
              <h4>Flexible Payment Options</h4>
              <p>
                Own a car with as low as 40% down payment through our flexible
                financing plans.
              </p>
            </div>

            <div className="reason">
              <h4>Verified Vehicles</h4>
              <p>
                All vehicles are properly inspected to ensure quality and
                authenticity.
              </p>
            </div>

            <div className="reason">
              <h4>Local &amp; International Sourcing</h4>
              <p>
                We source cars locally and internationally to meet your exact
                preference.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ SECTION */}
        <div className="faq">
          <h2 className="faq-title">Frequently Asked Questions</h2>

          <div className="faq-list">
            <div className="faq-item">
              <h4>Where is Excellent J&amp;C Autos located?</h4>
              <p>
                We are located at No. 210 Ago Palace Way, Okota Isolo, Lagos
                State, Nigeria.
              </p>
            </div>

            <div className="faq-item">
              <h4>Do you sell brand new and used cars?</h4>
              <p>
                Yes. We deal in both brand new and carefully inspected used
                vehicles.
              </p>
            </div>

            <div className="faq-item">
              <h4>Can I swap my current car for another one?</h4>
              <p>
                Yes. Our car swap service allows you to exchange your vehicle
                for another based on value assessment.
              </p>
            </div>

            <div className="faq-item">
              <h4>Do you offer car loans?</h4>
              <p>
                Yes. We provide car loan services with flexible down payment
                options.
              </p>
            </div>

            <div className="faq-item">
              <h4>What is the minimum down payment?</h4>
              <p>
                You can own a car with as low as 40% down payment.
              </p>
            </div>

            <div className="faq-item">
              <h4>Can I pre-order cars from abroad?</h4>
              <p>
                Yes. We pre-order vehicles from the USA, Canada, South Korea,
                UAE, and more.
              </p>
            </div>

            <div className="faq-item">
              <h4>How long does pre-order take?</h4>
              <p>
                The timeline depends on vehicle availability and shipping
                logistics.
              </p>
            </div>

            <div className="faq-item">
              <h4>Are inspections mandatory?</h4>
              <p>
                Inspections are highly recommended for faster and safer
                transactions.
              </p>
            </div>

            <div className="faq-item">
              <h4>Do you work with dealers?</h4>
              <p>
                Yes. We partner with verified dealers locally and
                internationally.
              </p>
            </div>

            <div className="faq-item">
              <h4>Is my information safe?</h4>
              <p>
                Yes. All customer information is handled with strict
                confidentiality.
              </p>
            </div>

            <div className="faq-item">
              <h4>Do you operate outside Lagos?</h4>
              <p>
                Yes. We serve customers across Nigeria.
              </p>
            </div>

            <div className="faq-item">
              <h4>Can I request a specific car model?</h4>
              <p>
                Yes. Simply submit a pre-order request with your preference.
              </p>
            </div>

            <div className="faq-item">
              <h4>Do you assist with documentation?</h4>
              <p>
                Yes. We guide customers through all necessary vehicle
                documentation.
              </p>
            </div>

            <div className="faq-item">
              <h4>How can I contact you?</h4>
              <p>
                You can contact us through the website contact form or visit
                our office.
              </p>
            </div>

            <div className="faq-item">
              <h4>Why should I trust Excellent J&amp;C Autos?</h4>
              <p>
                We have a proven track record, verified vehicles, and satisfied
                customers nationwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
/* ================= GLOBAL THEME VARIABLES ================= */
:global(:root) {
  --bg-main: #f5f7fb;
  --bg-card: #ffffff;
  --border-color: #e5e7eb;
  --text-main: #111111;
  --text-muted: #6b7280;
  --accent: red;
  --shadow-card: 0 10px 30px rgba(0, 0, 0, 0.08);
}

:global([data-theme="dark"]) {
  --bg-main: #000000;
  --bg-card: #0b0b0b;
  --border-color: #1f1f1f;
  --text-main: #ffffff;
  --text-muted: #cccccc;
  --accent: red;
  --shadow-card: 0 14px 45px rgba(0, 0, 0, 0.65);
}

/* ================= PAGE WRAPPER ================= */
.wrapper {
  min-height: 100vh;
  background: radial-gradient(
    circle at top,
    var(--bg-card),
    var(--bg-main)
  );
  color: var(--text-main);
  padding-top: 80px;
  padding-bottom: 80px;
}

/* ================= HERO ================= */
.hero {
  position: relative;
}

.hero-text {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
}

.hero-text h1 {
  font-size: 36px;
  color: var(--accent);
  margin-bottom: 10px;
}

.hero-text p {
  color: var(--text-muted);
}

/* ================= CONTENT ================= */
.content {
  max-width: 1000px;
  margin: 60px auto;
  padding: 0 20px;
}

.content h2 {
  color: var(--accent);
  margin-bottom: 16px;
}

.content p {
  color: var(--text-muted);
  line-height: 1.7;
  margin-bottom: 20px;
}

.services {
  list-style: disc;
  padding-left: 20px;
  margin-bottom: 30px;
  color: var(--text-muted);
}

/* ================= REASONS (CARDS) ================= */
.reasons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.reason {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 20px;
  box-shadow: var(--shadow-card);
  color: var(--text-main);
}

/* ================= FAQ ================= */
.faq {
  max-width: 1000px;
  margin: 80px auto 0;
  padding: 0 20px;
}

.faq-title {
  text-align: center;
  color: var(--accent);
  margin-bottom: 40px;
  font-size: 26px;
}

.faq-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.faq-item {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 20px;
  box-shadow: var(--shadow-card);
}

.faq-item p {
  color: var(--text-muted);
  font-size: 14px;
  line-height: 1.6;
}

/* ================= RESPONSIVE ================= */
@media (max-width: 900px) {
  .reasons,
  .faq-list {
    grid-template-columns: 1fr;
  }

  .hero-text h1 {
    font-size: 26px;
  }
}
`}</style>

    </>
  );
}
