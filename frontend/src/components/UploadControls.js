import React from 'react';

function UploadControls({ 
    onFileChange, 
    onProcessClick, 
    isLoading, 
    isFileSelected,
    isRecording,
    onStartRecording,
    onStopRecording 
}) {
    return (
        <div className="controls">
            <div className="upload-section">
                <input type="file" accept="audio/*" onChange={onFileChange} disabled={isRecording} />
                <button onClick={onProcessClick} disabled={isLoading || !isFileSelected || isRecording}>
                    {isLoading ? 'Processing...' : 'Process Audio'}
                </button>
            </div>

            <div className="separator">OR</div>

            <div className="record-section">
                {!isRecording ? (
                    <button onClick={onStartRecording} disabled={isLoading} className="record-btn">
                        Record Live Meeting
                    </button>
                ) : (
                    <button onClick={onStopRecording} className="record-btn stop">
                        <span className="record-indicator"></span>
                        Stop Recording
                    </button>
                )}
            </div>
        </div>
    );
}

export default UploadControls;

