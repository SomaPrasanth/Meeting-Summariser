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
        <div className="controls-container">
            {isRecording ? (
                <div className="recording-controls">
                    <button onClick={onStopRecording} className="stop-button">
                        <span className="recording-dot stop"></span>
                        Stop Recording
                    </button>
                    <p className="recording-status">Recording audio from your selected tab...</p>
                </div>
            ) : (
                <div className="default-controls">
                    <div className="upload-section">
                        <p>Option 1: Upload an audio file</p>
                        <input type="file" accept="audio/*" onChange={onFileChange} disabled={isLoading} />
                        <button onClick={onProcessClick} disabled={isLoading || !isFileSelected}>
                            {isLoading ? 'Processing...' : 'Process Uploaded File'}
                        </button>
                    </div>

                    <div className="divider">OR</div>

                    <div className="record-section">
                        <p>Option 2: Record a live meeting</p>
                        <button onClick={onStartRecording} disabled={isLoading} className="record-button">
                             <span className="recording-dot"></span>
                            Record Live Meeting
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UploadControls;

