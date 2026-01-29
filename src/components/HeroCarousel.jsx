"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function CarCarousel() {
  const [slides, setSlides] = useState([]);
  const [isDesktop, setIsDesktop] = useState(false);

  /* ---------------- SCREEN SIZE ---------------- */
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 769);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ---------------- LOAD CAROUSEL (NO CACHE) ---------------- */
  useEffect(() => {
    async function load() {
      try {
        const res = await api("/carousel", {
          headers: {
            Accept: "application/json",
            "Cache-Control": "no-store", // 🚫 no cache
          },
        });

        if (res?.success && Array.isArray(res.data)) {
          setSlides(res.data);
        }
      } catch (err) {
        console.error("Carousel load failed", err);
      }
    }

    load();
  }, []);

  if (!slides.length) return null;

  // duplicate for infinite scroll
  const loopSlides = [...slides, ...slides];

  return (
    <>
      <div className={`carousel ${isDesktop ? "desktop" : "mobile"}`}>
        <div className="track">
          {loopSlides.map((slide, i) => (
            <div className="slide" key={i}>
              <img src={slide.image} alt="" />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        /* ---------- CONTAINER ---------- */
        .carousel {
          width: 100%;
          overflow: hidden;
          margin: 0 auto;
        }

        /* ---------- DESKTOP AUTO SCROLL ---------- */
        .desktop {
          max-width: 1100px;
        }

        .desktop .track {
          display: flex;
          width: max-content;
          gap: 16px;
          animation: scrollLeft 30s linear infinite;
        }

        .desktop .slide {
          width: 340px;
          flex-shrink: 0;
        }

        /* ---------- MOBILE (AUTO SCROLL BUT SMALLER) ---------- */
.mobile {
  padding: 12px 0; /* 🔥 reduce top & bottom space */
}

.mobile .track {
  display: flex;
  width: max-content;
  gap: 12px; 
  animation: scrollLeft 45s linear infinite;
}

.mobile .slide {
  width: 80vw;      
  max-width: 200px;  
  flex-shrink: 0;
  padding: 4px 0;    /* 🔥 reduce vertical padding */
}



        /* ---------- IMAGE ---------- */
        .slide img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
          border-radius: 16px;
        }

        /* ---------- ANIMATION ---------- */
        @keyframes scrollLeft {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </>
  );
}
