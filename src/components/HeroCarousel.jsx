"use client";

import useSWR from "swr";
import { useEffect, useRef, useState } from "react";
import { fetchCarousel } from "@/lib/carouselFetcher";

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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [paused, slides]);

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

    const diff =
      touchStartX.current - e.changedTouches[0].clientX;

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
  loading="eager"
  decoding="async"
/>

        </div>

        {slides.length > 1 && (
          <>
            <button className="nav prev" onClick={prev}>
              ‹
            </button>
            <button className="nav next" onClick={next}>
              ›
            </button>

            {/* DOTS */}
            <div className="dots">
              {slides.map((_, i) => (
                <button
                  key={i}
                  className={`dot ${
                    i === current ? "active" : ""
                  }`}
                  onClick={() => setCurrent(i)}
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

/* ---------- STYLES ---------- */

const carouselStyles = `
.carousel {
  position: relative;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 16px;
}

.slide img {
  width: 100%;
  height: 260px;
  object-fit: cover;
  display: block;
  border-radius: 16px;
  transition: opacity 0.3s ease;
}

/* ---------- NAV ---------- */
.nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.5);
  color: #fff;
  border: none;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav.prev { left: 12px; }
.nav.next { right: 12px; }

.nav:hover {
  background: rgba(0,0,0,0.75);
}

/* ---------- DOTS ---------- */
.dots {
  position: absolute;
  bottom: 12px;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 8px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.4);
  cursor: pointer;
}

.dot.active {
  background: #fff;
}
`;

const skeletonStyles = `
.skeleton {
  max-width: 1100px;
  margin: 0 auto;
}

.skeleton-img {
  width: 100%;
  height: 260px;
  border-radius: 16px;
  background: linear-gradient(
    90deg,
    #eee 25%,
    #f5f5f5 37%,
    #eee 63%
  );
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
}

@keyframes shimmer {
  0% { background-position: 100% 0; }
  100% { background-position: -100% 0; }
}
`;
