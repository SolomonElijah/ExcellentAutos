"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SellSwapForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState(null);

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    location: "",
    type: "sell",
    brand: "",
    model: "",
    year: "",
    condition: "",
    mileage: "",
    expected_price: "",
    desired_car: "",
    inspection_date: "",
    inspection_address: "",
  });

  function update(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleImageUpload(position, file) {
    if (!file) return;

    const errors = [];

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      errors.push(`${file.name} is not a supported image`);
    }
    if (file.size > 2 * 1024 * 1024) {
      errors.push(`${file.name} exceeds 2MB limit`);
    }

    if (errors.length > 0) {
      setPopupMessage(errors.join("\n"));
      setShowPopup(true);
      return;
    }

    const newImages = [...images];
    newImages[position] = file;
    setImages(newImages);

    const reader = new FileReader();
    reader.onloadend = () => {
      const newPreviews = [...imagePreviews];
      newPreviews[position] = reader.result;
      setImagePreviews(newPreviews);
    };
    reader.readAsDataURL(file);
  }

  function removeImage(position) {
    const newImages = [...images];
    const newPreviews = [...imagePreviews];

    newImages[position] = null;
    newPreviews[position] = null;

    setImages(newImages);
    setImagePreviews(newPreviews);
  }

  function handleDrop(position, e) {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(position, e.dataTransfer.files[0]);
    }
  }

  async function submit(e) {
    e.preventDefault();

    const errors = [];

    if (!form.first_name) errors.push("First name is required");
    if (!form.last_name) errors.push("Last name is required");
    if (!form.phone) errors.push("Phone number is required");
    if (!form.email) errors.push("Email is required");
    if (!form.location) errors.push("Location is required");

    if (!form.brand) errors.push("Vehicle brand is required");
    if (!form.model) errors.push("Vehicle model is required");
    if (!form.year) errors.push("Vehicle year is required");
    if (!form.condition) errors.push("Vehicle condition is required");

    if (!form.mileage || Number(form.mileage) <= 0) {
      errors.push("Mileage must be greater than 0");
    }

    if (!form.expected_price || Number(form.expected_price) <= 0) {
      errors.push("Expected price must be greater than 0");
    }

    if (form.type === "swap" && !form.desired_car) {
      errors.push("Desired car is required for swap");
    }

    if (!form.inspection_date) errors.push("Inspection date is required");
    if (!form.inspection_address) errors.push("Inspection address is required");

    const validImages = images.filter(img => img !== null);
    if (validImages.length < 3) {
      errors.push("Please upload at least 3 car images");
    }

    if (errors.length > 0) {
      setPopupMessage(errors.join("\n"));
      setShowPopup(true);
      return;
    }

    setLoading(true);

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (value !== "") {
        formData.append(key, value);
      }
    });

    images.forEach((file) => {
      if (file) {
        formData.append("images[]", file);
      }
    });

    try {
      const res = await fetch(
        "https://portal.ejccars.com/api/sell-swap",
        {
          method: "POST",
          body: formData,
        }
      );

      const contentType = res.headers.get("content-type");
      let data = null;

      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw {
          message:
            "Server error occurred while processing your request. Please try again later.",
          raw: text,
        };
      }

      if (!res.ok) {
        throw data;
      }

      setPopupMessage("Request submitted successfully");
      setWhatsappUrl(data?.whatsapp_url || null);
      setShowPopup(true);
    } catch (err) {
      console.error("Submit error:", err);
      setPopupMessage(
        err?.message ||
        "An unexpected server error occurred. Please try again later."
      );
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="sell-swap-form-namespace"> {/* Namespace wrapper */}
      <form className="sell-swap-form" onSubmit={submit}>
        <h2 className="sell-swap-form__title">Sell or Swap Your Car</h2>

        <div className="sell-swap-form__grid">
          <input value={form.first_name} placeholder="First name" onChange={(e) => update("first_name", e.target.value)} />
          <input value={form.last_name} placeholder="Last name" onChange={(e) => update("last_name", e.target.value)} />
          <input value={form.phone} placeholder="Phone number" onChange={(e) => update("phone", e.target.value)} />
          <input value={form.email} type="email" placeholder="Email" onChange={(e) => update("email", e.target.value)} />
          <input value={form.location} placeholder="Location / City" onChange={(e) => update("location", e.target.value)} />
        </div>

        <div className="sell-swap-form__toggle">
          <button type="button" className={form.type === "sell" ? "sell-swap-form__toggle-btn--active" : "sell-swap-form__toggle-btn"} onClick={() => update("type", "sell")}>Sell</button>
          <button type="button" className={form.type === "swap" ? "sell-swap-form__toggle-btn--active" : "sell-swap-form__toggle-btn"} onClick={() => update("type", "swap")}>Swap</button>
        </div>

        <div className="sell-swap-form__grid">
          <input value={form.brand} placeholder="Vehicle brand" onChange={(e) => update("brand", e.target.value)} />
          <input value={form.model} placeholder="Vehicle model" onChange={(e) => update("model", e.target.value)} />
          <input value={form.year} placeholder="Year" onChange={(e) => update("year", e.target.value)} />
          <input value={form.condition} placeholder="Condition" onChange={(e) => update("condition", e.target.value)} />
          <input value={form.mileage} placeholder="Mileage (km)" onChange={(e) => update("mileage", e.target.value)} />
          <input value={form.expected_price} placeholder="Expected price (₦)" onChange={(e) => update("expected_price", e.target.value)} />
        </div>

        <div className="sell-swap-form__image-section">
          <h3 className="sell-swap-form__section-title">Upload Car Images (Minimum 3)</h3>
          <p className="sell-swap-form__section-subtitle">Front, Back, Interior views recommended. Max 2MB per image</p>

          <div className="sell-swap-form__image-grid">
            {/* Box 1: Front View */}
            <div
              className={`sell-swap-form__image-box ${imagePreviews[0] ? 'sell-swap-form__image-box--has-image' : ''}`}
              onDrop={(e) => handleDrop(0, e)}
              onDragOver={(e) => e.preventDefault()}
            >
              <input
                type="file"
                id="sell-swap-form-image-upload-1"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => handleImageUpload(0, e.target.files[0])}
                className="sell-swap-form__file-input"
              />

              {imagePreviews[0] ? (
                <div className="sell-swap-form__preview">
                  <img src={imagePreviews[0]} alt="Car view 1" />
                  <button
                    type="button"
                    className="sell-swap-form__remove-btn"
                    onClick={() => removeImage(0)}
                  >
                    ✕
                  </button>
                  <div className="sell-swap-form__label">Front View</div>
                </div>
              ) : (
                <label htmlFor="sell-swap-form-image-upload-1" className="sell-swap-form__upload-label">
                  <div className="sell-swap-form__icon">📷</div>
                  <span>Front View</span>
                  <span className="sell-swap-form__hint">Click or drag</span>
                </label>
              )}
            </div>

            {/* Box 2: Back View */}
            <div
              className={`sell-swap-form__image-box ${imagePreviews[1] ? 'sell-swap-form__image-box--has-image' : ''}`}
              onDrop={(e) => handleDrop(1, e)}
              onDragOver={(e) => e.preventDefault()}
            >
              <input
                type="file"
                id="sell-swap-form-image-upload-2"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => handleImageUpload(1, e.target.files[0])}
                className="sell-swap-form__file-input"
              />

              {imagePreviews[1] ? (
                <div className="sell-swap-form__preview">
                  <img src={imagePreviews[1]} alt="Car view 2" />
                  <button
                    type="button"
                    className="sell-swap-form__remove-btn"
                    onClick={() => removeImage(1)}
                  >
                    ✕
                  </button>
                  <div className="sell-swap-form__label">Back View</div>
                </div>
              ) : (
                <label htmlFor="sell-swap-form-image-upload-2" className="sell-swap-form__upload-label">
                  <div className="sell-swap-form__icon">📷</div>
                  <span>Back View</span>
                  <span className="sell-swap-form__hint">Click or drag</span>
                </label>
              )}
            </div>

            {/* Box 3: Interior View */}
            <div
              className={`sell-swap-form__image-box ${imagePreviews[2] ? 'sell-swap-form__image-box--has-image' : ''}`}
              onDrop={(e) => handleDrop(2, e)}
              onDragOver={(e) => e.preventDefault()}
            >
              <input
                type="file"
                id="sell-swap-form-image-upload-3"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => handleImageUpload(2, e.target.files[0])}
                className="sell-swap-form__file-input"
              />

              {imagePreviews[2] ? (
                <div className="sell-swap-form__preview">
                  <img src={imagePreviews[2]} alt="Car view 3" />
                  <button
                    type="button"
                    className="sell-swap-form__remove-btn"
                    onClick={() => removeImage(2)}
                  >
                    ✕
                  </button>
                  <div className="sell-swap-form__label">Interior View</div>
                </div>
              ) : (
                <label htmlFor="sell-swap-form-image-upload-3" className="sell-swap-form__upload-label">
                  <div className="sell-swap-form__icon">📷</div>
                  <span>Interior View</span>
                  <span className="sell-swap-form__hint">Click or drag</span>
                </label>
              )}
            </div>

            {/* Box 4: Optional */}
            <div
              className={`sell-swap-form__image-box ${imagePreviews[3] ? 'sell-swap-form__image-box--has-image' : ''}`}
              onDrop={(e) => handleDrop(3, e)}
              onDragOver={(e) => e.preventDefault()}
            >
              <input
                type="file"
                id="sell-swap-form-image-upload-4"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => handleImageUpload(3, e.target.files[0])}
                className="sell-swap-form__file-input"
              />

              {imagePreviews[3] ? (
                <div className="sell-swap-form__preview">
                  <img src={imagePreviews[3]} alt="Car view 4" />
                  <button
                    type="button"
                    className="sell-swap-form__remove-btn"
                    onClick={() => removeImage(3)}
                  >
                    ✕
                  </button>
                  <div className="sell-swap-form__label">Optional View</div>
                </div>
              ) : (
                <label htmlFor="sell-swap-form-image-upload-4" className="sell-swap-form__upload-label">
                  <div className="sell-swap-form__icon">📷</div>
                  <span>Optional View</span>
                  <span className="sell-swap-form__hint">Click or drag</span>
                </label>
              )}
            </div>

            {/* Box 5: Optional */}
            <div
              className={`sell-swap-form__image-box ${imagePreviews[4] ? 'sell-swap-form__image-box--has-image' : ''}`}
              onDrop={(e) => handleDrop(4, e)}
              onDragOver={(e) => e.preventDefault()}
            >
              <input
                type="file"
                id="sell-swap-form-image-upload-5"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => handleImageUpload(4, e.target.files[0])}
                className="sell-swap-form__file-input"
              />

              {imagePreviews[4] ? (
                <div className="sell-swap-form__preview">
                  <img src={imagePreviews[4]} alt="Car view 5" />
                  <button
                    type="button"
                    className="sell-swap-form__remove-btn"
                    onClick={() => removeImage(4)}
                  >
                    ✕
                  </button>
                  <div className="sell-swap-form__label">Optional View</div>
                </div>
              ) : (
                <label htmlFor="sell-swap-form-image-upload-5" className="sell-swap-form__upload-label">
                  <div className="sell-swap-form__icon">📷</div>
                  <span>Optional View</span>
                  <span className="sell-swap-form__hint">Click or drag</span>
                </label>
              )}
            </div>
          </div>

          <div className="sell-swap-form__image-status">
            Uploaded: {images.filter(img => img !== null).length}/5 images
            {images.filter(img => img !== null).length < 3 && (
              <span className="sell-swap-form__warning"> (Minimum 3 required)</span>
            )}
          </div>
        </div>

        {form.type === "swap" && (
          <div className="sell-swap-form__grid">
            <input value={form.desired_car} placeholder="Desired car" onChange={(e) => update("desired_car", e.target.value)} />
          </div>
        )}

        <div className="sell-swap-form__grid">
          <div className="field">
            <label>inspection Date</label>
            <input type="date" value={form.inspection_date} onChange={(e) => update("inspection_date", e.target.value)} />
          </div>
          <input value={form.inspection_address} placeholder="Inspection address" onChange={(e) => update("inspection_address", e.target.value)} />
        </div>

        <button className="sell-swap-form__submit-btn" disabled={loading}>
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>

      {showPopup && (
        <div className="sell-swap-form__overlay">
          <div className="sell-swap-form__popup">
            <pre style={{ whiteSpace: "pre-wrap" }}>{popupMessage}</pre>
            {whatsappUrl && (
              <button className="sell-swap-form__whatsapp-btn" onClick={() => (window.location.href = whatsappUrl)}>
                Chat Admin on WhatsApp
              </button>
            )}
            <button className="sell-swap-form__close-btn" onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}

      <style >{`
    
        /* ================= LIGHT MODE OVERRIDES ONLY ================= */
/* Dark mode remains your original CSS */

[data-theme="light"] .sell-swap-form-namespace .sell-swap-form {
  background: #ffffff;
  color: #111;
  border: 1px solid #e5e7eb;
}

[data-theme="light"] .sell-swap-form-namespace .sell-swap-form input {
  background: #f3f4f6;
  color: #111;
  border: 1px solid #e5e7eb;
}

[data-theme="light"] .sell-swap-form-namespace .sell-swap-form__toggle-btn {
  background: #f3f4f6;
  color: #111;
  border: 1px solid #e5e7eb;
}

[data-theme="light"] .sell-swap-form-namespace .sell-swap-form__popup {
  background: #ffffff;
  color: #111;
  border: 1px solid #e5e7eb;
}

[data-theme="light"] .sell-swap-form-namespace .sell-swap-form__image-section {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
}

[data-theme="light"] .sell-swap-form-namespace .sell-swap-form__image-box {
  background: #f3f4f6;
  border-color: #ccc;
}

[data-theme="light"] .sell-swap-form-namespace .sell-swap-form__image-box:hover {
  background: #e5e7eb;
}

[data-theme="light"] .sell-swap-form-namespace .sell-swap-form__section-subtitle,
[data-theme="light"] .sell-swap-form-namespace .sell-swap-form__image-status,
[data-theme="light"] .field label {
  color: #555;
}

[data-theme="light"] .sell-swap-form-namespace .sell-swap-form__image-status {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
}

[data-theme="light"] .field input,
[data-theme="light"] .field select {
  background: #f3f4f6;
  color: #111;
  border: 1px solid #e5e7eb;
}

/* ================= YOUR ORIGINAL CSS (UNCHANGED) ================= */

.sell-swap-form-namespace .sell-swap-form {
  max-width: 1100px;
  margin: 40px auto;
  padding: 40px;
  background: #000;
  color: #fff;
  border-radius: 16px;
  border: 1px solid #111;
}


        .sell-swap-form-namespace .sell-swap-form__title {
          font-size: 22px;
          margin-bottom: 30px;
        }

        .sell-swap-form-namespace .sell-swap-form__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 16px;
        }

        .sell-swap-form-namespace .sell-swap-form input {
          padding: 14px;
          border-radius: 10px;
          border: 1px solid #111;
          background: #0b0b0b;
          color: #fff;
          width: 100%;
          box-sizing: border-box;
        }

        .sell-swap-form-namespace .sell-swap-form__toggle {
          display: flex;
          gap: 12px;
          margin: 20px 0;
        }

        .sell-swap-form-namespace .sell-swap-form__toggle-btn {
          flex: 1;
          padding: 14px;
          border-radius: 10px;
          border: 1px solid #111;
          background: #0b0b0b;
          color: #fff;
          cursor: pointer;
        }

        .sell-swap-form-namespace .sell-swap-form__toggle-btn--active {
          flex: 1;
          padding: 14px;
          border-radius: 10px;
          border: 1px solid #111;
          background: red;
          color: #fff;
          cursor: pointer;
        }

        .sell-swap-form-namespace .sell-swap-form__submit-btn {
          background: red;
          border: none;
          padding: 16px;
          width: 100%;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          color: #fff;
          margin-top: 16px;
        }

        .sell-swap-form-namespace .sell-swap-form__submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .sell-swap-form-namespace .sell-swap-form__whatsapp-btn {
          background: #25d366;
          border: none;
          padding: 16px;
          width: 100%;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          color: #fff;
          margin-top: 10px;
        }

        .sell-swap-form-namespace .sell-swap-form__overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .sell-swap-form-namespace .sell-swap-form__popup {
          background: #0b0b0b;
          border: 1px solid #222;
          padding: 30px;
          border-radius: 16px;
          max-width: 420px;
          width: 90%;
        }

        .sell-swap-form-namespace .sell-swap-form__close-btn {
          background: #333;
          border: none;
          padding: 16px;
          width: 100%;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          color: #fff;
          margin-top: 10px;
        }

        @media (max-width: 900px) {
          .sell-swap-form-namespace .sell-swap-form__grid {
            grid-template-columns: 1fr;
          }
        }

        /* IMAGE UPLOAD STYLES */
        .sell-swap-form-namespace .sell-swap-form__image-section {
          margin: 30px 0;
          padding: 20px;
          background: #0a0a0a;
          border-radius: 12px;
          border: 1px solid #222;
        }

        .sell-swap-form-namespace .sell-swap-form__section-title {
          font-size: 18px;
          margin: 0 0 10px 0;
          font-weight: 600;
        }

        .sell-swap-form-namespace .sell-swap-form__section-subtitle {
          color: #aaa;
          margin-bottom: 20px;
          font-size: 14px;
        }

        .sell-swap-form-namespace .sell-swap-form__image-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 15px;
          margin-top: 15px;
        }

        .sell-swap-form-namespace .sell-swap-form__image-box {
          aspect-ratio: 1;
          border: 2px dashed #333;
          border-radius: 12px;
          background: #0b0b0b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .sell-swap-form-namespace .sell-swap-form__image-box:hover {
          border-color: #666;
          background: #111;
        }

        .sell-swap-form-namespace .sell-swap-form__image-box--has-image {
          border-style: solid;
          border-color: #25d366;
        }

        .sell-swap-form-namespace .sell-swap-form__file-input {
          display: none;
        }

        .sell-swap-form-namespace .sell-swap-form__upload-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 15px;
          text-align: center;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }

        .sell-swap-form-namespace .sell-swap-form__icon {
          margin-bottom: 8px;
          font-size: 24px;
          color: #666;
        }

        .sell-swap-form-namespace .sell-swap-form__hint {
          font-size: 11px;
          color: #777;
          margin-top: 4px;
        }

        .sell-swap-form-namespace .sell-swap-form__preview {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .sell-swap-form-namespace .sell-swap-form__preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 10px;
        }

        .sell-swap-form-namespace .sell-swap-form__remove-btn {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(255, 0, 0, 0.8);
          border: none;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 12px;
          font-weight: bold;
          z-index: 2;
        }

        .sell-swap-form-namespace .sell-swap-form__remove-btn:hover {
          background: rgba(255, 0, 0, 1);
        }

        .sell-swap-form-namespace .sell-swap-form__label {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.7);
          padding: 6px;
          text-align: center;
          font-size: 11px;
          z-index: 1;
        }

        .sell-swap-form-namespace .sell-swap-form__image-status {
          margin-top: 15px;
          padding: 10px;
          text-align: center;
          font-size: 14px;
          color: #aaa;
          background: #0b0b0b;
          border-radius: 8px;
          border: 1px solid #333;
        }

        .sell-swap-form-namespace .sell-swap-form__warning {
          color: #ff6b6b;
          font-weight: 500;
        }

        @media (max-width: 900px) {
          .sell-swap-form-namespace .sell-swap-form__image-grid {
            grid-template-columns: repeat(2, 1fr);
            max-width: 400px;
            margin-left: auto;
            margin-right: auto;
          }
        }

        @media (max-width: 480px) {
          .sell-swap-form-namespace .sell-swap-form__image-grid {
            grid-template-columns: 1fr;
          }
        }


         .field {
  display: flex;
  flex-direction: column;
}

.field label {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #ccc;
}
.field input,
.field select {
  font-size: 14px;
  padding: 14px;
  border-radius: 10px;
  background: #0b0b0b;
  border: 1px solid #111;
  color: #fff;
}
.field input:focus,
.field select:focus {
  outline: none;
  border-color: red;
  box-shadow: 0 0 0 1px rgba(255, 0, 0, 0.4);
}    
      `}</style>
    </div>
  );
}