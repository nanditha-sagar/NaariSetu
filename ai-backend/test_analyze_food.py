import requests

# Download a sample food image (pizza)
url = "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop"
img_data = requests.get(url).content
with open("sample_pizza.jpg", "wb") as f:
    f.write(img_data)

# Send to local FastAPI backend
print("Sending to backend...")
with open("sample_pizza.jpg", "rb") as f:
    files = {"file": ("sample_pizza.jpg", f, "image/jpeg")}
    response = requests.post("http://127.0.0.1:8000/analyze-food", files=files)

print("Status Code:", response.status_code)
if response.status_code == 200:
    print("Response JSON:")
    print(response.json())
else:
    print("Error Details:", response.text)
