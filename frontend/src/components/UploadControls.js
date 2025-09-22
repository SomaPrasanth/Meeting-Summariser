import React from 'react';

function UploadControls({ onFileChange, onProcessClick, isLoading, isFileSelected }) {
    return (
        <div className="controls">
            <input type="file" accept="audio/*" onChange={onFileChange} />
            <button onClick={onProcessClick} disabled={isLoading || !isFileSelected}>
                {isLoading ? 'Processing...' : 'Process Audio'}
            </button>
        </div>
    );
}

export default UploadControls;

