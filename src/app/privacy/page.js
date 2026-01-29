"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function PrivacyPolicyPage() {
  const [companyName, setCompanyName] = useState("Our Company");

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await api("/site-settings", {
          headers: {
            Accept: "application/json",
            "Cache-Control": "no-store", // 🚫 no cache
          },
        });

        if (res?.data?.site_name) {
          setCompanyName(res.data.site_name);
        }
      } catch (err) {
        console.error("Failed to load site settings", err);
      }
    }

    loadSettings();
  }, []);

  return (
    <>
      <section className="wrapper">
        <div className="content">
          <h1>Privacy Policy</h1>

          <p className="intro">
            Thank you for choosing to be part of our community at{" "}
            <strong>{companyName}</strong>. We are committed to protecting your
            personal information and respecting your right to privacy. This
            Privacy Policy explains how we collect, use, disclose, and safeguard
            your information when you use our website, applications, and
            services.
          </p>

          <h2>Information We Collect</h2>
          <p>
            We collect personal information that you voluntarily provide to us
            when you register, submit forms, apply for services, or communicate
            with us. This may include your name, email address, phone number,
            address, vehicle details, identification documents, and other
            relevant information.
          </p>

          <h2>Automatically Collected Information</h2>
          <p>
            When you visit our platform, certain information is automatically
            collected, such as IP address, browser type, device information,
            operating system, and usage data. This information helps us maintain
            security, improve performance, and enhance user experience.
          </p>

          <h2>How We Use Your Information</h2>
          <ul>
            <li>To respond to enquiries and customer requests</li>
            <li>To process car sales, swaps, pre-orders, and loan applications</li>
            <li>To communicate updates, notifications, and service information</li>
            <li>To improve our services, products, and user experience</li>
            <li>To comply with legal and regulatory obligations</li>
          </ul>

          <h2>Sharing of Information</h2>
          <p>
            We do not sell or rent your personal information. Your data may only
            be shared with trusted partners, financial institutions, or service
            providers strictly for service delivery, compliance with law, or
            protection of legal rights.
          </p>

          <h2>Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to
            protect your personal data against unauthorized access, misuse,
            alteration, or disclosure. However, no system can be completely
            secure, and transmission of data is at your own risk.
          </p>

          <h2>Third-Party Services</h2>
          <p>
            Our website may contain links to third-party websites or services.
            We are not responsible for the privacy practices or content of those
            platforms and encourage you to review their policies separately.
          </p>

          <h2>Your Privacy Rights</h2>
          <p>
            Depending on applicable data protection laws, you may have the right
            to access, correct, restrict, or request deletion of your personal
            information. You may also withdraw consent where processing is based
            on consent.
          </p>

          <h2>Cookies & Tracking Technologies</h2>
          <p>
            We use cookies and similar technologies to enhance functionality,
            analyze usage, and improve our services. You can control cookie
            preferences through your browser settings.
          </p>

          <h2>Updates to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to remain
            compliant with applicable laws. Any changes will be posted on this
            page and become effective immediately upon publication.
          </p>

          <h2>Contact Information</h2>
          <p>
            If you have questions or concerns about this Privacy Policy or how
            your data is handled, please contact:
          </p>

          <p className="contact-block">
            <strong>Excellent J&C Autos</strong><br />
           📍 No 210 Ago Palace way Oshodi- Isolo Beside Greenfield Estate Lagos, Nigeria, Lagos, Nigeria 100261
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

        .contact-block {
          margin-top: 15px;
          font-size: 14px;
          color: #bbb;
        }
      `}</style>
    </>
  );
}
