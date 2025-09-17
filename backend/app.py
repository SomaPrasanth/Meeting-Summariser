# app.py

import os
import whisper
from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

# 1. Initialize Flask App and CORS
app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from our React frontend

# 2. Load Models (this can take a moment, so it's done once on startup)
print("Loading models...")
# Using the "base" model for a good balance of speed and accuracy
whisper_model = whisper.load_model("base") 
# Using a DistilBART model for summarization
summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")
print("Models loaded.")

# 3. Define the API endpoint
@app.route("/process-audio", methods=["POST"])
def process_audio_endpoint():
    # Check if a file was uploaded
    if 'audioFile' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    audio_file = request.files['audioFile']
    
    # Create a temporary directory to store the file
    if not os.path.exists("temp"):
        os.makedirs("temp")
    
    temp_file_path = os.path.join("temp", audio_file.filename)
    audio_file.save(temp_file_path)

    try:
        # --- Transcription ---
        print(f"Transcribing {temp_file_path}...")
        transcription_result = whisper_model.transcribe(temp_file_path)
        transcript_text = transcription_result["text"]
        print("Transcription complete.")

        # --- Summarization ---
        # Summarizer works best on shorter texts. We'll process in chunks if needed.
        # For this MVP, we assume the transcript is short enough.
        print("Summarizing text...")
        # The model has a max input length, so we truncate for this example
        max_chunk_length = 1000 
        summary_result = summarizer(transcript_text[:max_chunk_length], max_length=150, min_length=30, do_sample=False)
        summary_text = summary_result[0]['summary_text']
        print("Summarization complete.")

        # --- Cleanup ---
        os.remove(temp_file_path)

        # Return the results
        return jsonify({
            "transcript": transcript_text,
            "summary": summary_text
        })

    except Exception as e:
        # Clean up in case of an error
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        return jsonify({"error": str(e)}), 500

# 4. Run the App
if __name__ == "__main__":
    app.run(debug=True, port=5001)