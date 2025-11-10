
#AIzaSyB3OhWq-M6I8XlF7PtFSQirC0SJuiYmqvo
import os
import whisper
import google.generativeai as genai
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from dotenv import load_dotenv
from fpdf import FPDF, XPos, YPos
from datetime import datetime

# --- 1. Initialization and Configuration ---
load_dotenv()
app = Flask(__name__)
CORS(app)

try:
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    print("Gemini API key configured.")
except Exception as e:
    print(f"Error configuring Gemini API: {e}")

print("Loading transcription model...")
whisper_model = whisper.load_model("base")
print("Transcription model loaded.")


# --- 2. Main Audio Processing Endpoint ---
@app.route("/process-audio", methods=["POST"])
def process_audio_endpoint():
    if 'audioFile' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    audio_file = request.files['audioFile']
    temp_dir = "temp"
    if not os.path.exists(temp_dir):
        os.makedirs(temp_dir)
    
    # Sanitize filename to be OS-compatible
    filename = "".join(c for c in audio_file.filename if c.isalnum() or c in ('.', '_')).rstrip()
    temp_file_path = os.path.join(temp_dir, filename)
    audio_file.save(temp_file_path)

    try:
        # STAGE 1: Transcription
        print("Starting transcription...")
        transcription_result = whisper_model.transcribe(temp_file_path)
        transcript_text = transcription_result["text"]
        print("Transcription complete.")
        
        # STAGE 2: Gemini Analysis
        print("Starting Gemini analysis...")
        model = genai.GenerativeModel('gemini-1.5-flash')

        summary_prompt = f'Summarize this transcript: "{transcript_text}"'
        summary_response = model.generate_content(summary_prompt)
        summary_text = summary_response.text

        action_prompt = f"""Analyze the following transcript and extract two lists:
        1. A list of all specific action items or tasks assigned.
        2. A list of all key decisions that were made.
        Format the output clearly using markdown. If none are found, state that.

        Transcript:
        "{transcript_text}"
        """
        action_response = model.generate_content(action_prompt)
        action_items_text = action_response.text
        print("Gemini analysis complete.")

        return jsonify({
            "transcript": transcript_text,
            "summary": summary_text,
            "action_items": action_items_text
        })

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": str(e)}), 500
        
    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)


# --- 3. PDF Export Endpoint ---
@app.route("/export-pdf", methods=["POST"])
def export_pdf_endpoint():
    data = request.get_json()
    summary = data.get('summary', 'No summary provided.')
    action_items = data.get('action_items', 'No action items provided.')

    try:
        pdf = FPDF()
        pdf.add_page()
        
        pdf.set_font("Helvetica", "B", 20)
        pdf.cell(0, 10, "Smart Meeting Assistant Report", new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C")
        
        pdf.set_font("Helvetica", "", 10)
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M IST")
        pdf.cell(0, 10, f"Generated on: {timestamp}", new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C")
        pdf.ln(10)

        pdf.set_font("Helvetica", "B", 14)
        pdf.cell(0, 10, "Meeting Summary", new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="L")
        pdf.set_font("Helvetica", "", 12)
        pdf.multi_cell(0, 10, summary.encode('latin-1', 'replace').decode('latin-1'))
        pdf.ln(10)

        pdf.set_font("Helvetica", "B", 14)
        pdf.cell(0, 10, "Action Items & Decisions", new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="L")
        pdf.set_font("Helvetica", "", 12)
        pdf.multi_cell(0, 10, action_items.encode('latin-1', 'replace').decode('latin-1'))

        pdf_output = pdf.output()

        return Response(pdf_output,
                        mimetype='application/pdf',
                        headers={'Content-Disposition': 'attachment;filename=meeting_report.pdf'})

    except Exception as e:
        print(f"Error generating PDF: {e}")
        return jsonify({"error": "Failed to generate PDF"}), 500


# --- NEW: Custom Analysis Endpoint ---
@app.route("/custom-analysis", methods=["POST"])
def custom_analysis_endpoint():
    data = request.get_json()
    transcript = data.get('transcript')
    custom_prompt = data.get('custom_prompt')

    if not transcript or not custom_prompt:
        return jsonify({"error": "Transcript and a custom prompt are required."}), 400
    
    try:
        print("Starting custom Gemini analysis...")
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Combine the user's prompt with the transcript for the AI
        final_prompt = f"""
        Based on the following transcript, please perform this specific task:
        
        TASK: "{custom_prompt}"
        
        TRANSCRIPT:
        "{transcript}"
        """
        
        response = model.generate_content(final_prompt)
        result_text = response.text
        print("Custom analysis complete.")
        
        return jsonify({"result": result_text})

    except Exception as e:
        print(f"An error occurred during custom analysis: {e}")
        return jsonify({"error": str(e)}), 500

# --- 4. Run the Application ---
if __name__ == "__main__":
    app.run(debug=True, port=5001)

