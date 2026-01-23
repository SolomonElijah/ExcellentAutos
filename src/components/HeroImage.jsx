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
          sizes="100vw"
          className="heroImg"
        />
      </section>

      <style>{`
        .hero {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
        }

        .heroImg {
          object-fit: cover;
          object-position: center;
          transform: scale(1);
          transition: transform 0.3s ease;
        }

        /* MOBILE: zoom image OUT so car looks smaller */
        @media (max-width: 768px) {
          .hero {
            height: 30vh;
          }

          .heroImg {
            object-fit: contain;
            transform: scale(0.9);
          }
        }
      `}</style>
    </>
  );
}
