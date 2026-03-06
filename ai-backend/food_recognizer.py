import torch
import os
from transformers import AutoImageProcessor, AutoModelForImageClassification
from PIL import Image
import io

MODEL_ID = "Kaludi/food-category-classification-v2.0"

class FoodRecognizer:
    def __init__(self):
        print(f"Loading {MODEL_ID} locally...")
        # Force CPU to save space/memory since Render free tier has no GPU
        self.device = torch.device("cpu")
        self.processor = AutoImageProcessor.from_pretrained(MODEL_ID)
        self.model = AutoModelForImageClassification.from_pretrained(MODEL_ID).to(self.device)
        self.model.eval()
        print("Model loaded successfully on CPU.")

    def recognize(self, image_bytes: bytes) -> str:
        """
        Takes raw image bytes, runs inference, and returns the top predicted food name.
        """
        try:
            image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            inputs = self.processor(images=image, return_tensors="pt").to(self.device)
            
            with torch.no_grad():
                outputs = self.model(**inputs)
            
            logits = outputs.logits
            predicted_class_idx = logits.argmax(-1).item()
            label = self.model.config.id2label[predicted_class_idx]
            
            return label
        except Exception as e:
            print(f"Error in food recognition: {e}")
            raise e

# Provide a singleton instance
_recognizer = None

def get_food_recognizer():
    global _recognizer
    if _recognizer is None:
        _recognizer = FoodRecognizer()
    return _recognizer
