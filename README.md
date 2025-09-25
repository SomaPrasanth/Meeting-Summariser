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

Add your API key to the .env file:

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
