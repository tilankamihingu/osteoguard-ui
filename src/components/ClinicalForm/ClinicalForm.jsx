import React from 'react';
import { useMemo, useState } from "react";
import "./ClinicalForm.css";

const initialState = {
  fullName: "",
  age: "",
  weight: "",
  height: "",
  sex: "Male",
  fracture: "No",
  medication: "",
  waitingTime: "",
  bmd: "",
};

export default function ClinicalForm({ onSubmitFinal }) {
  const [form, setForm] = useState(initialState);
  const [xrayFile, setXrayFile] = useState(null);
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => {
    // Minimal required fields for now
    return (
      form.fullName.trim() &&
      form.age &&
      form.weight &&
      form.height &&
      form.bmd &&
      xrayFile
    );
  }, [form, xrayFile]);

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleFile(e) {
    const f = e.target.files?.[0];
        if (!f) return;

        const okType = ["image/png", "image/jpeg", "image/jpg"].includes(f.type);
        if (!okType) {
        setError("Please upload a PNG or JPG image.");
        return;
        }
        if (f.size > 5 * 1024 * 1024) {
        setError("File too large. Max 5MB.");
        return;
        }

        setError("");
        setXrayFile(f);
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (!canSubmit) {
        setError("Please fill required fields and upload an X-ray image.");
        return;
        }

        setError("");

        // Build the submitted payload
        const payload = {
        ...form,
        xrayFile,
        submittedAt: new Date().toISOString(),
        };

        onSubmitFinal(payload);
    }

    function handleCancel() {
        setForm(initialState);
        setXrayFile(null);
        setError("");
        onSubmitFinal(null); // clear preview
    }
  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-field-wrapper">
        {/* Full name */}
        <div className="field">
          <label className="label">Full Name *</label>
          <input
            className="input"
            placeholder="Patient Name"
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
          />
        </div>
      </div>
      <div className="form-field-wrapper">
        <div className="field">
          <label className="label">Age *</label>
          <input
            type="number"
            className="input"
            value={form.age}
            onChange={(e) => update("age", e.target.value)}
          />
        </div>

        <div className="field">
          <label className="label">Weight (kg) *</label>
          <input
            type="number"
            className="input"
            value={form.weight}
            onChange={(e) => update("weight", e.target.value)}
          />
        </div>

        <div className="field">
          <label className="label">Height (cm) *</label>
          <input
            type="number"
            className="input"
            value={form.height}
            onChange={(e) => update("height", e.target.value)}
          />
        </div>
      </div>
      <div className="form-field-wrapper">
        {/* Sex */}
        <div className="field">
          <label className="label">Sex</label>
          <div className="radios">
            {["Male", "Female"].map((v) => (
              <label key={v} className="radioItem">
                <input
                  type="radio"
                  name="sex"
                  checked={form.sex === v}
                  onChange={() => update("sex", v)}
                />
                <span>{v}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Fracture */}
        <div className="field">
          <label className="label">Fracture</label>
          <div className="radios">
            {["Yes", "No"].map((v) => (
              <label key={v} className="radioItem">
                <input
                  type="radio"
                  name="fracture"
                  checked={form.fracture === v}
                  onChange={() => update("fracture", v)}
                />
                <span>{v}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className="form-field-wrapper">
        <div className="field">
          <label className="label">Medication</label>
          <input
            className="input"
            placeholder="e.g., Anticonvulsant"
            value={form.medication}
            onChange={(e) => update("medication", e.target.value)}
          />
        </div>

        <div className="field">
          <label className="label">Waiting Time</label>
          <input
            type="number"
            className="input"
            placeholder="minutes"
            value={form.waitingTime}
            onChange={(e) => update("waitingTime", e.target.value)}
          />
        </div>
      </div>
      <div className="form-field-wrapper">
        {/* BMD */}
        <div className="field">
          <label className="label">Bone Mineral Density (BMD) *</label>
          <input
            type="number"
            step="0.0001"
            className="input"
            value={form.bmd}
            onChange={(e) => update("bmd", e.target.value)}
          />
        </div>
      </div>
      <div className="form-field-wrapper">
        {/* X-ray Upload */}
        <div className="field">
          <label className="label">X-ray *</label>
          <div className="uploadBox">
            <input type="file" accept="image/png,image/jpeg" onChange={handleFile} />
            {xrayFile && (
              <p className="fileHint">
                Selected: <span>{xrayFile.name}</span>
              </p>
            )}
          </div>
        </div>

        {/* Error */}
        {error && <div className="error">{error}</div>}
      </div>

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
  )
}
