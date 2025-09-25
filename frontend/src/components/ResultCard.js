import React from 'react';

function ResultCard({ title, contentToCopy, onCopy, copyKey, copiedKey, onExport, children }) {
    
    const isCopied = copiedKey === copyKey;

    const createFileName = () => {
        // Creates a clean filename like "action-items-decisions-export.txt"
        return `${title.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}-export.txt`;
    };

    return (
        <div className="card">
            <div className="card-header">
                <h2>{title}</h2>
                <div className="card-actions">
                    <button 
                        onClick={() => onExport(contentToCopy, createFileName())} 
                        className="copy-btn" // Reusing copy-btn style for consistency
                    >
                        Export as .txt
                    </button>
                    <button 
                        onClick={() => onCopy(contentToCopy, copyKey)} 
                        className={`copy-btn ${isCopied ? 'copied' : ''}`}
                    >
                        {isCopied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
            </div>
            <div className="card-content">
                {children}
            </div>
        </div>
    );
}

export default ResultCard;

