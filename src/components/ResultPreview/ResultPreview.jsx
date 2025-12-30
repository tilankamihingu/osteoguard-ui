import React, { useState } from "react";
import "./ResultPreview.css";

function pct(n) {
  if (typeof n !== "number" || Number.isNaN(n)) return "-";
  return `${Math.round(n * 100)}%`;
}

function sortProbs(probObj) {
  return Object.entries(probObj || {}).sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0));
}

function getTop(probObj) {
  const arr = sortProbs(probObj);
  return arr.length ? { label: arr[0][0], value: arr[0][1] } : { label: "-", value: 0 };
}

export default function ResultPreview({ submitted }) {
  const [showModal, setShowModal] = useState(false);
  const [tab, setTab] = useState("combined"); // combined | clinical | image
  const [showJson, setShowJson] = useState(false);

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

  const input = submitted.input || {};
  const result = submitted.result || {};

  const combined = result.combined_probabilities || {};
  const clinical = result.clinical_probabilities || {};
  const image = result.image_probabilities || {};

  const activeProbs = tab === "clinical" ? clinical : tab === "image" ? image : combined;

  const topCombined = getTop(combined);
  const genderLabel = input["M/F_M"] === 1 ? "Male" : "Female";

  const fusionMethod = result.fusion_method || "Fusion";
  const clinicalW = typeof result.clinical_weight === "number" ? result.clinical_weight : null;
  const imageW = typeof result.image_weight === "number" ? result.image_weight : null;

  const rows = sortProbs(activeProbs);

  return (
    <div className="preview">
      {/* Header */}
      <div className="previewTop">
        <div>
          <h3 className="name">Result Preview</h3>
          <p className="meta">
            Age: {input.Age} • Gender: {genderLabel} • MMSE: {input.MMSE}
          </p>
        </div>

        <button className="btnSmall" onClick={() => setShowModal(true)}>
          View Full Result
        </button>
      </div>

      {/* Final Diagnosis */}
      <div className="card">
        <p className="cardTitle">Final Diagnosis</p>

        <div className="resultHero">
          <div>
            <div className="predLabel">{result.pred_label || topCombined.label}</div>
            <div className="predSub">
              Confidence (combined): <b>{pct(topCombined.value)}</b>
            </div>
            <div className="tiny">
              Method: <b>{fusionMethod}</b>
              {clinicalW != null && imageW != null ? (
                <>
                  {" "}
                  • Weights: Clinical <b>{clinicalW}</b> • Image <b>{imageW}</b>
                </>
              ) : null}
            </div>
          </div>

          <div className="badge">#{result.pred_index ?? "-"}</div>
        </div>
      </div>

      {/* Key Details */}
      <div className="card">
        <p className="cardTitle">Patient Inputs</p>

        <div className="grid2">
          <div className="kv">
            <span>Gender</span>
            <b>{genderLabel}</b>
          </div>
          <div className="kv">
            <span>Age</span>
            <b>{input.Age}</b>
          </div>
          <div className="kv">
            <span>Education (EDUC)</span>
            <b>{input.EDUC}</b>
          </div>
          <div className="kv">
            <span>SES</span>
            <b>{input.SES}</b>
          </div>
          <div className="kv">
            <span>MMSE</span>
            <b>{input.MMSE}</b>
          </div>
          <div className="kv">
            <span>eTIV</span>
            <b>{input.eTIV}</b>
          </div>
          <div className="kv">
            <span>nWBV</span>
            <b>{input.nWBV}</b>
          </div>
          <div className="kv">
            <span>ASF</span>
            <b>{input.ASF}</b>
          </div>
        </div>
      </div>

      {/* Probabilities */}
      <div className="card">
        <div className="cardTitleRow">
          <p className="cardTitle">Probabilities</p>
          <div className="tabs">
            <button
              type="button"
              className={`tabBtn ${tab === "combined" ? "active" : ""}`}
              onClick={() => setTab("combined")}
            >
              Combined
            </button>
            <button
              type="button"
              className={`tabBtn ${tab === "clinical" ? "active" : ""}`}
              onClick={() => setTab("clinical")}
            >
              Clinical
            </button>
            <button
              type="button"
              className={`tabBtn ${tab === "image" ? "active" : ""}`}
              onClick={() => setTab("image")}
            >
              Image
            </button>
          </div>
        </div>

        {rows.length === 0 ? (
          <p className="muted">No probabilities available.</p>
        ) : (
          <div className="probList">
            {rows.map(([label, value]) => {
              const p = Math.round((value || 0) * 100);
              return (
                <div key={label} className="probItem">
                  <div className="probTop">
                    <span className="probLabel">{label}</span>
                    <span className="probPct">{p}%</span>
                  </div>
                  <div className="bar">
                    <div className="barFill" style={{ width: `${p}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Full Result Modal */}
      {showModal && (
        <div className="modalOverlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h3>Full Result</h3>
              <div className="modalHeaderActions">
                <button
                  type="button"
                  className="btnSmall"
                  onClick={() => setShowJson((v) => !v)}
                >
                  {showJson ? "Show Human View" : "Show JSON"}
                </button>
                <button className="closeBtn" onClick={() => setShowModal(false)}>
                  ✕
                </button>
              </div>
            </div>

            <div className="modalBody">
              {/* Human view */}
              {!showJson && (
                <>
                  <div className="card">
                    <p className="cardTitle">Diagnosis Summary</p>
                    <div className="summaryRow">
                      <div className="summaryMain">{result.pred_label || "-"}</div>
                      <div className="summarySide">
                        Confidence: <b>{pct(topCombined.value)}</b>
                      </div>
                    </div>
                    <p className="tiny">
                      Method: <b>{fusionMethod}</b>
                      {clinicalW != null && imageW != null ? (
                        <>
                          {" "}
                          • Weights: Clinical <b>{clinicalW}</b> • Image <b>{imageW}</b>
                        </>
                      ) : null}
                    </p>
                  </div>

                  <div className="card">
                    <p className="cardTitle">Probabilities (Combined)</p>
                    <div className="probList">
                      {sortProbs(combined).map(([label, value]) => {
                        const p = Math.round((value || 0) * 100);
                        return (
                          <div key={label} className="probItem">
                            <div className="probTop">
                              <span className="probLabel">{label}</span>
                              <span className="probPct">{p}%</span>
                            </div>
                            <div className="bar">
                              <div className="barFill" style={{ width: `${p}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="card">
                    <p className="cardTitle">Patient Inputs</p>
                    <div className="grid2">
                      <div className="kv"><span>Gender</span><b>{genderLabel}</b></div>
                      <div className="kv"><span>Age</span><b>{input.Age}</b></div>
                      <div className="kv"><span>EDUC</span><b>{input.EDUC}</b></div>
                      <div className="kv"><span>SES</span><b>{input.SES}</b></div>
                      <div className="kv"><span>MMSE</span><b>{input.MMSE}</b></div>
                      <div className="kv"><span>eTIV</span><b>{input.eTIV}</b></div>
                      <div className="kv"><span>nWBV</span><b>{input.nWBV}</b></div>
                      <div className="kv"><span>ASF</span><b>{input.ASF}</b></div>
                    </div>
                  </div>
                </>
              )}

              {/* JSON view */}
              {showJson && (
                <>
                  <div className="card">
                    <p className="cardTitle">Clinical Inputs Sent (JSON)</p>
                    <pre className="jsonBox">{JSON.stringify(input, null, 2)}</pre>
                  </div>
                  <div className="card">
                    <p className="cardTitle">API Response (JSON)</p>
                    <pre className="jsonBox">{JSON.stringify(result, null, 2)}</pre>
                  </div>
                </>
              )}
            </div>

            <p className="disclaimer">Research prototype — not for clinical diagnosis.</p>
          </div>
        </div>
      )}
    </div>
  );
}
