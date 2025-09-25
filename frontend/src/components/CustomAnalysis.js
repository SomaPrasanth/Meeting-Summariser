import React, { useState } from 'react';

function CustomAnalysis({ onAnalyze, isLoading }) {
    const [prompt, setPrompt] = useState('');
    const [placeholder] = useState('e.g., List all questions that were asked during the meeting.');

    const handleAnalyzeClick = () => {
        if (prompt.trim()) {
            onAnalyze(prompt);
        }
    };

    return (
        <div className="custom-analysis-container">
            <h3>Custom Analysis Engine</h3>
            <p>Ask a specific question or give a command about the transcript below.</p>
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={placeholder}
                rows={3}
                disabled={isLoading}
            />
            <button onClick={handleAnalyzeClick} disabled={isLoading || !prompt.trim()}>
                {isLoading ? 'Analyzing...' : 'Run Analysis'}
            </button>
        </div>
    );
}

export default CustomAnalysis;

