import os
from dotenv import load_dotenv
from huggingface_hub import InferenceClient

load_dotenv()

# The user requested 'BinhQuocNguyen/food-recognition-model'
MODEL_ID = "BinhQuocNguyen/food-recognition-model"
HF_TOKEN = os.getenv("HF_TOKEN")

client = InferenceClient(model=MODEL_ID, token=HF_TOKEN)

try:
    # Since it's likely an image classification model, let's try to get its supported tasks or run a dummy image
    # For now, let's just see if we can get model info 
    from huggingface_hub import model_info
    info = model_info(MODEL_ID)
    print(f"Model Name: {info.id}")
    print(f"Pipeline Tag: {info.pipeline_tag}")
    
    # Let's try to classify a dummy image URL 
    image_url = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop" # A burger
    print("Testing image classification...")
    res = client.image_classification(image_url)
    print("Classification result:", res)
    
except Exception as e:
    print(f"Error testing model: {e}")
