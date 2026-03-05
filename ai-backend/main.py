import os
import json
import re
from fastapi import FastAPI, HTTPException
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

class HealthSnapshot(BaseModel):
    data: dict

class TriageResult(BaseModel):
    urgency: str
    summary: str
    correlations: list[str]
    recommendations: list[str]
    disclaimer: str

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
        print(f"RAW AI RESPONSE: {generated_text}")
        
        # 1. Extract the largest possible JSON block
        json_match = re.search(r'(\{[\s\S]*\})', generated_text)
        if not json_match:
            raise HTTPException(status_code=500, detail="AI response did not contain a valid JSON block")
            
        raw_json = json_match.group(1)
        
        # 2. Try to parse. If it fails due to extra characters (like trailing }), try to trim them.
        parsed_json = None
        current_attempt = raw_json
        
        # Try up to 3 times to trim trailing garbage if it's invalid
        for _ in range(3):
            try:
                parsed_json = json.loads(current_attempt)
                break
            except json.JSONDecodeError as e:
                # If there's extra data at the end, try removing the last character and retry
                if "Extra data" in str(e) and current_attempt.endswith('}'):
                    current_attempt = current_attempt[:-1].strip()
                else:
                    break
        
        if not parsed_json:
            # Last ditch effort: simple regex cleaning
            try:
                # Remove trailing } if it's a double brace
                cleaned = re.sub(r'\}\s*\}$', '}', raw_json.strip())
                parsed_json = json.loads(cleaned)
            except:
                raise HTTPException(status_code=500, detail=f"Could not parse AI JSON: {raw_json}")

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
