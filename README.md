# Smart Meeting Assistant

> A full-stack web application that automatically transcribes, summarizes, and analyzes meeting audio using powerful AI models to extract key insights.



## ✨ Features

-   **Audio Transcription**: Utilizes OpenAI's Whisper for highly accurate, multilingual speech-to-text conversion.
-   **AI-Powered Summarization**: Employs the Google Gemini API to generate concise, abstractive summaries of the entire transcript.
-   **Action Item & Decision Extraction**: Automatically identifies and lists key tasks, assignments, and decisions made during the conversation.
-   **Live Meeting Recording**: Allows users to record audio directly from a browser tab (e.g., Google Meet, Zoom, Teams) using the `MediaRecorder` API.
-   **Custom Analysis Engine**: Empowers users to ask specific questions or give commands in natural language to analyze the meeting transcript for custom insights.
-   **Polished User Interface**: A clean, responsive, and intuitive UI built with React, featuring a card-based layout and a "Read More" option for long transcripts.
-   **Export Functionality**: Allows users to download individual results (summary, transcript, etc.) as `.txt` files for easy sharing and archiving.

---

## 🛠️ Tech Stack

This project is built with a modern, separated frontend and backend architecture.

| Category      | Technology                                                              |
| :------------ | :---------------------------------------------------------------------- |
| **Frontend** | `React.js`, `Axios`,                                     |
| **Backend** | `Python 3.10+`, `Flask`                                                 |
| **AI / ML** | `Google Gemini API` (Summarization & Analysis), `OpenAI Whisper` (Transcription) |
| **Styling** | `CSS3` (Flexbox, Grid)                                                  |

---
---

## 🚀 Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

-   **Python 3.10+**
-   **Node.js and npm** (or yarn)
-   **ffmpeg**: A command-line tool required by Whisper.
    -   **macOS:** `brew install ffmpeg`
    -   **Windows:** `choco install ffmpeg`
    -   **Linux (Debian/Ubuntu):** `sudo apt update && sudo apt install ffmpeg`

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create and activate a Python virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Create an environment file:**
    -   Create a file named `.env` in the `backend` directory.
    -   Get a free API key from [Google AI Studio](https://aistudio.google.com/).
    -   Add your API key to the `.env` file:
        ```
        GEMINI_API_KEY=YOUR_API_KEY_HERE
        ```

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Application

You need to run both the backend and frontend servers simultaneously in two separate terminals.

-   **Terminal 1 (Backend):**
    ```bash
    cd backend
    source venv/bin/activate
    python app.py
    ```
    The backend server will start on `http://127.0.0.1:5001`.

-   **Terminal 2 (Frontend):**
    ```bash
    cd frontend
    npm start
    ```
    The React application will open in your browser at `http://localhost:3000`.

---

## Usage

1.  **Upload a File**: Click "Choose File" to select a pre-recorded audio file (e.g., MP3, WAV, M4A) and click "Process Audio".
2.  **Record a Meeting**: Click "Record Live Meeting", select the browser tab you wish to record (ensuring "Share tab audio" is checked), and click "Stop Recording" when finished.
3.  **Analyze**: Once results are displayed, use the "Custom Analysis Engine" to ask specific questions about the transcript.
