import json
import re

def parse_response(generated_text):
    # This is the logic from main.py
    # Extract JSON
    json_match = re.search(r'\{[\s\S]*\}', generated_text)
    if json_match:
        try:
            raw_json = json_match.group()
            parsed_json = json.loads(raw_json)
            
            # Handle nested "output" key if model wrapped it
            if isinstance(parsed_json, dict) and "output" in parsed_json and len(parsed_json) == 1:
                print("Unpacking nested 'output' from AI response")
                parsed_json = parsed_json["output"]
            
            return parsed_json
        except Exception as e:
            print(f"JSON Parse/Validation Error: {e}")
            return None
    return None

# Test cases
test_cases = [
    # Normal flat response
    '{"urgency": "Green", "summary": "Looks good", "correlations": [], "recommendations": [], "disclaimer": "test"}',
    # Nested response (as seen in the error screenshot)
    '{"output": {"urgency": "Amber", "summary": "Slight issue", "correlations": ["c1"], "recommendations": ["r1"], "disclaimer": "test"}}',
    # Extra text (simulating real generation)
    'Here is the result: {"urgency": "Red", "summary": "Urgent", "correlations": [], "recommendations": [], "disclaimer": "test"}\nHope this helps.'
]

for i, test in enumerate(test_cases):
    print(f"--- Test Case {i+1} ---")
    result = parse_response(test)
    print(f"Result: {json.dumps(result, indent=2)}")
    assert result is not None
    assert "urgency" in result
    print("PASSED")
