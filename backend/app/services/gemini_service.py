import json
import logging
from typing import Optional, Dict, Any
from app.core.config import settings

logger = logging.getLogger(__name__)

# Primary & fallback models adhering strictly to guidelines
FALLBACK_MODELS = [
    "gemini-2.5-flash",
    "gemini-2.5-pro",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-pro"
]

class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.client = None
        if self.api_key:
            try:
                from google import genai
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                logger.warning(f"Could not initialize Google GenAI client: {e}")

    def generate_text(self, prompt: str, system_instruction: Optional[str] = None) -> Optional[str]:
        if not self.client:
            return None

        for model in FALLBACK_MODELS:
            try:
                config = {}
                if system_instruction:
                    config["system_instruction"] = system_instruction
                
                response = self.client.models.generate_content(
                    model=model,
                    contents=prompt,
                    config=config if config else None
                )
                if response and response.text:
                    return response.text
            except Exception as e:
                logger.warning(f"Gemini model {model} failed: {e}")
                continue
        return None

    def generate_structured_json(self, prompt: str, system_instruction: Optional[str] = None) -> Optional[Dict[str, Any]]:
        raw_text = self.generate_text(prompt, system_instruction)
        if not raw_text:
            return None

        # Clean markdown codeblocks if returned
        cleaned = raw_text.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        elif cleaned.startswith("```"):
            cleaned = cleaned[3:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()

        try:
            return json.loads(cleaned)
        except Exception as e:
            logger.warning(f"Failed to parse structured JSON from Gemini: {e}")
            return None

gemini_service = GeminiService()
