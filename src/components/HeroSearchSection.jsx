"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HeroSearchSection() {
  const router = useRouter();

  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [searchText, setSearchText] = useState("");

  /* =========================
     FIXED PRICE FILTER
  ========================= */
  const applyPrice = () => {
    if (!price) return;

    const priceMap = {
      "Under 3M": { price_max: 3000000 },
      "3M - 6M": { price_min: 3000000, price_max: 6000000 },
      "6M - 10M": { price_min: 6000000, price_max: 10000000 },
      "10M - 15M": { price_min: 10000000, price_max: 15000000 },
      "15M - 30M": { price_min: 15000000, price_max: 30000000 },
      "Above 30M": { price_min: 30000000 },
    };

    const params = new URLSearchParams(priceMap[price]).toString();
    router.push(`/cars?${params}`);
  };

  const applyBrand = () => {
    if (!brand) return;
    router.push(`/cars?search=${encodeURIComponent(brand)}`);
  };

  const handleSearch = () => {
    if (!searchText.trim()) return;
    router.push(`/cars?search=${encodeURIComponent(searchText.trim())}`);
  };

  return (
    <>
      <section className="wrapper">
        <div className="content">
          <h3>Find your dream car</h3>

          {/* BY PRICE */}
          <div className="group">
            <p>By Price</p>
            <div className="chips">
              {[
                "Under 3M",
                "3M - 6M",
                "6M - 10M",
                "10M - 15M",
                "15M - 30M",
                "Above 30M",
              ].map((p) => (
                <span
                  key={p}
                  className={price === p ? "active" : ""}
                  onClick={() => setPrice(p)}
                >
                  {p}
                </span>
              ))}
            </div>

            <button className="applyBtn" onClick={applyPrice}>
              Apply
            </button>
          </div>

          {/* BY BRAND */}
          <div className="group">
            <p>By Top Brand</p>
            <div className="brands">
              {[
                "Audi",
                "BMW",
                "Toyota",
                "KIA",
                "Land Rover",
                "Lexus",
                "Mercedes",
                "Nissan",
                "Honda",
                "Ford",
                "Peugeot",
                "Jeep",
              ].map((b) => (
                <div
                  key={b}
                  className={brand === b ? "activeBrand" : ""}
                  onClick={() => setBrand(b)}
                >
                  {b}
                </div>
              ))}
            </div>

            <button className="applyBtn" onClick={applyBrand}>
              Apply
            </button>
          </div>

          {/* SEARCH */}
          <div className="search">
            <p>Search Here</p>
            <div className="searchRow">
              <input
                placeholder="Search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
              <button onClick={handleSearch}>Search</button>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .wrapper {
          background: #000;
          color: #fff;
          padding: 60px 20px;
          display: flex;
          justify-content: center;
        }

        .content {
          width: 100%;
          max-width: 700px;
        }

        h3 {
          font-size: 22px;
          margin-bottom: 20px;
          text-align: center;
        }

        .group {
          margin-bottom: 25px;
        }

        .group p {
          margin-bottom: 10px;
          font-size: 14px;
        }

        .chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .chips span {
          border: 1px solid #333;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          background: #111;
        }

        .chips .active {
          background: #fff;
          color: #000;
          font-weight: 600;
        }

        .brands {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }

        .brands div {
          background: #111;
          border-radius: 8px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          cursor: pointer;
          border: 1px solid #222;
        }

        .brands .activeBrand {
          background: #fff;
          color: #000;
          font-weight: 600;
        }

        .applyBtn {
          margin-top: 12px;
          width: 100%;
          padding: 12px;
          background: red;
          border: none;
          border-radius: 8px;
          font-weight: 800;
          cursor: pointer;
           color: #fff;
        }

        .search {
          margin-top: 10px;
        }

        .searchRow {
          display: flex;
          gap: 10px;
        }

        .searchRow input {
          flex: 1;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid red;
          background: transparent;
          color: #fff;
        }

        .searchRow button {
          padding: 12px 18px;
          background: red;
          border: none;
          border-radius: 8px;
          font-weight: 800;
          cursor: pointer;
           color: #fff;
        }

    

        @media (max-width: 900px) {
          .brands {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </>
  );
}
