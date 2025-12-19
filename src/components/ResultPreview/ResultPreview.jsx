import React from 'react';
import { useEffect, useState } from "react";
import "./ResultPreview.css";

export default function ResultPreview({ submitted }) {
    const [previewUrl, setPreviewUrl] = useState("");
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (!submitted?.xrayFile) {
        setPreviewUrl("");
        return;
        }
        const url = URL.createObjectURL(submitted.xrayFile);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [submitted]);

    if (!submitted) {
        return (
        <div className="emptyState">
            <h3>No result yet</h3>
            <p>Fill the form and click <b>Submit</b> to preview results here.</p>
        </div>
        );
    }
  return (
    <div className="preview">
      <div className="previewTop">
        <div>
          <h3 className="name">{submitted.fullName}</h3>
          <p className="meta">
            Age: {submitted.age} • Sex: {submitted.sex} • BMD: {submitted.bmd}
          </p>
        </div>
        <button className="btnSmall" onClick={() => setShowModal(true)}>
          View Full Result
        </button>
      </div>

      <div className="card">
        <p className="cardTitle">X-ray Preview</p>
        {previewUrl ? (
          <img className="xray" src={previewUrl} alt="X-ray preview" />
        ) : (
          <p className="muted">No image preview</p>
        )}
      </div>

      <div className="card">
        <p className="cardTitle">Prediction (placeholder)</p>
        <p className="muted">
          Next step: connect backend API and show predicted class + confidence.
        </p>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modalOverlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h3>Full Result View</h3>
              <button className="closeBtn" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>

            <div className="modalBody">
              <div className="card">
                <p className="cardTitle">Patient Details</p>
                <ul className="list">
                  <li><b>Name:</b> {submitted.fullName}</li>
                  <li><b>Age:</b> {submitted.age}</li>
                  <li><b>Weight:</b> {submitted.weight} kg</li>
                  <li><b>Height:</b> {submitted.height} cm</li>
                  <li><b>Sex:</b> {submitted.sex}</li>
                  <li><b>Fracture:</b> {submitted.fracture}</li>
                  <li><b>Medication:</b> {submitted.medication || "-"}</li>
                  <li><b>Waiting Time:</b> {submitted.waitingTime || "-"} </li>
                  <li><b>BMD:</b> {submitted.bmd}</li>
                </ul>
              </div>

              <div className="card">
                <p className="cardTitle">X-ray</p>
                {previewUrl && <img className="xray" src={previewUrl} alt="X-ray" />}
              </div>

              <div className="card">
                <p className="cardTitle">Prediction Result (placeholder)</p>
                <p className="muted">
                  We will show: Osteoporosis / Osteopenia / Normal + confidence.
                </p>
              </div>
            </div>

            <p className="disclaimer">
              Research prototype — not for clinical diagnosis.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
