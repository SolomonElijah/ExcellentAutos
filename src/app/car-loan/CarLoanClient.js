"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { API_BASE_URL } from "@/lib/api";
import SellContact from "@/components/SellContact";

export default function CarLoanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /* =========================
     STATE
  ========================= */
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Contact modal state
  const [showContact, setShowContact] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  /* =========================
     READ URL PARAMS ON MOUNT
  ========================= */
  useEffect(() => {
    const urlSearch = searchParams.get("search");
    const urlPriceMin = searchParams.get("price_min");
    const urlPriceMax = searchParams.get("price_max");
    const urlPage = searchParams.get("page");

    if (urlSearch) setSearch(urlSearch);
    if (urlPriceMin) setPriceMin(urlPriceMin);
    if (urlPriceMax) setPriceMax(urlPriceMax);
    if (urlPage) setPage(parseInt(urlPage, 10));
  }, []);

  /* =========================
     UPDATE URL WHEN PARAMS CHANGE
  ========================= */
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (search) params.set("search", search);
    if (priceMin) params.set("price_min", priceMin);
    if (priceMax) params.set("price_max", priceMax);
    if (page > 1) params.set("page", page.toString());
    
    const queryString = params.toString();
    const newUrl = queryString ? `/car-loan?${queryString}` : "/car-loan";
    
    router.push(newUrl, { scroll: false });
  }, [search, priceMin, priceMax, page, router]);

  /* =========================
     FETCH CARS WITH BACKEND PAGINATION
  ========================= */
  useEffect(() => {
    async function fetchCars() {
      try {
        setIsLoading(true);
        
        // Build query parameters
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("per_page", "12");
        
        // Add loan filter - backend should handle loan.available=true
        params.set("loan_available", "true");
        
        if (search) params.set("search", search);
        if (priceMin) params.set("price_min", priceMin);
        if (priceMax) params.set("price_max", priceMax);
        
        const url = `${API_BASE_URL}/cars?${params.toString()}`;
        
        const res = await fetch(url, {
          method: "GET",
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        });

        const json = await res.json();
        setData(json);
        
        // Use backend pagination metadata
        if (json.meta) {
          setCurrentPage(json.meta.current_page);
          setTotalPages(json.meta.last_page);
          
          // If current page exceeds last page, reset to last page
          if (page > json.meta.last_page && json.meta.last_page > 0) {
            setPage(json.meta.last_page);
          }
        }
      } catch (error) {
        console.error("Failed to fetch cars", error);
        setData({ data: [], meta: { current_page: 1, last_page: 1 } });
      } finally {
        setIsLoading(false);
      }
    }

    fetchCars();
  }, [page, search, priceMin, priceMax]);

  /* =========================
     FILTER HANDLERS
  ========================= */
  const handleSearch = (value) => {
    setSearch(value);
    setPage(1); // Reset to first page on search
  };

  const handlePriceMin = (value) => {
    setPriceMin(value);
    setPage(1);
  };

  const handlePriceMax = (value) => {
    setPriceMax(value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Get cars from API response
  const cars = data?.data || [];
  
  // Filter cars to ensure only loan-available cars are shown (safety check)
  const loanCars = useMemo(() => {
    return cars.filter(car => car.loan?.available === true);
  }, [cars]);

  return (
    <>
      <div className="budget-hero">
        <div className="budget-hero-inner">
          {/* TEXT */}
          <div className="budget-text">
            <h2 className="budget-title">
              Discover the possibilities<br />within your budget
            </h2>

            <p className="budget-description">
              Are you still having a hard time figuring out the best car that fits
              your budget? You can now find out how much and for which cars you
              will qualify for.
            </p>

            <button className="budget-cta">
              Browse All Loan Cars ⬇️
            </button>
          </div>

          {/* IMAGE */}
          <div className="budget-image">
            <img src="/loanpics.png" alt="Car Loan" />
          </div>
        </div>
      </div>

     
      <section className="wrapper">
        <h2 className="title">Available Car Loan</h2>
       
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

          {!isLoading && loanCars.length === 0 && (
            <div className="noResults">
              <h3>No cars with loan available</h3>
              <p>Try adjusting your search filters or check back later.</p>
              <button
                className="backBtn"
                onClick={() => router.push("/cars")}
              >
                Browse All Cars
              </button>
            </div>
          )}

          {!isLoading &&
            loanCars.map((car) => {
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
                    <span className="loanTag">Loan Available</span>
                  </div>

                  <div className="body">
                    <h3 onClick={() => router.push(`/cars/${car.id}`)}>
                      {car.year} {car.brand.name} {car.model}
                    </h3>

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

                      {firstTenure && (
                        <div>
                          <p className="monthly">
                            ₦
                            {Number(
                              firstTenure.monthly_payment
                            ).toLocaleString()}{" "}
                            / Mo
                          </p>
                          <small>
                            {loanData.down_payment_percent}% Down payment
                          </small>
                        </div>
                      )}
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
                      <button
                        className="solid"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/cars/${car.id}/loan`);
                        }}
                      >
                        Apply For Loan
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* BACKEND PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="pagination-btn"
            >
              ← Prev
            </button>

            <div className="page-info">
              <span>Page {currentPage} of {totalPages}</span>
              
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="pagination-btn"
            >
              Next →
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

      {/* STYLES */}
      <style>{`
        /* Existing styles remain the same... */
        .wrapper {
          background: #000;
          color: #fff;
          padding: 50px 40px;
          min-height: 100vh;
        }

        .title {
          font-size: 22px;
          margin-bottom: 10px;
        }

        .subtitle {
          color: #aaa;
          margin-bottom: 25px;
          font-size: 14px;
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

        /* ===== FILTERS SECTION ===== */
        .filters-section {
          background: #000;
          padding: 20px 40px 0;
        }

        .filters-container {
          display: flex;
          flex-direction: column;
          gap: 15px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .search-filter {
          width: 100%;
        }

        .search-input {
          width: 100%;
          padding: 12px 16px;
          background: #0b0b0b;
          border: 1px solid #222;
          border-radius: 8px;
          color: #fff;
          font-size: 14px;
        }

        .search-input::placeholder {
          color: #666;
        }

        .price-filters {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .price-input {
          width: 150px;
          padding: 10px 12px;
          background: #0b0b0b;
          border: 1px solid #222;
          border-radius: 6px;
          color: #fff;
          font-size: 14px;
        }

        .price-separator {
          color: #666;
          font-size: 14px;
        }

        .clear-price {
          background: #333;
          color: #fff;
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
        }

        .clear-price:hover {
          background: #444;
        }

        /* ===== LOAN HERO ===== */
        .budget-hero {
          width: 100%;
          padding: 30px 20px 40px;
        }

        .budget-hero-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          align-items: center;
          gap: 40px;
        }

        .budget-text {
          color: #fff;
        }

        .budget-title {
          font-size: 36px;
          font-weight: 700;
          line-height: 1.3;
          color: red;
          margin-bottom: 16px;
        }

        .budget-description {
          font-size: 15px;
          line-height: 1.7;
          color: #ccc;
          margin-bottom: 22px;
          max-width: 520px;
        }

        .budget-cta {
          background: grey;
          color: #fff;
          border: none;
          padding: 14px 26px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }

        .budget-image {
          display: flex;
          justify-content: center;
        }

        .budget-image img {
          max-width: 90%;
          height: auto;
          object-fit: contain;
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
          cursor: pointer;
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
  gap: 16px;
  margin-top: 40px;
  width: 100%;
}

.pagination-btn {
  background: #1a1a1a;
  border: 1px solid #333;
  color: #fff;
  padding: 8px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  min-width: 80px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: #222;
  border-color: #444;
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background: #111;
  border-color: #222;
}

        .pagination-btn:hover:not(:disabled) {
          background: #222;
        }

        .page-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .page-info span {
          font-size: 16px;
          font-weight: 500;
        }

        .page-info small {
          font-size: 12px;
          color: #aaa;
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

        /* === LOAN PAGE STYLES === */
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
          font-weight: 600;
        }

        .noResults {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 20px;
          background: #0b0b0b;
          border-radius: 16px;
          border: 1px solid #222;
        }

        .noResults h3 {
          font-size: 20px;
          margin-bottom: 10px;
        }

        .noResults p {
          color: #aaa;
          margin-bottom: 20px;
        }

        .backBtn {
          background: red;
          color: #fff;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
        }

        .backBtn:hover {
          background: #cc0000;
        }

        @media (max-width: 900px) {
          .budget-hero-inner {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .budget-description {
            margin-left: auto;
            margin-right: auto;
          }

          .budget-image {
            margin-top: 30px;
          }
        }

        @media (max-width: 768px) {
          .budget-image {
            display: none;
          }
          
          .grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .filters-section {
            padding: 20px 20px 0;
          }
          
          .price-filters {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .price-input {
            width: 100%;
          }
        }

        @media (max-width: 700px) {
          .grid {
            grid-template-columns: 1fr;
          }
          
          .wrapper {
            padding: 30px 20px;
          }
          
          .pagination {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }
        }
      `}</style>
    </>
  );
}