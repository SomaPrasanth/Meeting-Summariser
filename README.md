Smart Meeting Assistant
The Smart Meeting Assistant is a full-stack web application designed to automatically transcribe, summarize, and analyze audio from meetings, lectures, or any recorded conversation. It leverages powerful AI models to extract key insights, saving users time and effort in post-meeting note-taking and follow-up.

✨ Features
Audio Transcription: Utilizes OpenAI's Whisper for highly accurate, multilingual speech-to-text conversion.

AI-Powered Summarization: Employs the Google Gemini API to generate concise, abstractive summaries of the entire transcript.

Action Item & Decision Extraction: Automatically identifies and lists key tasks, assignments, and decisions made during the conversation.

Live Meeting Recording: Allows users to record audio directly from a browser tab (e.g., Google Meet, Zoom, Teams) using the MediaRecorder API.

Custom Analysis Engine: Empowers users to ask specific questions or give commands in natural language to analyze the meeting transcript for custom insights.

Polished User Interface: A clean, responsive, and intuitive UI built with React, featuring a card-based layout and a "Read More" option for long transcripts.

Export Functionality: Allows users to download individual results (summary, transcript, etc.) as .txt files for easy sharing and archiving.

🛠️ Tech Stack
This project is built with a modern, separated frontend and backend architecture.

Category

Technology

Frontend

React.js, Axios, ReactMarkdown

Backend

Python 3.10+, Flask

AI / ML

Google Gemini API (for summarization & analysis), OpenAI Whisper (for transcription)

Styling

CSS3 (Flexbox, Grid)

📂 Project Structure
The project is organized into two main directories:

meeting-summarizer/
├── backend/      # Contains the Python Flask server, API logic, and AI integrations
└── frontend/     # Contains the React.js client-side application and components

🚀 Getting Started
Follow these instructions to set up and run the project on your local machine.

Prerequisites
Python 3.10+

Node.js and npm (or yarn)

ffmpeg: A command-line tool required by Whisper.

macOS: brew install ffmpeg

Windows: choco install ffmpeg

Linux (Debian/Ubuntu): sudo apt update && sudo apt install ffmpeg

Backend Setup
Navigate to the backend directory:

cd backend

Create and activate a Python virtual environment:

python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

Install dependencies:

pip install -r requirements.txt

Create an environment file:

Create a file named .env in the backend directory.

Get a free API key from Google AI Studio.

Add your API key to the .env file like this:

GEMINI_API_KEY=YOUR_API_KEY_HERE

Frontend Setup
Navigate to the frontend directory:

cd frontend

Install dependencies:

npm install

Running the Application
You need to run both the backend and frontend servers simultaneously in two separate terminals.

Terminal 1 (Backend):

cd backend
source venv/bin/activate
python app.py

The backend server will start on http://127.0.0.1:5001.

Terminal 2 (Frontend):

cd frontend
npm start

The React application will open in your browser at http://localhost:3000.

Usage
Upload a File: Click "Choose File" to select a pre-recorded audio file (e.g., MP3, WAV, M4A) and click "Process Audio".

Record a Meeting: Click "Record Live Meeting", select the browser tab you wish to record (ensuring "Share tab audio" is checked), and click "Stop Recording" when finished.

Analyze: Once results are displayed, use the "Custom Analysis Engine" to ask specific questions about the transcript.
