"use client";

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="wrapper">
        <div className="content">
          <h1>Privacy Policy</h1>

          <p className="intro">
            At Excellent Autos Nigeria, we respect your privacy and are committed
            to protecting your personal information. This Privacy Policy
            explains how we collect, use, and safeguard your data when you use
            our website and services.
          </p>

          <h2>Information We Collect</h2>
          <p>
            We may collect personal information such as your name, email
            address, phone number, location, and vehicle-related details when
            you submit forms on our website.
          </p>

          <h2>How We Use Your Information</h2>
          <ul>
            <li>To respond to enquiries and service requests</li>
            <li>To process sell, swap, and pre-order requests</li>
            <li>To communicate important updates</li>
            <li>To improve our services and user experience</li>
          </ul>

          <h2>Information Sharing</h2>
          <p>
            We do not sell or rent your personal information. Your details may
            only be shared with trusted partners when necessary to provide a
            requested service.
          </p>

          <h2>Data Security</h2>
          <p>
            We implement reasonable security measures to protect your data
            against unauthorized access, alteration, or disclosure.
          </p>

          <h2>Third-Party Services</h2>
          <p>
            Our website may contain links to third-party services. We are not
            responsible for the privacy practices of those platforms.
          </p>

          <h2>Your Rights</h2>
          <p>
            You have the right to request access to, correction of, or deletion
            of your personal information by contacting us directly.
          </p>

          <h2>Policy Updates</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes
            will be posted on this page.
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
