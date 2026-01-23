"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { api, API_BASE_URL } from "@/lib/api";
import SellContact from "@/components/SellContact";



export default function CarDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [car, setCar] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    async function loadCar() {
      const cached = sessionStorage.getItem("cars_cache");
      let cars;

      if (cached) {
        cars = JSON.parse(cached);
      } else {
        const res = await api("/cars");
        const json = res;
        cars = json.data;
        sessionStorage.setItem("cars_cache", JSON.stringify(cars));
      }

      const found = cars.find((c) => String(c.id) === String(id));
      if (!found) return;

      setCar(found);
      const previewImg = searchParams.get("img");
      setActiveImage(previewImg || found.featured_image);
    }

    loadCar();
  }, [id, searchParams]);

  const baseUrl = API_BASE_URL.replace("/api", "");

  /* ================= SKELETON ================= */
  if (!car) {
    return (
      <>
        <div className="page">
          <div className="skel skel-title" />
          <div className="skel skel-subtitle" />

          <div className="top">
            <div className="skel skel-image" />
            <div>
              <div className="skel skel-card" />
              <div className="skel skel-card" />
              <div className="skel skel-card" />
            </div>
          </div>

          <div className="priceRow">
            <div className="skel skel-price" />
            <div className="skel skel-price" />
          </div>

          <div className="actions">
            <div className="skel skel-btn" />
            <div className="skel skel-btn" />
          </div>
        </div>

        <style>{`
          .page { background:#000; color:#fff; padding:30px; }

          .skel {
            background: linear-gradient(
              90deg,
              #111 25%,
              #1a1a1a 37%,
              #111 63%
            );
            background-size: 400% 100%;
            animation: shimmer 1.4s infinite;
            border-radius: 8px;
          }

          .skel-title { height:28px; width:60%; margin-bottom:10px; }
          .skel-subtitle { height:14px; width:40%; margin-bottom:24px; }

          .skel-image {
            width:100%;
            aspect-ratio:16/9;
            border-radius:14px;
          }

          .skel-card {
            height:80px;
            margin-top:16px;
            border-radius:10px;
          }

          .skel-price {
            height:26px;
            width:160px;
          }

          .skel-btn {
            height:44px;
            flex:1;
            border-radius:8px;
          }

          @keyframes shimmer {
            0% { background-position: 100% 0; }
            100% { background-position: 0 0; }
          }
        `}</style>
      </>
    );
  }

  /* ================= REAL UI (UNCHANGED) ================= */

  const thumbnails = (car.images || [])
    .map((i) => i.url)
    .filter((u) => u && u !== activeImage);

  return (
    <>
      <div className="page">

        {/* TITLE */}
        <div className="titleRow">
          <h1>
            {car.brand.name} {car.model} – {car.year}
            {car.is_verified && <span className="verified">✔ Verified</span>}
          </h1>
          <p className="subtitle">
            {car.condition.replace("_", " ")} · {car.mileage} KM ·{" "}
            {car.engine_specs || "—"} · {car.transmission}
          </p>
        </div>

        {/* GALLERY + INFO */}
        <div className="top">
          <div className="gallery">
            <div className="mainImage">
              <img src={`${baseUrl}${activeImage}`} alt={car.model} />
            </div>

            {thumbnails.length > 0 && (
              <div className="thumbs">
                {thumbnails.map((img, i) => (
                  <img
                    key={i}
                    src={`${baseUrl}${img}`}
                    className="thumb"
                    onClick={() => setActiveImage(img)}
                    alt=""
                  />
                ))}
              </div>
            )}
          </div>

          <div className="infoPanel">
            <div className="infoCard dark">
              <h4>Verified Cars</h4>
              <p>
                Every vehicle is thoroughly inspected and verified before listing.
                We check the car’s condition, ownership documents, and history.
              </p>
            </div>

            <div className="infoCard light">
              <h4>Dedicated Support Team</h4>
              <p>
                Our experienced support team is available to guide you at every stage.
              </p>
            </div>

            <div className="infoCard yellow">
              <h4>Great Maintenance Contract</h4>
              <p>
                We work with professional maintenance partners to provide quality
                after-sales support.
              </p>
            </div>
          </div>
        </div>

        {/* PRICE + ACTIONS */}
        <div className="priceRow">
          <div>
            <p className="price">₦{Number(car.price).toLocaleString()}</p>
            <small>{car.location}</small>
          </div>

          <div>
            <p className="monthly">
              ₦{Number(car.estimated_monthly_repayment).toLocaleString()} / Mo
            </p>
            <small>{car.min_down_payment_percent}% Down payment</small>
          </div>
        </div>

        <div className="actions">
          <button className="outline" onClick={() => setShowContact(true)}>
            Contact Seller
          </button>

          <button
            className="solid"
            onClick={() => router.push(`/cars/${car.id}/loan`)}
          >
            Apply For Loan
          </button>
        </div>

        {/* SPECS */}
        <div className="specs">
          <h3 className="sectionTitle">Car Specs</h3>
          <table>
            <tbody>
              <tr><td>Fuel Type</td><td>{car.fuel_type}</td></tr>
              <tr><td>Transmission</td><td>{car.transmission}</td></tr>
              <tr><td>Interior Color</td><td>{car.interior_color}</td></tr>
              <tr><td>Exterior Color</td><td>{car.exterior_color}</td></tr>
              <tr><td>Vehicle ID</td><td>{car.reference_code}</td></tr>
            </tbody>
          </table>
        </div>

        {/* FEATURES */}
        <div className="features">
          <h3 className="sectionTitle">Car Features</h3>
          <div className="featureGrid">
            {car.features.map((f, i) => (
              <span key={i}>{f}</span>
            ))}
          </div>
        </div>
      </div>

      {showContact && (
        <SellContact car={car} onClose={() => setShowContact(false)} />
      )}

      <style>{`
        .page { background:#000; color:#fff; padding:30px; }
        .titleRow h1 { margin:0; }
        .verified { color:#22c55e; margin-left:8px; font-size:14px; }
        .subtitle { color:#aaa; margin-top:6px; }

        .sectionTitle { color:red; margin-bottom:16px; }

        .top { display:grid; grid-template-columns:2fr 1fr; gap:20px; }

        .mainImage {
          aspect-ratio:16/9;
          overflow:hidden;
          border-radius:14px;
          background:#111;
        }
        .mainImage img {
          width:100%;
          height:100%;
          object-fit:cover;
          margin-top:16px;
        }

        .thumbs {
          display:flex;
          gap:10px;
          margin-top:12px;
          overflow-x:auto;
        }
        .thumb {
          width:90px;
          height:60px;
          object-fit:cover;
          opacity:.7;
          cursor:pointer;
          border-radius:6px;
        }
        .thumb:hover { opacity:1; }

        .infoCard {
          padding:16px;
          border-radius:10px;
          font-size:16px;
          margin-top:16px;
        }
        .dark{background:#1f2350;}
        .light{background:#d7eff7;color:#000;}
        .yellow{background:#ffd27a;color:#000;}

        .priceRow {
          display:flex;
          justify-content:space-between;
          margin:32px 0;
          align-items:flex-end;
        }
        .price { font-size:24px; font-weight:bold; }

        .page .actions {
          display:flex;
          gap:12px;
          margin-bottom:40px;
        }

        .outline {
          border:1px solid red;
          background:transparent;
          color:#fff;
          padding:12px;
          flex:1;
          border-radius:8px;
        }
        .solid {
          background:red;
          border:none;
          color:#fff;
          padding:12px;
          flex:1;
          border-radius:8px;
        }

        table { width:100%; border-collapse:collapse; }
        td {
          padding:10px 0;
          border-bottom:1px solid #111;
        }

        .featureGrid {
          display:flex;
          gap:8px;
          flex-wrap:wrap;
        }
        .featureGrid span {
          background:#111;
          padding:6px 10px;
          border-radius:20px;
          font-size:11px;
        }

        @media(max-width:900px){
          .top{grid-template-columns:1fr;}
        }
      `}</style>
    </>
  );
}
