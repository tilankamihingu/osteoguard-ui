import React, { useEffect, useMemo, useState } from "react";
import "./ClinicalForm.css";

const initialState = {
  gender: "Male",
  age: "",
  educ: "",
  ses: "1",
  mmse: "",
  eTIV: "",
  nWBV: "",
  asf: "",
};

export default function ClinicalForm({ onSubmitFinal }) {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

  // Submit enabled only when required fields are present
  const canSubmit = useMemo(() => {
    return (
      form.age !== "" &&
      form.educ !== "" &&
      form.ses !== "" &&
      form.mmse !== "" &&
      form.eTIV !== "" &&
      form.nWBV !== "" &&
      form.asf !== "" &&
      !!imageFile
    );
  }, [form, imageFile]);

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!canSubmit) {
      setError("Please fill all required fields and upload an MRI image.");
      return;
    }

    const mmseNum = Number(form.mmse);
    if (Number.isNaN(mmseNum) || mmseNum < 0 || mmseNum > 30) {
      setError("MMSE must be between 0 and 30.");
      return;
    }

    setError("");
    setLoading(true);

    // Build payload exactly as backend expects
    const clinicalPayload = {
      Age: parseInt(form.age, 10),
      EDUC: parseInt(form.educ, 10),
      SES: parseInt(form.ses, 10),
      MMSE: parseInt(form.mmse, 10),
      eTIV: parseInt(form.eTIV, 10),
      nWBV: parseFloat(form.nWBV),
      ASF: parseFloat(form.asf),
      "M/F_M": form.gender === "Male" ? 1 : 0,
    };

    try {
      const formData = new FormData();
      formData.append("image", imageFile); // backend expects this key
      formData.append("clinical", JSON.stringify(clinicalPayload)); // backend expects JSON string

      const response = await fetch("http://127.0.0.1:5001/predict/fusion", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Fusion request failed");
      }

      const result = await response.json();

      onSubmitFinal({
        input: clinicalPayload,
        result,
      });
    } catch (err) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    setForm(initialState);
    setImageFile(null);
    setError("");
    setLoading(false);
    onSubmitFinal(null); // ✅ clear preview
  }

  useEffect(() => {
  if (!imageFile) {
    setImagePreviewUrl("");
    return;
  }

  const url = URL.createObjectURL(imageFile);
  setImagePreviewUrl(url);

  return () => URL.revokeObjectURL(url);
}, [imageFile]);


  return (
    <form className="form" onSubmit={handleSubmit}>
      {/* Gender */}
      <div className="form-field-wrapper">
        <div className="field">
          <label className="label">Gender *</label>
          <div className="radios">
            {["Male", "Female"].map((v) => (
              <label key={v} className="radioItem">
                <input
                  type="radio"
                  name="gender"
                  checked={form.gender === v}
                  onChange={() => update("gender", v)}
                />
                <span>{v}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Age + Educ */}
      <div className="form-field-wrapper">
        <div className="field">
          <label className="label">Age (Int) *</label>
          <input
            type="number"
            inputMode="numeric"
            className="input"
            value={form.age}
            onChange={(e) => update("age", e.target.value)}
          />
        </div>

        <div className="field">
          <label className="label">Years of Education (EDUC) *</label>
          <input
            type="number"
            inputMode="numeric"
            className="input"
            value={form.educ}
            onChange={(e) => update("educ", e.target.value)}
          />
        </div>
      </div>

      {/* SES + MMSE */}
      <div className="form-field-wrapper">
        <div className="field">
          <label className="label">SES (1–5) *</label>
          <select
            className="input"
            value={form.ses}
            onChange={(e) => update("ses", e.target.value)}
          >
            {[1, 2, 3, 4, 5].map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="label">MMSE (0–30) *</label>
          <input
            type="number"
            inputMode="numeric"
            min="0"
            max="30"
            className="input"
            value={form.mmse}
            onChange={(e) => update("mmse", e.target.value)}
          />
        </div>
      </div>

      {/* eTIV */}
      <div className="form-field-wrapper">
        <div className="field">
          <label className="label">eTIV (mm³) *</label>
          <input
            type="number"
            inputMode="numeric"
            className="input"
            value={form.eTIV}
            onChange={(e) => update("eTIV", e.target.value)}
          />
        </div>
      </div>

      {/* nWBV + ASF */}
      <div className="form-field-wrapper">
        <div className="field">
          <label className="label">nWBV (decimal) *</label>
          <input
            type="number"
            step="0.01"
            className="input"
            value={form.nWBV}
            onChange={(e) => update("nWBV", e.target.value)}
          />
        </div>

        <div className="field">
          <label className="label">ASF (decimal) *</label>
          <input
            type="number"
            step="0.01"
            className="input"
            value={form.asf}
            onChange={(e) => update("asf", e.target.value)}
          />
        </div>
      </div>

      {/* MRI Upload */}
      <div className="form-field-wrapper">
        <div className="field">
          <label className="label">MRI Image *</label>
          <div className="uploadBox">
            <input
              type="file"
              accept="image/png,image/jpeg"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />

            {imageFile && (
              <p className="fileHint">
                Selected: <span>{imageFile.name}</span>
              </p>
            )}

            {imagePreviewUrl && (
              <div className="imgPreviewWrap">
                <img className="imgPreview" src={imagePreviewUrl} alt="MRI preview" />
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="form-field-wrapper">
          <div className="error">{error}</div>
        </div>
      )}

      {/* Actions */}
      <div className="actions">
        <button type="button" className="btn btnGhost" onClick={handleCancel} disabled={loading}>
          Cancel
        </button>

        <button type="submit" className="btn btnPrimary" disabled={!canSubmit || loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>

      <p className="smallNote">Fields marked * are required.</p>
    </form>
  );
}