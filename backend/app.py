
#AIzaSyB3OhWq-M6I8XlF7PtFSQirC0SJuiYmqvo
# backend/app.py

# backend/app.py

import os
import whisper
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

# --- 1. App Initialization & API Configuration ---
app = Flask(__name__)
CORS(app)

# --- IMPORTANT ---
# Paste your Google API key here if you haven't already.
# API_KEY = "AIzaSyB3OhWq-M6I8XlF7PtFSQirC0SJuiYmqvo"
API_KEY = os.getenv("GEMINI_API_KEY")

try:
    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash-latest')
    print("Gemini model initialized successfully.")
except Exception as e:
    print(f"Error initializing Gemini model: {e}")
    model = None

# Load the local transcription model
print("Loading Whisper model...")
whisper_model = whisper.load_model("base")
print("Whisper model loaded.")


# --- 2. Main API Endpoint ---
@app.route("/process-audio", methods=["POST"])
def process_audio_endpoint():
    
    if model is None:
        return jsonify({"error": "Gemini model is not configured. Please check your API key."}), 500
        
    if 'audioFile' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    audio_file = request.files['audioFile']
    temp_dir = "temp"
    
    if not os.path.exists(temp_dir):
        os.makedirs(temp_dir)
    
    temp_file_path = os.path.join(temp_dir, audio_file.filename)
    audio_file.save(temp_file_path)

    try:
        # --- Transcription ---
        print("Transcribing audio...")
        transcription_result = whisper_model.transcribe(temp_file_path)
        transcript_text = transcription_result["text"]
        detected_language = transcription_result.get("language", "unknown")
        print("Transcription complete.")

        # --- Summarization ---
        print("Generating summary with Gemini...")
        summary_prompt = f'Transcript summary: "{transcript_text}"'
        summary_response = model.generate_content(summary_prompt)
        summary_text = summary_response.text
        print("Summary generated.")

        # --- Action Item & Decision Extraction ---
        print("Extracting action items and decisions...")
        action_prompt = f"""
        Analyze the following transcript and extract two lists in markdown format:
        1.  A bulleted list of all specific action items or tasks.
        2.  A bulleted list of all key decisions that were made.

        If no action items or decisions are found, state "None found." for that section.

        Transcript:
        "{transcript_text}"
        """
        action_response = model.generate_content(action_prompt)
        action_items_text = action_response.text
        print("Action items extracted.")


        return jsonify({
            "transcript": transcript_text,
            "summary": summary_text,
            "language": detected_language,
            "action_items": action_items_text
        })

    except Exception as e:
        print(f"An error occurred during processing: {e}")
        return jsonify({"error": str(e)}), 500
        
    finally:
        # Ensure the temporary file is always cleaned up
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)


# --- 3. Run the Application ---
if __name__ == "__main__":
    app.run(debug=True, port=5001)

