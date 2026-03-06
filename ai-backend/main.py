import os
import json
import re
import base64
from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from huggingface_hub import InferenceClient
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Saheli AI Proxy Backend")

# Add CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development, allow all origins. You can restrict this to ["http://localhost:8081"] later.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model configuration
MODEL_ID = "aaditya/Llama3-OpenBioLLM-8B"
HF_TOKEN = os.getenv("HF_TOKEN")

if not HF_TOKEN:
    print("WARNING: HF_TOKEN not found in environment variables.")

# Initialize Hugging Face Inference Client
# Providing the model ID here is often more stable
client = InferenceClient(model=MODEL_ID, token=HF_TOKEN)

# Lazy-load the local food recognizer 
# We don't import at the top to avoid slowing down startup if it's not needed immediately
def _get_recognizer():
    from food_recognizer import get_food_recognizer
    return get_food_recognizer()

def extract_json(generated_text: str):
    """
    Attempts to find and parse a JSON block within the generated text.
    Handles common Llama 3 formatting issues.
    """
    # 1. Extract the largest possible JSON block using regex
    json_match = re.search(r'(\{[\s\S]*\})', generated_text)
    if not json_match:
        return None
        
    raw_json = json_match.group(1)
    
    # 2. Try to parse. If it fails, try to clean up trailing garbage.
    current_attempt = raw_json
    for _ in range(5): # Increase retry count for more aggressive trimming
        try:
            return json.loads(current_attempt)
        except json.JSONDecodeError as e:
            # If there's extra data at the end, try removing the last character and retry
            if "Extra data" in str(e) and len(current_attempt) > 1:
                current_attempt = current_attempt.rsplit('}', 1)[0] + '}'
                current_attempt = current_attempt.strip()
            # If it's incomplete, try to append a closing brace (risky but sometimes works)
            elif "Expecting" in str(e) and not current_attempt.endswith('}'):
                current_attempt += '}'
            else:
                break
    
    # Last ditch effort: regex cleaning for double braces
    try:
        cleaned = re.sub(r'\}\s*\}$', '}', raw_json.strip())
        return json.loads(cleaned)
    except:
        return None

class HealthSnapshot(BaseModel):
    data: dict

class TriageResult(BaseModel):
    urgency: str
    summary: str
    correlations: list[str]
    recommendations: list[str]
    disclaimer: str

class FoodAnalysisResult(BaseModel):
    detected_food: str
    estimated_calories: int
    protein_g: float
    carbs_g: float
    fat_g: float
    portion_description: str

class FoodAnalysisRequest(BaseModel):
    image_base64: str

@app.get("/")
async def root():
    return {
        "status": "online",
        "message": "Saheli AI Proxy Backend is running",
        "model": MODEL_ID,
        "hf_token_present": HF_TOKEN is not None
    }

@app.post("/triage", response_model=TriageResult)
async def get_triage(snapshot: HealthSnapshot):
    prompt = f"""<|begin_of_text|><|start_header_id|>system<|end_header_id|>

You are "Saheli AI", an empathetic and expert women's health clinical triage assistant. 
Your goal is to analyze multiple health tracker datasets and identify correlations that a single tracker might miss.

RULES:
1. Be empathetic but medically accurate.
2. Focus on "Red Flags" (High BP, heavy bleeding, syncopal episodes).
3. If multiple issues overlap (e.g., heavy period + high fatigue), mention the correlation.
4. return the output ONLY in the following JSON format:
{{
  "urgency": "Green" | "Amber" | "Red" | "Crisis",
  "summary": "1-2 sentence overview of current state",
  "correlations": ["identified link 1", "identified link 2"],
  "recommendations": ["action 1", "action 2"],
  "disclaimer": "Emergency disclaimer"
}}
5. Do NOT include any text outside the JSON block.<|eot_id|><|start_header_id|>user<|end_header_id|>

Analyze this health snapshot:
{json.dumps(snapshot.data, indent=2)}
<|eot_id|><|start_header_id|>assistant<|end_header_id|>

{{"""

    try:
        # Call Hugging Face API
        response = client.text_generation(
            prompt,
            max_new_tokens=500,
            temperature=0.2,
            do_sample=True,
            return_full_text=False
        )
        
        # We pre-filled the opening brace '{' in the prompt, so we must add it back
        generated_text = "{" + response.strip()
        print(f"DEBUG - Triage Response Content: [[{generated_text}]]")
        
        parsed_json = extract_json(generated_text)
        
        if not parsed_json:
             raise HTTPException(status_code=500, detail=f"AI response did not contain a valid JSON block: {generated_text}")

        # 3. Handle nesting (if model wraps it in "output" or "data")
        clean_result = parsed_json
        if isinstance(clean_result, dict):
            if "output" in clean_result:
                clean_result = clean_result["output"]
            elif "data" in clean_result:
                clean_result = clean_result["data"]
        
        print(f"CLEANED JSON: {json.dumps(clean_result, indent=2)}")
        return TriageResult(**clean_result)

    except Exception as e:
        print(f"Error during inference proxy / validation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-food", response_model=FoodAnalysisResult)
async def analyze_food(req: FoodAnalysisRequest):
    try:
        # 1. Decode Base64 Image
        print("Received base64 image data")
        image_bytes = base64.b64decode(req.image_base64)
        
        recognizer = _get_recognizer()
        food_name = recognizer.recognize(image_bytes)
        print(f"Local model detected: {food_name}")
        
        # 2. Remote Calorie Estimation via Llama 3
        prompt = f"""<|begin_of_text|><|start_header_id|>system<|end_header_id|>

You are an expert nutritionist AI. The user has uploaded an image of a food item, and our vision model identified it as: "{food_name}".
Your task is to estimate the macronutrients and calories for a STANDARD serving size of this food.

RULES:
1. Provide realistic estimates for a common portion size.
2. Return ONLY valid JSON in the exact format requested. Do NOT wrap it in markdown blockquotes or add extra text.

Return exactly this JSON structure:
{{
  "detected_food": "{food_name}",
  "estimated_calories": 250,
  "protein_g": 12.5,
  "carbs_g": 30.0,
  "fat_g": 8.0,
  "portion_description": "1 standard bowl / plate"
}}<|eot_id|><|start_header_id|>user<|end_header_id|>

Give the nutrition info for: {food_name}<|eot_id|><|start_header_id|>assistant<|end_header_id|>

{{"""

        response = client.text_generation(
            prompt,
            max_new_tokens=150,
            temperature=0.1,
            do_sample=True,
            return_full_text=False
        )
        
        generated_text = "{" + response.strip()
        print(f"DEBUG - Food AI Response: [[{generated_text}]]")
        
        parsed_data = extract_json(generated_text)
        
        if not parsed_data:
            raise HTTPException(status_code=500, detail=f"AI did not return valid JSON for food analysis: {generated_text}")
        
        # Ensure 'detected_food' matches our local detection
        parsed_data['detected_food'] = food_name
        
        return FoodAnalysisResult(**parsed_data)
        
    except Exception as e:
        print(f"Error in food analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
