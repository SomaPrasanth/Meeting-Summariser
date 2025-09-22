import React from 'react';

function LoadingSpinner() {
    return (
        <div className="loading-container">
            <div className="spinner"></div>
            <p>Analyzing audio... This may take a moment.</p>
        </div>
    );
}

export default LoadingSpinner;

