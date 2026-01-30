"use client";

import { useState } from "react";

export default function CarsSearchHeader({ onSearch, onClear }) {
  const [searchText, setSearchText] = useState("");

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchText.trim());
    }
  };

  const handleClear = () => {
    setSearchText("");
    if (onClear) {
      onClear();
    }
  };
 
  return (
    <>
      <section className="header">
        <div className="searchRow">
          <input
            type="text"
            placeholder="Search for cars by Brand, Model"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />

          <button className="searchBtn" onClick={handleSearch}>
            Search
          </button>

          <button className="clearBtn" onClick={handleClear}>
            Clear Search
          </button>
        </div>
      </section>

      <style >{`
        .header {
          background: #000;
          padding: 20px 30px;
          border-bottom: 1px solid #eee;
        }

        .searchRow {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .searchRow input {
          flex: 1;
          padding: 12px 14px;
          border-radius: 6px;
          border: 1px solid #ddd;
          font-size: 14px;
        }

        .searchBtn {
          background: red;
          border: none;
          padding: 12px 18px;
          border-radius: 6px;
          font-weight: 800;
          cursor: pointer;
           color: #fff;
        }

        .clearBtn {
          background: none;
          border: none;
          padding: 12px 18px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
           color: #fff;
        }

        @media (max-width: 768px) {
          .searchRow {
            flex-direction: column;
            align-items: stretch;
          }

          .searchBtn,
          .clearBtn {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}
