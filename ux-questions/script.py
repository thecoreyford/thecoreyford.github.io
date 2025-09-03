import json

# Load the original JSON file
with open('questionnaires.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Process each questionnaire
for questionnaire in data:
    likert_points = questionnaire.pop("likert_scale_points", None)  # remove and store
    if "statements" in questionnaire and likert_points is not None:
        for statement in questionnaire["statements"]:
            statement["likert_scale_points"] = likert_points

# Save the updated data to a new file
with open('questionnaires_with_points_per_statement.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("✅ Updated JSON saved as 'questionnaires_with_points_per_statement.json'")
