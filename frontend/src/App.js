import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

// Import our new components
import Header from './components/Header';
import UploadControls from './components/UploadControls';
import LoadingSpinner from './components/LoadingSpinner';
import ResultCard from './components/ResultCard';

import './App.css'; 

function App() {
    // State management remains in the main App component
    const [selectedFile, setSelectedFile] = useState(null);
    const [transcript, setTranscript] = useState("");
    const [summary, setSummary] = useState("");
    const [actionItems, setActionItems] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [copiedKey, setCopiedKey] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        // Reset everything when a new file is chosen
        setError("");
        setTranscript("");
        setSummary("");
        setActionItems("");
        setCopiedKey(null);
    };

    const handleProcess = async () => {
        if (!selectedFile) {
            setError("Please select an audio file first.");
            return;
        }
        setIsLoading(true);
        setError("");
        
        const formData = new FormData();
        formData.append('audioFile', selectedFile);

        try {
            const response = await axios.post("http://127.0.0.1:5001/process-audio", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setTranscript(response.data.transcript);
            setSummary(response.data.summary);
            setActionItems(response.data.action_items);
        } catch (err) {
            setError("An error occurred. Please try again.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCopy = (textToCopy, key) => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopiedKey(key);
            setTimeout(() => setCopiedKey(null), 2000); // Reset after 2 seconds
        }, (err) => {
            console.error('Could not copy text: ', err);
        });
    };

    const hasResults = transcript || summary || actionItems;

    return (
        <div className="App">
            <Header />

            <UploadControls 
                onFileChange={handleFileChange}
                onProcessClick={handleProcess}
                isLoading={isLoading}
                isFileSelected={!!selectedFile}
            />
            
            {error && <p className="error-message">{error}</p>}
            
            {isLoading && <LoadingSpinner />}
            
            {!isLoading && hasResults && (
                <div className="results-grid">
                    {actionItems && (
                        <ResultCard
                            title="Action Items & Decisions"
                            contentToCopy={actionItems}
                            onCopy={handleCopy}
                            copyKey="action"
                            copiedKey={copiedKey}
                        >
                            <ReactMarkdown children={actionItems} />
                        </ResultCard>
                    )}

                    {summary && (
                        <ResultCard
                            title="Summary"
                            contentToCopy={summary}
                            onCopy={handleCopy}
                            copyKey="summary"
                            copiedKey={copiedKey}
                        >
                            <p>{summary}</p>
                        </ResultCard>
                    )}

                    {transcript && (
                        <ResultCard
                            title="Full Transcript"
                            contentToCopy={transcript}
                            onCopy={handleCopy}
                            copyKey="transcript"
                            copiedKey={copiedKey}
                        >
                            <p>{transcript}</p>
                        </ResultCard>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;

