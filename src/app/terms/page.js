"use client";

export default function TermsOfServicePage() {
  return (
    <>
      <section className="wrapper">
        <div className="content">
          <h1>Terms of Service</h1>

          <p className="intro">
            By accessing or using the services provided by Excellent Autos
            Nigeria, you agree to be bound by these Terms of Service. Please
            read them carefully.
          </p>

          <h2>Use of Our Services</h2>
          <p>
            You agree to use our website and services only for lawful purposes
            and in accordance with these terms.
          </p>

          <h2>Service Descriptions</h2>
          <p>
            We provide car sales, car swap, pre-order, inspection facilitation,
            and related automotive services. Availability may vary.
          </p>

          <h2>User Responsibilities</h2>
          <ul>
            <li>Provide accurate and truthful information</li>
            <li>Do not misuse or abuse our services</li>
            <li>Comply with all applicable laws and regulations</li>
          </ul>

          <h2>Pricing & Payments</h2>
          <p>
            Prices, fees, and payment terms will be communicated clearly before
            any transaction is finalized.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            Excellent Autos Nigeria shall not be liable for indirect,
            incidental, or consequential damages arising from the use of our
            services.
          </p>

          <h2>Third-Party Links</h2>
          <p>
            Our website may include links to third-party websites. We are not
            responsible for their content or practices.
          </p>

          <h2>Termination</h2>
          <p>
            We reserve the right to suspend or terminate access to our services
            if these terms are violated.
          </p>

          <h2>Changes to Terms</h2>
          <p>
            We may update these Terms of Service at any time. Continued use of
            our services constitutes acceptance of the updated terms.
          </p>

          
        </div>
      </section>

      <style >{`
        .wrapper {
          min-height: 100vh;
          background: radial-gradient(circle at top, #111, #000);
          color: #fff;
          padding: 80px 20px;
        }

        .content {
          max-width: 900px;
          margin: 0 auto;
        }

        h1 {
          color: red;
          font-size: 32px;
          margin-bottom: 20px;
        }

        h2 {
          color: red;
          margin-top: 30px;
          margin-bottom: 10px;
        }

        p,
        li {
          color: #ccc;
          line-height: 1.7;
          font-size: 14px;
        }

        ul {
          padding-left: 20px;
        }

        .intro {
          font-size: 15px;
          margin-bottom: 30px;
        }

        .footer-note {
          margin-top: 40px;
          font-size: 12px;
          color: #888;
        }
      `}</style>
    </>
  );
}
