"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="row">
          <div className="block">
            <h4>Useful Links</h4>
            <div className="links">
              <Link href="/sell">Sell & Swap</Link>
              <Link href="/Preorder">Preorder</Link>
              <Link href="/about-us">About Us</Link>
              <Link href="/contact">Contact Us</Link>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>


            </div>
          </div>

          <div className="block">
            <h4>Follow us</h4>
            <div className="social">
              <a href="https://www.instagram.com/excellent_jc_autos?igsh=MTgzdm5zZXd2OTkyOA==" target="_blank" rel="noopener noreferrer">
                <Image src="/insta.png" alt="Facebook" width={26} height={26} />
              </a>

              <a href="https://www.tiktok.com/@excellent_jc_autos?_r=1&_t=ZS-93GlXI9njux" target="_blank" rel="noopener noreferrer">
                <Image src="/tiktok.png" alt="Telegram" width={26} height={26} />
              </a>

              <a href="https://www.facebook.com/share/1KnY1KSKRQ/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">
                <Image src="/fb.png" alt="X" width={26} height={26} />
              </a>
            </div>

          </div>
        </div>

        <div className="bottom">
          © 2026 <strong>Excellent J&C Autos</strong> All rights reserved.
        </div>
      </footer>

      <style >{`
        .footer {
          background: #000;
          border-top: 1px solid red;
          padding: 25px 30px 15px;
          color: #fff;
        }

        .row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          flex-wrap: wrap;
        }

        .block h4 {
          color: red;
          font-size: 14px;
          margin-bottom: 8px;
        }

        .links {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          font-size: 12px;
          color: #ccc;
        }

        .links a {
          color: #ccc;
          text-decoration: none;
        }

        .links a:hover {
          color: #fff;
        }

        .social {
          display: flex;
          gap: 12px;
        }

        .bottom {
          text-align: center;
          font-size: 12px;
          color: #aaa;
          margin-top: 18px;
          padding-top: 10px;
          border-top: 1px solid #111;
        }

        /* MOBILE */
        @media (max-width: 768px) {
          .row {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .links {
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
}
