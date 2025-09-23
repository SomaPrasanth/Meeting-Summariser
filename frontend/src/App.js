import React, { useState, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

// Import our components
import Header from './components/Header';
import UploadControls from './components/UploadControls';
import LoadingSpinner from './components/LoadingSpinner';
import ResultCard from './components/ResultCard';

import './App.css'; 

function App() {
    // --- State Management ---
    const [selectedFile, setSelectedFile] = useState(null);
    const [transcript, setTranscript] = useState("");
    const [summary, setSummary] = useState("");
    const [actionItems, setActionItems] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [copiedKey, setCopiedKey] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    
    // Refs for recording logic
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    // --- Core Functions ---
    const processAudioData = async (audioData, fileName) => {
        setIsLoading(true);
        setError("");
        
        const formData = new FormData();
        formData.append('audioFile', audioData, fileName);

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

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setError("");
            setTranscript("");
            setSummary("");
            setActionItems("");
            setCopiedKey(null);
        }
    };

    const handleProcess = () => {
        if (selectedFile) {
            processAudioData(selectedFile, selectedFile.name);
        } else {
            setError("Please select an audio file first.");
        }
    };

    // --- Recording Logic ---
    const handleStartRecording = async () => {
        setError("");
        setTranscript("");
        setSummary("");
        setActionItems("");
        setSelectedFile(null);

        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                audio: true,
                video: true 
            });

            setIsRecording(true);
            audioChunksRef.current = [];
            
            // --- FIX: Let the browser choose the mimeType ---
            // We remove the specific mimeType to allow the browser to use its default.
            const recorder = new MediaRecorder(stream);
            mediaRecorderRef.current = recorder;

            // --- FIX: Determine the file extension from the browser's choice ---
            let fileExtension = 'webm'; // Default
            if (recorder.mimeType) {
                // e.g., 'audio/webm;codecs=opus' -> 'webm'
                fileExtension = recorder.mimeType.split('/')[1].split(';')[0];
            }
            
            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            recorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType });
                
                // --- FIX: Use the determined file extension for the filename ---
                const timestamp = new Date().toISOString().replace(/:/g, '-');
                const fileName = `meeting-recording-${timestamp}.${fileExtension}`;

                processAudioData(audioBlob, fileName);
                
                stream.getTracks().forEach(track => track.stop());
            };

            recorder.start();

        } catch (err) {
            setError("Permission denied or an error occurred. Please allow screen/tab sharing to record.");
            console.error("Recording error:", err);
            setIsRecording(false);
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };
    
    // --- Utility Functions ---
    const handleCopy = (textToCopy, key) => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopiedKey(key);
            setTimeout(() => setCopiedKey(null), 2000);
        });
    };

    const handleExport = () => {
        const fileContent = `
=================================
 Meeting Summary
=================================
${summary}
=================================
 Action Items & Decisions
=================================
${actionItems}
        `;

        const blob = new Blob([fileContent.trim()], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const timestamp = new Date().toISOString().slice(0, 10);
        link.download = `meeting-summary-${timestamp}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
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
                isRecording={isRecording}
                onStartRecording={handleStartRecording}
                onStopRecording={handleStopRecording}
            />
            
            {error && <p className="error-message">{error}</p>}
            
            {isLoading && <LoadingSpinner />}
            
            {!isLoading && hasResults && (
                <div className="export-container">
                    <button onClick={handleExport}>Export as .txt</button>
                </div>
            )}
            
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

