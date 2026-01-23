"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Loader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="loaderWrap">
      <div className="content">
        {/* LOGO */}
        <Image
          src="/logo.png"
          alt="Excellent JC Autos"
          width={160}
          height={46}
          priority
        />

        {/* DOT LOADER */}
        <div className="loader">
          <span />
          <span />
          <span />
        </div>
      </div>

      <style>{`
        .loaderWrap {
          position: fixed;
          inset: 0;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
        }

        .loader {
          display: flex;
          gap: 10px;
        }

        .loader span {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: red;
          animation: bounce 0.9s infinite ease-in-out;
        }

        .loader span:nth-child(2) {
          animation-delay: 0.15s;
        }

        .loader span:nth-child(3) {
          animation-delay: 0.3s;
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.3;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
