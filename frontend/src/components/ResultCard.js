import React from 'react';

function ResultCard({ title, contentToCopy, onCopy, copyKey, copiedKey, children }) {
    
    const isCopied = copiedKey === copyKey;

    return (
        <div className="card">
            <div className="card-header">
                <h2>{title}</h2>
                <button 
                    onClick={() => onCopy(contentToCopy, copyKey)} 
                    className={`copy-btn ${isCopied ? 'copied' : ''}`}
                >
                    {isCopied ? 'Copied!' : 'Copy'}
                </button>
            </div>
            <div className="card-content">
                {children}
            </div>
        </div>
    );
}

export default ResultCard;
