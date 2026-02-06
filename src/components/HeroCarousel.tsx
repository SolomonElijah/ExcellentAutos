"use client";

import useSWR from "swr";
import { useEffect, useRef, useState } from "react";
import { fetchCarousel } from "../lib/carouselFetcher";

type Slide = {
  image: string;
  fallback?: string;
  link?: string | null;
};

type CarouselResponse = {
  success: boolean;
  version: number;
  data: Slide[];
};

const AUTO_PLAY_INTERVAL = 5000; // 5 seconds
const SWIPE_THRESHOLD = 50; // px

export default function HeroCarousel() {
  const { data, error, isLoading } = useSWR<CarouselResponse>(
    "carousel",
    fetchCarousel,
    {
      dedupingInterval: 60_000,
      refreshInterval: 120_000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  const [slides, setSlides] = useState<Slide[]>([]);
  const [version, setVersion] = useState<number | null>(null);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ---------- VERSION-AWARE UPDATE ---------- */
  useEffect(() => {
    if (!data) return;

    if (data.version !== version) {
      setSlides(data.data);
      setVersion(data.version);
      setCurrent(0);
    }
  }, [data, version]);

  /* ---------- AUTO PLAY ---------- */
  useEffect(() => {
    if (paused || slides.length <= 1) return;

    intervalRef.current = setInterval(() => {
      setCurrent((i) => (i + 1) % slides.length);
    }, AUTO_PLAY_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused, slides]);

  /* ---------- PRELOAD NEXT IMAGE ---------- */
  useEffect(() => {
    if (!slides.length) return;
    const nextIndex = (current + 1) % slides.length;
    const img = new Image();
    img.src = slides[nextIndex].image;
  }, [current, slides]);

  /* ---------- CONTROLS ---------- */
  const next = () => {
    if (!slides.length) return;
    setCurrent((i) => (i + 1) % slides.length);
  };

  const prev = () => {
    if (!slides.length) return;
    setCurrent((i) => (i === 0 ? slides.length - 1 : i - 1));
  };

  /* ---------- TOUCH HANDLERS ---------- */
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;

    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      diff > 0 ? next() : prev();
    }

    touchStartX.current = null;
  };

  /* ---------- SKELETON ---------- */
  if (isLoading) {
    return (
      <div className="carousel skeleton">
        <div className="skeleton-img" />
        <style>{skeletonStyles}</style>
      </div>
    );
  }

  if (error || !slides.length) return null;

  return (
    <>
      <div
        className="carousel"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="slide">
          <img
            src={slides[current].image}
            alt=""
            loading={current === 0 ? "eager" : "lazy"}
            decoding="async"
          />
        </div>

        {slides.length > 1 && (
          <>
            <button className="nav prev" onClick={prev} aria-label="Previous slide">
              ‹
            </button>
            <button className="nav next" onClick={next} aria-label="Next slide">
              ›
            </button>

            <div className="dots">
              {slides.map((_, i) => (
                <button
                  key={i}
                  className={`dot ${i === current ? "active" : ""}`}
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <style>{carouselStyles}</style>
    </>
  );
}

/* ================= STYLES ================= */

const carouselStyles = `
/* ===== THEME TOKENS ===== */
:root {
  --carousel-bg: #ffffff;
  --carousel-border: rgba(0, 0, 0, 0.15);
  --carousel-shadow: 0 18px 40px rgba(0, 0, 0, 0.12);
  --carousel-nav-bg: rgba(255, 255, 255, 0.9);
  --carousel-nav-text: #000000;
  --carousel-dot: rgba(0, 0, 0, 0.35);
}

[data-theme="dark"] {
  --carousel-bg: #000000;
  --carousel-border: rgba(255, 255, 255, 0.15);
  --carousel-shadow: 0 22px 55px rgba(0, 0, 0, 0.85);
  --carousel-nav-bg: rgba(0, 0, 0, 0.8);
  --carousel-nav-text: #ffffff;
  --carousel-dot: rgba(255, 255, 255, 0.45);
}

/* ===== CAROUSEL ===== */
.carousel {
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  background: var(--carousel-bg);
  border-radius: 20px;
  border: 1px solid var(--carousel-border);
  box-shadow: var(--carousel-shadow);
  overflow: hidden;
}

/* ===== SLIDE ===== */
.slide {
  display: flex;
  align-items: center;
  justify-content: center;
}

.slide img {
  width: 100%;
  height: 220px;
  object-fit: contain;
  padding: 16px;
  display: block;

  /* ✅ ADD THESE */
  border-radius: 20px;
  background: var(--carousel-bg);
}


/* ===== NAV BUTTONS ===== */
.nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: var(--carousel-nav-bg);
  color: var(--carousel-nav-text);
  border: 1px solid var(--carousel-border);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(6px);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.nav.prev { left: 14px; }
.nav.next { right: 14px; }

.nav:hover {
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 10px 28px rgba(255, 0, 0, 0.35);
}

/* ===== DOTS ===== */
.dots {
  position: absolute;
  bottom: 14px;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: var(--carousel-dot);
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;
}

.dot:hover {
  transform: scale(1.2);
}

.dot.active {
  background: red;
  transform: scale(1.35);
}

/* ===== RESPONSIVE ===== */
@media (min-width: 768px) {
  .slide img {
    height: 300px;
    padding: 20px;
  }
}
@media (max-width: 600px) {
  .slide img {
    object-fit: cover;
    object-position: center top;
    padding: 5px;
  }
}



@media (min-width: 1024px) {
  .slide img {
    height: 360px;
  }
}
`;

const skeletonStyles = `
/* ===== SKELETON ===== */
.skeleton {
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 20px;
  overflow: hidden;
}

.skeleton-img {
  width: 100%;
  height: 220px;
  border-radius: 20px;
  background: linear-gradient(
    90deg,
    #e6e6e6 25%,
    #f5f5f5 37%,
    #e6e6e6 63%
  );
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
}

[data-theme="dark"] .skeleton-img {
  background: linear-gradient(
    90deg,
    #1a1a1a 25%,
    #262626 37%,
    #1a1a1a 63%
  );
}

@media (min-width: 768px) {
  .skeleton-img {
    height: 300px;
  }
}

@media (min-width: 1024px) {
  .skeleton-img {
    height: 360px;
  }
}

@keyframes shimmer {
  0% { background-position: 100% 0; }
  100% { background-position: -100% 0; }
}
`;
