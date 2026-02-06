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
    background: var(--background);
    color: var(--foreground);
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
    color: var(--text-muted);
  }

  /* ===== PRICE CHIPS ===== */
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .chips span {
    background: var(--surface);
    border: 1px solid var(--surface-border);
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 12px;
    cursor: pointer;
    color: var(--foreground);
    transition: all 0.2s ease;
  }

  .chips span:hover {
    border-color: var(--accent);
  }

  .chips .active {
    background: var(--foreground);
    color: var(--background);
    border-color: var(--foreground);
    font-weight: 600;
  }

  /* ===== BRANDS ===== */
  .brands {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }

  .brands div {
    background: var(--surface);
    border: 1px solid var(--surface-border);
    border-radius: 8px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    cursor: pointer;
    color: var(--foreground);
    transition: all 0.2s ease;
  }

  .brands div:hover {
    border-color: var(--accent);
  }

  .brands .activeBrand {
    background: var(--foreground);
    color: var(--background);
    border-color: var(--foreground);
    font-weight: 600;
  }

  /* ===== APPLY BUTTON ===== */
  .applyBtn {
    margin-top: 12px;
    width: 100%;
    padding: 12px;
    background: var(--accent);
    border: none;
    border-radius: 8px;
    font-weight: 800;
    cursor: pointer;
    color: #fff;
    transition: opacity 0.2s ease;
  }

  .applyBtn:hover {
    opacity: 0.9;
  }

  /* ===== SEARCH ===== */
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
    border: 1px solid var(--surface-border);
    background: var(--surface);
    color: var(--foreground);
    outline: none;
  }

  .searchRow input:focus {
    border-color: var(--accent);
  }

  .searchRow button {
    padding: 12px 18px;
    background: var(--accent);
    border: none;
    border-radius: 8px;
    font-weight: 800;
    cursor: pointer;
    color: #fff;
    transition: opacity 0.2s ease;
  }

  .searchRow button:hover {
    opacity: 0.9;
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
