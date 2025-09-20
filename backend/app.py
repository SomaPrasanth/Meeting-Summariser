# backend/app.py

import os
import whisper
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS

# --- 1. App Initialization & API Configuration ---
app = Flask(__name__)
CORS(app)

# --- IMPORTANT ---
# Paste your Google API key here.
# Do not share this key publicly.
API_KEY = "AIzaSyB3OhWq-M6I8XlF7PtFSQirC0SJuiYmqvo"

try:
    genai.configure(api_key=API_KEY)
    # Initialize the generative model
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
        # Step 1: Transcribe the audio file to text
        print("Transcribing audio...")
        transcription_result = whisper_model.transcribe(temp_file_path)
        transcript_text = transcription_result["text"]
        detected_language = transcription_result.get("language", "unknown")
        print("Transcription complete.")

        # Step 2: Generate a summary using the Gemini API
        print("Generating summary with Gemini...")
        
        # We create a specific prompt for the model
        prompt = f"""
        You are an expert meeting summarizer. Please provide a concise, easy-to-read summary 
        of the following transcript. Focus on the main points, arguments, and conclusions.

        Transcript:
        "{transcript_text}"
        """
        
        response = model.generate_content(prompt)
        summary_text = response.text
        print("Summary generated.")

        return jsonify({
            "transcript": transcript_text,
            "summary": summary_text,
            "language": detected_language
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

