import React, { useMemo, useState } from "react";
import "./ClinicalForm.css";

const initialState = {
  gender: "Male", // UI only
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

  // Submit enabled only when required fields are present
  const canSubmit = useMemo(() => {
    return (
      form.age !== "" &&
      form.educ !== "" &&
      form.ses !== "" &&
      form.mmse !== "" &&
      form.eTIV !== "" &&
      form.nWBV !== "" &&
      form.asf !== ""
    );
  }, [form]);

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!canSubmit) {
      setError("Please fill all required fields.");
      return;
    }

    // Basic validation
    const mmseNum = Number(form.mmse);
    if (Number.isNaN(mmseNum) || mmseNum < 0 || mmseNum > 30) {
      setError("MMSE must be a number between 0 and 30.");
      return;
    }

    setError("");

    // Build payload EXACTLY as backend expects
    const payload = {
      Age: parseInt(form.age, 10),
      Educ: parseInt(form.educ, 10),
      SES: parseInt(form.ses, 10),
      MMSE: parseInt(form.mmse, 10),
      eTIV: parseInt(form.eTIV, 10),
      nWBV: parseFloat(form.nWBV),
      ASF: parseFloat(form.asf),
      "M/F_M": form.gender === "Male" ? 1 : 0,
    };

    onSubmitFinal(payload);
  }

  function handleCancel() {
    setForm(initialState);
    setError("");
    onSubmitFinal(null); // clear preview
  }

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

      {/* Error */}
      {error && (
        <div className="form-field-wrapper">
          <div className="error">{error}</div>
        </div>
      )}

      {/* Actions */}
      <div className="actions">
        <button type="button" className="btn btnGhost" onClick={handleCancel}>
          Cancel
        </button>

        <button type="submit" className="btn btnPrimary" disabled={!canSubmit}>
          Submit
        </button>
      </div>

      <p className="smallNote">Fields marked * are required.</p>
    </form>
  );
}
