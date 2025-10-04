import React, { useState, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

// Import our components
import Header from './components/Header';
import UploadControls from './components/UploadControls';
import LoadingSpinner from './components/LoadingSpinner';
import ResultCard from './components/ResultCard';
import CustomAnalysis from './components/CustomAnalysis';

import './App.css'; 

function App() {
    const BACKEND_URL = 'https://meeting-summariser-018c.onrender.com'
    // --- State Management ---
    const [selectedFile, setSelectedFile] = useState(null);
    const [transcript, setTranscript] = useState("");
    const [summary, setSummary] = useState("");
    const [actionItems, setActionItems] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [copiedKey, setCopiedKey] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [customResult, setCustomResult] = useState("");
    
    // NEW: State for transcript truncation
    const [isTranscriptExpanded, setIsTranscriptExpanded] = useState(false);

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    // --- Core Functions ---
    const resetState = (clearFile = false) => {
        if (clearFile) setSelectedFile(null);
        setError("");
        setTranscript("");
        setSummary("");
        setActionItems("");
        setCopiedKey(null);
        setCustomResult("");
        setIsTranscriptExpanded(false); // Reset transcript view
    };

    const processAudioData = async (audioData, fileName) => {
        setIsLoading(true);
        resetState();
        
        const formData = new FormData();
        formData.append('audioFile', audioData, fileName);

        try {
            const response = await axios.post(`${BACKEND_URL}/process-audio`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setTranscript(response.data.transcript);
            setSummary(response.data.summary);
            setActionItems(response.data.action_items);
        } catch (err) {
            setError("An error occurred during analysis. Please try again.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            resetState();
        }
    };

    const handleProcess = () => {
        if (selectedFile) {
            processAudioData(selectedFile, selectedFile.name);
        } else {
            setError("Please select an audio file first.");
        }
    };

    const handleCustomAnalysis = async (customPrompt) => {
        setIsAnalyzing(true);
        setCustomResult("");
        setError("");
        try {
            const response = await axios.post(`${BACKEND_URL}/custom-analysis`, {
                transcript: transcript,
                custom_prompt: customPrompt
            });
            setCustomResult(response.data.result);
        } catch (err) {
            setError("Custom analysis failed. Please try again.");
            console.error("Custom analysis error:", err);
        } finally {
            setIsAnalyzing(false);
        }
    };
    
    const handleStartRecording = async () => {
        resetState(true);
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                audio: true,
                video: true
            });
            setIsRecording(true);
            audioChunksRef.current = [];
            const recorder = new MediaRecorder(stream);
            mediaRecorderRef.current = recorder;

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) audioChunksRef.current.push(event.data);
            };

            recorder.onstop = () => {
                const mimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
                const fileExtension = mimeType.split('/')[1].split(';')[0];
                const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
                const fileName = `meeting-recording-${new Date().toISOString().replace(/[:.]/g, '-')}.${fileExtension}`;
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
        }
        setIsRecording(false);
    };
    
    const handleCopy = (textToCopy, key) => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopiedKey(key);
            setTimeout(() => setCopiedKey(null), 2000);
        }, (err) => console.error('Could not copy text: ', err));
    };

    const handleExport = (content, fileName) => {
        const blob = new Blob([content.trim()], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const hasResults = transcript || summary || actionItems;
    
    // NEW: Logic for truncating the transcript
    const transcriptLines = transcript.split('\n');
    const isTranscriptLong = transcript.length > 1000;
    
    const truncatedTranscript = isTranscriptLong ? transcript.slice(0, 1000) : transcript;


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
                <CustomAnalysis onAnalyze={handleCustomAnalysis} isLoading={isAnalyzing} />
            )}

            {isAnalyzing && <LoadingSpinner />}
            {customResult && (
                <ResultCard title="Custom Analysis Result" contentToCopy={customResult} onCopy={handleCopy} onExport={handleExport} copyKey="custom" copiedKey={copiedKey}>
                    <ReactMarkdown children={customResult} />
                </ResultCard>
            )}

            {!isLoading && hasResults && (
                <div className="results-grid">
                    {actionItems && (
                        <ResultCard title="Action Items & Decisions" contentToCopy={actionItems} onCopy={handleCopy} onExport={handleExport} copyKey="action" copiedKey={copiedKey}>
                            <ReactMarkdown children={actionItems} />
                        </ResultCard>
                    )}
                    {summary && (
                        <ResultCard title="Summary" contentToCopy={summary} onCopy={handleCopy} onExport={handleExport} copyKey="summary" copiedKey={copiedKey}>
                            <p>{summary}</p>
                        </ResultCard>
                    )}
                    {transcript && (
                        <ResultCard title="Full Transcript" contentToCopy={transcript} onCopy={handleCopy} onExport={handleExport} copyKey="transcript" copiedKey={copiedKey}>
                            <p style={{whiteSpace: 'pre-wrap'}}>
                                {isTranscriptExpanded ? transcript : truncatedTranscript}
                            </p>
                            {isTranscriptLong && (
                                <button onClick={() => setIsTranscriptExpanded(!isTranscriptExpanded)} className="read-more-btn">
                                    {isTranscriptExpanded ? 'Show Less' : 'Read More...'}
                                </button>
                            )}
                        </ResultCard>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;

