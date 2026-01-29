"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <>
      <section className="hero">
        <Image
          src="/carbg.png"
          alt="Hero car"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 100vw"
          className="heroImg"
        />
      </section>

      <style jsx>{`
        .hero {
          position: relative;
          width: 100%;
          height: 100svh; /* safer than 100vh on mobile */
          overflow: hidden;
        }

        .heroImg {
          object-fit: cover;
          object-position: center;
          transform: scale(1.05);
          transition: transform 0.3s ease;
        }

        /* Tablets */
        @media (max-width: 1024px) {
          .hero {
            height: 60svh;
          }

          .heroImg {
            transform: scale(1);
          }
        }

        /* Mobile */
        @media (max-width: 768px) {
          .hero {
            height: 35svh;
          }

          .heroImg {
            transform: scale(0.9); /* zoom OUT on mobile */
            object-position: center top;
          }
        }

        /* Small phones */
        @media (max-width: 480px) {
          .hero {
            height: 30svh;
          }

          .heroImg {
            transform: scale(0.85);
          }
        }
      `}</style>
    </>
  );
}
