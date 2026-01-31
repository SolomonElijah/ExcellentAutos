"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function CarCarousel() {
  const [slides, setSlides] = useState([]);
  const [isDesktop, setIsDesktop] = useState(false);

  // Screen detection
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 769);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Load slides from API
  useEffect(() => {
    async function load() {
      try {
        const res = await api("/carousel", {
          headers: { Accept: "application/json" },
        });

        if (res?.success && Array.isArray(res.data)) {
          setSlides(res.data);
        }
      } catch (e) {
        console.error("Carousel load failed", e);
      }
    }

    load();
  }, []);

  if (!slides.length) return null;

  // Duplicate slides ONCE for infinite flow
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

      <style >{`
        /* ---------- CONTAINER ---------- */
       .carousel {
  width: 100%;
  overflow: hidden;
  margin: 0 auto;
}

/* ---------- MOBILE ---------- */
.mobile {
  height: auto;
}

.mobile .track {
  display: flex;
  width: max-content;
  animation: mobileScroll 12s linear infinite;
}

.mobile .slide {
  width: 100vw;
  flex-shrink: 0;
  padding: 16px 0;
}

/* ---------- DESKTOP ---------- */
.desktop {
  max-width: 1100px;
  height: 260px;
}

.desktop .track {
  display: flex;
  width: max-content;
  animation: desktopScroll 30s linear infinite;
}

.desktop .slide {
  width: 340px;
  margin-right: 16px;
  flex-shrink: 0;
}

/* ---------- IMAGE ---------- */
.slide img {
  width: 100%;
  height: 100%;        /* ✅ prevents cropping */
  object-fit: contain;
  display: block;
}

/* ---------- ANIMATION ---------- */
@keyframes mobileScroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

@keyframes desktopScroll {
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
