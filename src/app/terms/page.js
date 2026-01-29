"use client";

export default function TermsOfServicePage() {
  return (
    <>
      <section className="wrapper">
        <div className="content">
          <h1>Terms of Service</h1>

          <p className="intro">
            By accessing or using this website and any services provided by
            Excellent Autos Nigeria, you agree to comply with and be bound by
            these Terms of Service. If you do not agree, please discontinue use
            of our platform.
          </p>

          <h2>Applicability</h2>
          <p>
            These Terms apply to all visitors, users, and customers who access
            or use our website, mobile platforms, and related services.
          </p>

          <h2>Use of Our Services</h2>
          <p>
            You agree to use our website and services only for lawful purposes
            and in a manner that does not infringe the rights of others or
            restrict the use of this platform by other users.
          </p>

          <h2>Service Description</h2>
          <p>
            We provide automotive-related services including vehicle listings,
            car sales facilitation, car swap services, pre-orders, inspections,
            and loan application facilitation. Service availability may vary and
            is subject to change without notice.
          </p>

          <h2>User Responsibilities</h2>
          <ul>
            <li>Provide accurate, complete, and truthful information</li>
            <li>Maintain confidentiality of any login credentials</li>
            <li>Not misuse, abuse, or attempt to disrupt our services</li>
            <li>Comply with all applicable laws and regulations</li>
          </ul>

          <h2>Cookies & Tracking Technologies</h2>
          <p>
            We use cookies and similar technologies to improve user experience,
            analyze traffic, enhance security, and personalize content. By
            using our platform, you consent to our use of cookies. You may
            disable cookies through your browser settings, though this may
            affect site functionality.
          </p>

          <h2>Pricing & Payments</h2>
          <p>
            All prices, fees, and payment terms will be clearly communicated
            before any transaction is completed. Certain services may require
            non-refundable processing or administrative fees.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Excellent Autos Nigeria shall
            not be liable for any indirect, incidental, consequential, or
            special damages arising from the use or inability to use our
            services.
          </p>

          <h2>Intellectual Property</h2>
          <p>
            All content on this website, including text, images, graphics,
            logos, and software, is the intellectual property of the company or
            its licensors. You are granted a limited, non-transferable license
            to view and use the content for personal purposes only.
          </p>

          <h2>User Generated Content</h2>
          <p>
            By submitting content to our platform, you grant us a worldwide,
            non-exclusive, royalty-free license to use, reproduce, and display
            such content. You confirm that your content does not infringe on any
            third-party rights or applicable laws.
          </p>

          <h2>Third-Party Links</h2>
          <p>
            Our website may contain links to third-party websites or services.
            We are not responsible for the content, policies, or practices of
            such third parties.
          </p>

          <h2>Termination</h2>
          <p>
            We reserve the right to suspend or terminate access to our services
            at any time if these Terms are violated or if required by law.
          </p>

          <h2>Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with
            applicable laws. Any disputes arising from these Terms shall be
            subject to the jurisdiction of the appropriate courts.
          </p>

          <h2>Changes to These Terms</h2>
          <p>
            We may revise these Terms of Service at any time. Continued use of
            our services after changes are posted constitutes acceptance of the
            updated Terms.
          </p>
        </div>
      </section>

      <style>{`
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
      `}</style>
    </>
  );
}
