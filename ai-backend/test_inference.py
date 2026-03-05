import os
from dotenv import load_dotenv
load_dotenv()
from huggingface_hub import InferenceClient

prompt = """<|begin_of_text|><|start_header_id|>system<|end_header_id|>

You are "Saheli AI", an empathetic and expert women's health clinical triage assistant. 
Your goal is to analyze multiple health tracker datasets and identify correlations that a single tracker might miss.

RULES:
1. Be empathetic but medically accurate.
2. Focus on "Red Flags" (High BP, heavy bleeding, syncopal episodes).
3. If multiple issues overlap (e.g., heavy period + high fatigue), mention the correlation.
4. return the output ONLY in the following JSON format:
{
  "urgency": "Green" | "Amber" | "Red" | "Crisis",
  "summary": "1-2 sentence overview of current state",
  "correlations": ["identified link 1", "identified link 2"],
  "recommendations": ["action 1", "action 2"],
  "disclaimer": "Emergency disclaimer"
}
5. Do NOT include any text outside the JSON block.<|eot_id|><|start_header_id|>user<|end_header_id|>

Analyze this health snapshot:
{
  "anemia": null,
  "bp": null,
  "glucose": null,
  "mood": null,
  "periods": null,
  "profile": {}
}<|eot_id|><|start_header_id|>assistant<|end_header_id|>

{"""

c = InferenceClient(model='aaditya/Llama3-OpenBioLLM-8B', token=os.environ.get('HF_TOKEN'))
try:
    res = c.text_generation(prompt, max_new_tokens=500, temperature=0.2, do_sample=True, return_full_text=False)
    with open('output_res.txt', 'w', encoding='utf-8') as f:
        # Prepend the '{' that we forced it to start with since return_full_text=False
        f.write("{" + res)
    print("DONE")
except Exception as e:
    print("ERROR:", e)
