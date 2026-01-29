"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CarsFilterBar() {
  const router = useRouter();
  const [open, setOpen] = useState(null);

  // FILTER STATE
  const [brand, setBrand] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [yearMin, setYearMin] = useState("");
  const [yearMax, setYearMax] = useState("");
  const [location, setLocation] = useState("");

  /* =========================
     APPLY FILTERS (CLEAN URL)
  ========================= */
  const applyFilters = () => {
    const params = new URLSearchParams();

    // BRAND
    if (brand.trim()) {
      params.set("search", brand.trim());
    }

    // PRICE
    if (priceMin) params.set("price_min", priceMin);
    if (priceMax) params.set("price_max", priceMax);

    // YEAR - THIS WAS THE PROBLEM
    if (yearMin) params.set("year_min", yearMin);
    if (yearMax) params.set("year_max", yearMax);

    // LOCATION - THIS WAS THE PROBLEM  
    if (location.trim()) {
      params.set("location", location.trim());
    }

    params.set("page", "1");

    // ✅ This updates the URL which triggers your page to re-fetch
    router.push(`/cars?${params.toString()}`);
    setOpen(null);
  };

  /* =========================
     CLEAR FILTERS
  ========================= */
  const clearFilters = () => {
    // Clear local state
    setBrand("");
    setPriceMin("");
    setPriceMax("");
    setYearMin("");
    setYearMax("");
    setLocation("");

    // Clear URL
    router.push("/cars");
    setOpen(null);
  };

  return (
    <>
      {/* FILTER BUTTON BAR */}
      <div className="bar">
        <button onClick={() => setOpen(open === "brand" ? null : "brand")}>
          Brand & Model ▾
        </button>
        <button onClick={() => setOpen(open === "price" ? null : "price")}>
          Car Price ▾
        </button>
        <button onClick={() => setOpen(open === "year" ? null : "year")}>
          Year ▾
        </button>
        <button onClick={() => setOpen(open === "location" ? null : "location")}>
          Location ▾
        </button>

        <button className="clearTop" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>

      {/* BRAND */}
      {open === "brand" && (
        <div className="dropdown">
          <label>Brand or Model</label>
          <input
            placeholder="Type brand or model"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />

          <h5>SUGGESTED BRANDS</h5>
          <div className="chips">
            {[
              "Audi", "BMW", "Toyota", "Hyundai", "Jaguar", "KIA", "Land Rover",
              "Lexus", "Mercedes", "Nissan", "Honda", "Ford", "Volkswagen", "Mazda",
              "Subaru", "Mitsubishi", "Chevrolet", "Peugeot", "Renault", "Volvo",
              "Porsche", "Jeep", "Tesla", "Suzuki",
            ].map((b) => (
              <span key={b} onClick={() => setBrand(b)}>
                {b}
              </span>
            ))}
          </div>

          <button className="apply" onClick={applyFilters}>Apply</button>
          <button className="clear" onClick={clearFilters}>Clear Filters</button>
        </div>
      )}

      {/* PRICE */}
      {open === "price" && (
        <div className="dropdown">
          <div className="range">
            <input
              placeholder="₦ 0"
              value={priceMin}
              onChange={(e) =>
                setPriceMin(e.target.value.replace(/\D/g, ""))
              }
            />
            <span>—</span>
            <input
              placeholder="₦ 30,000,000"
              value={priceMax}
              onChange={(e) =>
                setPriceMax(e.target.value.replace(/\D/g, ""))
              }
            />
          </div>

          <button className="apply" onClick={applyFilters}>Apply</button>
          <button className="clear" onClick={clearFilters}>Clear Filters</button>
        </div>
      )}

      {/* YEAR */}
      {open === "year" && (
        <div className="dropdown">
          <div className="range">
            <input
              placeholder="1990"
              value={yearMin}
              onChange={(e) =>
                setYearMin(e.target.value.replace(/\D/g, ""))
              }
            />
            <span>—</span>
            <input
              placeholder="2026"
              value={yearMax}
              onChange={(e) =>
                setYearMax(e.target.value.replace(/\D/g, ""))
              }
            />
          </div>

          <button className="apply" onClick={applyFilters}>Apply</button>
          <button className="clear" onClick={clearFilters}>Clear Filters</button>
        </div>
      )}

      {/* LOCATION */}
      {open === "location" && (
        <div className="dropdown">
          <label>Search for any location</label>
          <input
            placeholder="Type Here"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <h5>POPULAR LOCATIONS</h5>
          <div className="chips scroll">
            {[
              "Lagos",
              "Ikeja",
              "Lekki",
              "Victoria Island",
              "Abuja",
              "Gwarinpa",
              "Maitama",
              "Port Harcourt",
              "Ibadan",
              "Benin City",
              "Onitsha",
              "Aba",
              "Enugu",
              "Warri",
              "Uyo",
            ].map((location) => (
              <span key={location} onClick={() => setLocation(location)}>
                {location}
              </span>
            ))}
          </div>


          <h5>STATES</h5>
          <div className="chips scroll">
            {[
              "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
              "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Abuja", "Gombe",
              "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
              "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers",
              "Sokoto", "Taraba", "Yobe", "Zamfara",
            ].map((s) => (
              <span key={s} onClick={() => setLocation(s)}>
                {s}
              </span>
            ))}
          </div>


          <button className="apply" onClick={applyFilters}>Apply</button>
          <button className="clear" onClick={clearFilters}>Clear Filters</button>
        </div>
      )}

      {/* STYLES — UNCHANGED */}
      <style>{`
        .bar {
          background: #000;
          padding: 14px 30px;
          display: flex;
          gap: 10px;
          border-bottom: 1px solid #111;
          flex-wrap: wrap;
          align-items: center;
        }
        .bar button {
          background: #0b0b0b;
          border: 1px solid #222;
          color: #ccc;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 13px;
          cursor: pointer;
        }
        .bar button:hover {
          border-color: red;
          color: #fff;
        }
        .clearTop {
          border-color: red;
          color: #fff;
        }
        .dropdown {
          background: #000;
          max-width: 700px;
          margin: 12px auto;
          padding: 20px;
          border-radius: 10px;
        }
        input {
          width: 100%;
          padding: 10px;
          margin: 8px 0 14px;
          border: 1px solid #ddd;
          border-radius: 6px;
        }
        .chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .chips span {
          padding: 6px 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
        }
        .scroll {
          max-height: 180px;
          overflow-y: auto;
        }
        .range {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .apply {
          width: 100%;
          margin-top: 16px;
          background: red;
          border: none;
          padding: 12px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
        }
        .clear {
          width: 100%;
          margin-top: 8px;
          background: #111;
          border: 1px solid #222;
          padding: 12px;
          border-radius: 6px;
          font-weight: 600;
          color: #ccc;
          cursor: pointer;
        }


      
      `}</style>
    </>
  );
}
