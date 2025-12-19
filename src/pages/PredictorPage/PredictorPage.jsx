import React from 'react';
import { useState } from "react";
import './PredictorPage.css';
import ClinicalForm from '../../components/ClinicalForm/ClinicalForm';
import ResultPreview from '../../components/ResultPreview/ResultPreview';

export default function PredictorPage() {
    const [submitted, setSubmitted] = useState(null);
  return (
    <div className="main-wrapper">
        <div className="top-bar">top bar</div>
        <div className="content-wrapper">
            <div className="left-panel">
                <h2 className="panelTitle">Clinical Data</h2>
                <ClinicalForm onSubmitFinal={setSubmitted} />
            </div>
            <div className="right-panel">
                <h2 className="panelTitle">Result Preview</h2>
                <ResultPreview submitted={submitted} />
            </div>
        </div>
    </div>
  )
}
