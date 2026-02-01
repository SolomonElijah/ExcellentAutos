"use client";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { api, API_BASE_URL } from "@/lib/api";
import SellContact from "@/components/SellContact";
import CarsFilterBar from "@/components/CarsFilterBar";
import CarsSearchHeader from "@/components/CarsSearchHeader";

/* =========================
   FETCHER
========================= */
const fetcher = async (url) => {
  const res = await api(url);
  return res; // 🔥 return full API response (data + meta)
};

export default function Product() {
  const router = useRouter();

  /* =========================
     STATE
  ========================= */
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});

  const searchParams = useSearchParams();



  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());

    setSearch(params.search || "");
    setPage(params.page ? Number(params.page) : 1);

    const { search: _, page: __, ...rest } = params;

    // 🔥 FIX FOR YEAR & LOCATION FILTERS
    if (rest.year_min) {
      rest.year_min = parseInt(rest.year_min);
      if (isNaN(rest.year_min)) delete rest.year_min;
    }
    if (rest.year_max) {
      rest.year_max = parseInt(rest.year_max);
      if (isNaN(rest.year_max)) delete rest.year_max;
    }

    // Clean empty values
    Object.keys(rest).forEach(key => {
      if (rest[key] === '' || rest[key] === null || rest[key] === undefined) {
        delete rest[key];
      }
    });


    console.log('🔧 Filters being sent to API:', rest);

    setFilters(rest);
  }, [searchParams]);



  // 🔹 CONTACT MODAL STATE
  const [showContact, setShowContact] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  /* =========================
     SWR
  ========================= */
  const params = new URLSearchParams({
    page,
    ...filters,
  });

  if (search) {
    params.set("search", search);
  }

  const query = params.toString();


  const { data, isLoading } = useSWR(
    `/cars?${query}`,
    fetcher,
    {
      refreshInterval: 60000,
      revalidateOnFocus: false,
    }
  );

  const cars = data?.data || [];
  const meta = data?.meta;

  return (
    <>
      {/* SEARCH */}
      <CarsSearchHeader
        onSearch={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onClear={() => {
          setSearch("");
          setFilters({});
          setPage(1);
        }}
      />

      {/* FILTER BAR */}
      <CarsFilterBar
        onApply={(newFilters) => {
          setFilters(newFilters);
          setPage(1);
        }}
      />



      <section className="wrapper">
        <h2 className="title">Find cars</h2>
        <div className="grid">
          {isLoading &&
            Array.from({ length: 12 }).map((_, i) => (
              <div className="card skeleton" key={i}>
                <div className="imgWrap shimmer" />
                <div className="body">
                  <div className="line w80 shimmer" />
                  <div className="meta">
                    <div className="tag shimmer" />
                    <div className="tag shimmer" />
                    <div className="tag shimmer" />
                  </div>
                  <div className="priceRow">
                    <div className="line w60 shimmer" />
                    <div className="line w40 shimmer" />
                  </div>
                  <div className="actions">
                    <div className="btn shimmer" />
                    <div className="btn shimmer" />
                  </div>
                </div>
              </div>
            ))}

          {/* ADDED: No results message */}
          {!isLoading && cars.length === 0 && (
            <div className="no-results">
              <h3>No cars found</h3>
              <p>Try adjusting your filters or search term</p>
              <button
                className="clear-btn"
                onClick={() => {
                  setSearch("");
                  setFilters({});
                  setPage(1);
                  router.replace(window.location.pathname);
                }}
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* MODIFIED: Added cars.length > 0 condition */}
          {!isLoading && cars.length > 0 &&
            cars.map((car) => {
              const hasLoan = car.loan?.available === true;

              const loanData = car.loan?.precomputed ?? null;

              const firstTenure = loanData?.tenures
                ? loanData.tenures[Object.keys(loanData.tenures)[0]]
                : null;


              return (
                <div className="card" key={car.id}>
                  <div
                    className="imgWrap"
                    onClick={() => router.push(`/cars/${car.id}`)}
                  >
                    <img
                      src={`${API_BASE_URL.replace("/api", "")}${car.featured_image}`}
                      alt={`${car.year} ${car.brand.name} ${car.model}`}
                      className="img"
                    />

                    {hasLoan && (
                      <span className="loanTag">Car Loan Available</span>
                    )}

                  </div>

                  <div className="body">
                    <h3 onClick={() => router.push(`/cars/${car.id}`)}>
                      {car.year} {car.brand.name} {car.model}
                    </h3>

                    {/* META ROW — RATING RIGHT */}
                    <div className="meta metaRow">
                      <div className="metaLeft">
                        <span>
                          {car.condition === "foreign_used"
                            ? "Foreign"
                            : "Local"}
                        </span>
                        <span>{car.mileage}kms</span>
                        <span>{car.engine_specs || "—"}</span>
                      </div>

                      <span className="rating">⭐ 3.0</span>
                    </div>

                    <div className="priceRow">
                      <div>
                        <p className="price">
                          ₦{Number(car.price).toLocaleString()}
                        </p>
                        <small>{car.location}</small>
                      </div>

                      {hasLoan && loanData && firstTenure ? (
                        <div>
                          <p className="monthly">
                            ₦{Number(firstTenure.monthly_payment).toLocaleString()} / Mo
                          </p>
                          <small>
                            {loanData.down_payment_percent}% Down payment
                          </small>
                        </div>
                      ) : hasLoan ? (
                        <small className="noCalc">

                        </small>
                      ) : null}
                    </div>


                    <div className="actions">
                      <button
                        className="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCar(car);
                          setShowContact(true);
                        }}
                      >
                        Contact Seller
                      </button>

                      {hasLoan && (
                        <button
                          className="solid"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/cars/${car.id}/loan`);
                          }}
                        >
                          Apply For Loan
                        </button>
                      )}





                    </div>
                    <div className="preorder-cta">
  <button
    className="preorder-btn"
    onClick={() => router.push(`/preorder/${car.id}`)}
  >
    <span className="preorder-btn__main">Pre-Order This Car</span>
    <span className="preorder-btn__badge">10% OFF</span>
  </button>
</div>

                  </div>
                </div>
              );
            })}
        </div>



        {meta && meta.last_page > 1 && (
          <div className="pagination">
            <button
              disabled={meta.current_page === 1}
              onClick={() => {
                const newPage = meta.current_page - 1;
                setPage(newPage);
                // Update URL with page number
                const params = new URLSearchParams(window.location.search);
                if (newPage > 1) {
                  params.set("page", newPage.toString());
                } else {
                  params.delete("page");
                }
                const newUrl = params.toString() ? `?${params.toString()}` : "";
                router.replace(`${window.location.pathname}${newUrl}`, { scroll: false });
              }}
            >
              Prev
            </button>

            <span>
              Page {meta.current_page} of {meta.last_page}
            </span>

            <button
              disabled={meta.current_page === meta.last_page}
              onClick={() => {
                const newPage = meta.current_page + 1;
                setPage(newPage);
                // Update URL with page number
                const params = new URLSearchParams(window.location.search);
                params.set("page", newPage.toString());
                const newUrl = params.toString() ? `?${params.toString()}` : "";
                router.replace(`${window.location.pathname}${newUrl}`, { scroll: false });
              }}
            >
              Next
            </button>
          </div>
        )}
      </section>

      {showContact && (
        <SellContact
          car={selectedCar}
          onClose={() => setShowContact(false)}
        />
      )}

      {/* STYLES — COMPLETELY UNCHANGED + SMALL ADDITIONS */}
      <style>{`
        .wrapper {
          background: #000;
          color: #fff;
          padding: 50px 40px;
          min-height: 100vh;
        }

        .title {
          font-size: 22px;
          margin-bottom: 25px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 25px;
        }

        .card {
          background: #0b0b0b;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #111;
          cursor: pointer;
        }

        .imgWrap {
          width: 100%;
          aspect-ratio: 16 / 9;
          background: #111;
          position: relative;
        }

        .img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .body {
          padding: 16px;
        }

        .body h3 {
          font-size: 16px;
          margin-bottom: 10px;
        }

        .meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          font-size: 11px;
          margin-bottom: 12px;
        }

        .meta span {
          background: #111;
          padding: 4px 8px;
          border-radius: 6px;
        }

        .rating {
          background: #222;
        }

        .priceRow {
          display: flex;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .price,
        .monthly {
          font-weight: 600;
        }

        .actions {
          display: flex;
          gap: 10px;
        }

        .actions button {
          flex: 1;
          padding: 10px;
          font-size: 12px;
          border-radius: 8px;
        }

        .outline {
          background: transparent;
          border: 1px solid red;
          color: #fff;
        }

        .solid {
          background: red;
          border: none;
          color: #fff;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 15px;
          margin-top: 40px;
        }

        .pagination button {
          background: #111;
          border: 1px solid #222;
          color: #fff;
          padding: 8px 14px;
          border-radius: 6px;
          cursor: pointer;
        }

        .pagination button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .skeleton {
          pointer-events: none;
        }

        .shimmer {
          background: linear-gradient(
            90deg,
            #111 25%,
            #1a1a1a 37%,
            #111 63%
          );
          background-size: 400% 100%;
          animation: shimmer 1.4s ease infinite;
        }

        .line {
          height: 12px;
          border-radius: 6px;
          margin-bottom: 10px;
        }

        .w80 {
          width: 80%;
        }

        .w60 {
          width: 60%;
        }

        .w40 {
          width: 40%;
        }

        .tag {
          width: 50px;
          height: 16px;
          border-radius: 6px;
        }

        .btn {
          height: 32px;
          border-radius: 8px;
          flex: 1;
        }

        @keyframes shimmer {
          0% {
            background-position: -400px 0;
          }
          100% {
            background-position: 400px 0;
          }
        }

        @media (max-width: 1100px) {
          .grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 700px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }

        /* === ADDED ONLY === */
        .metaRow {
          justify-content: space-between;
          align-items: center;
        }

        .metaLeft {
          display: flex;
          gap: 8px;
        }

        .loanTag {
          position: absolute;
          bottom: 10px;
          left: 10px;
          background: #e6f0ff;
          color: #1a4ed8;
          padding: 4px 8px;
          font-size: 11px;
          border-radius: 10px;
        }

        /* NEW: No results styles */
        .no-results {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 20px;
          background: #0b0b0b;
          border-radius: 16px;
          border: 1px solid #222;
        }

        .no-results h3 {
          font-size: 20px;
          margin-bottom: 10px;
        }

        .no-results p {
          color: #888;
          margin-bottom: 20px;
        }

        .clear-btn {
          background: #111;
          border: 1px solid #333;
          color: #fff;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
        }

        .clear-btn:hover {
          background: #222;
        }
          .preorder-cta {
  margin-top: 16px;
  display: flex;
  justify-content: center;   /* ✅ center horizontally */
  align-items: center;
}

.preorder-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 14px 24px;
  background: linear-gradient(135deg, #e11d48, #b91c1c);
  color: #fff;
  border: none;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  box-shadow: 0 8px 24px rgba(225, 29, 72, 0.35);
}

.preorder-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 32px rgba(225, 29, 72, 0.45);
}

.preorder-btn__badge {
  background: #fff;
  color: #b91c1c;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
}

      `}</style>
    </>
  );
}