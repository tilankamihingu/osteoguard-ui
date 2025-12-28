import React, { useState } from "react";
import "./ResultPreview.css";

export default function ResultPreview({ submitted }) {
  const [showModal, setShowModal] = useState(false);

  if (!submitted) {
    return (
      <div className="emptyState">
        <h3>No result yet</h3>
        <p>
          Fill the form and click <b>Submit</b> to preview results here.
        </p>
      </div>
    );
  }

  // Read values safely from submitted payload
  const genderLabel = submitted["M/F_M"] === 1 ? "Male" : "Female";

  return (
    <div className="preview">
      <div className="previewTop">
        <div>
          <h3 className="name">Input Summary</h3>
          <p className="meta">
            Age: {submitted.Age} • Gender: {genderLabel} • MMSE: {submitted.MMSE}
          </p>
        </div>

        <button className="btnSmall" onClick={() => setShowModal(true)}>
          View Full Result
        </button>
      </div>

      {/* Submitted JSON Preview */}
      <div className="card">
        <p className="cardTitle">Submitted Input (JSON)</p>
        <pre className="jsonBox">{JSON.stringify(submitted, null, 2)}</pre>
      </div>

      {/* Prediction placeholder */}
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
              {/* Inputs breakdown */}
              <div className="card">
                <p className="cardTitle">Clinical Inputs</p>
                <ul className="list">
                  <li>
                    <b>Gender:</b> {genderLabel} ({submitted["M/F_M"]})
                  </li>
                  <li>
                    <b>Age:</b> {submitted.Age}
                  </li>
                  <li>
                    <b>Years of Education (Educ):</b> {submitted.Educ}
                  </li>
                  <li>
                    <b>SES:</b> {submitted.SES}
                  </li>
                  <li>
                    <b>MMSE:</b> {submitted.MMSE}
                  </li>
                  <li>
                    <b>eTIV:</b> {submitted.eTIV}
                  </li>
                  <li>
                    <b>nWBV:</b> {submitted.nWBV}
                  </li>
                  <li>
                    <b>ASF:</b> {submitted.ASF}
                  </li>
                </ul>
              </div>

              {/* Full JSON */}
              <div className="card">
                <p className="cardTitle">Full JSON Sent to API</p>
                <pre className="jsonBox">{JSON.stringify(submitted, null, 2)}</pre>
              </div>

              {/* Prediction placeholder */}
              <div className="card">
                <p className="cardTitle">Prediction Result (placeholder)</p>
                <p className="muted">
                  We will show: Alzheimer stage/class + confidence.
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
  );
}
