import speech_recognition as sr  # For speech recognition
import base64
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import logging
import wave
import io

# Configure logging
logger = logging.getLogger(__name__)

recognizer = sr.Recognizer()

@csrf_exempt
def speechToText(request):
    """
    Converts base64-encoded audio data to text using Google's Speech Recognition.
    Supports both GET and POST requests.
    """

    if request.method == 'POST':
        # Attempt to parse JSON body for POST request
        try:
            data = json.loads(request.body)
            audio_base64 = data.get("audioData")
            lang = data.get("lang", "en")
            sample_rate = data.get("sampleRate", 16000)
            sample_width = data.get("sampleWidth", 2)
        except json.JSONDecodeError:
            logger.error("Invalid JSON in request body.")
            return JsonResponse({"error": "Invalid JSON"}, status=400)
    else:
        return JsonResponse({"error": "Unsupported HTTP method"}, status=405)

    logger.info(f"Received audio_base64 length: {len(audio_base64) if audio_base64 else 'None'}")
    logger.info(f"Language: {lang}")
    logger.info(f"Sample Rate: {sample_rate}")
    logger.info(f"Sample Width: {sample_width}")

    if not audio_base64:
        return JsonResponse({"error": "No audio data provided"}, status=400)

    try:
        audio_bytes = base64.b64decode(audio_base64)
        with wave.open(io.BytesIO(audio_bytes), 'rb') as wav_file:
            sample_rate = wav_file.getframerate()
            sample_width = wav_file.getsampwidth()
            audio_frame = wav_file.readframes(wav_file.getnframes())
        audio_data = sr.AudioData(audio_frame, sample_rate, sample_width)
    except Exception as e:
        logger.error(f"Error decoding audio: {e}")
        return JsonResponse({"error": "Invalid audio data"}, status=400)

    try:
        text = recognizer.recognize_google(audio_data, language=lang)
        logger.info(f"Recognized Text: {text}")
        return JsonResponse({"text": text}, status=200)
    except sr.UnknownValueError:
        logger.warning("Speech not understood.")
        return JsonResponse({"text": None, "error": "Speech not understood"}, status=200)
    except sr.RequestError as e:
        logger.error(f"Service request error: {e}")
        return JsonResponse({"error": "Service request error"}, status=500)