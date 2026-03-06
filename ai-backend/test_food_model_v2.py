import os
import traceback
from dotenv import load_dotenv
from huggingface_hub import InferenceClient

load_dotenv()

MODEL_ID = "BinhQuocNguyen/food-recognition-model"
HF_TOKEN = os.getenv("HF_TOKEN")

client = InferenceClient(model=MODEL_ID, token=HF_TOKEN)

try:
    image_url = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop"
    res = client.image_classification(image_url)
    with open('model_result.txt', 'w') as f:
        f.write(str(res))
except Exception as e:
    with open('model_error.txt', 'w') as f:
        f.write(traceback.format_exc())
