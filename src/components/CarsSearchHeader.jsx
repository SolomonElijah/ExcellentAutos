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

     <style jsx>{`
  .header {
    background: var(--nav-bg);
    padding: 20px 30px;
    border-bottom: 1px solid var(--surface-border);
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
    border: 1px solid var(--surface-border);
    background: var(--surface);
    color: var(--foreground);
    font-size: 14px;
    outline: none;
  }

  .searchRow input::placeholder {
    color: var(--text-muted);
  }

  .searchRow input:focus {
    border-color: var(--accent);
  }

  .searchBtn {
    background: var(--accent);
    border: none;
    padding: 12px 18px;
    border-radius: 6px;
    font-weight: 800;
    cursor: pointer;
    color: var(--text-invert);
    transition: opacity 0.2s ease;
  }

  .searchBtn:hover {
    opacity: 0.9;
  }

  .clearBtn {
    background: transparent;
    border: 1px solid var(--surface-border);
    padding: 12px 18px;
    border-radius: 6px;
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;
    color: var(--foreground);
    transition: background 0.2s ease;
  }

  .clearBtn:hover {
    background: var(--surface);
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
