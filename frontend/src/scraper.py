import requests
from bs4 import BeautifulSoup
import json

# URLs to scrape
urls = [
    "https://shorelight.com/student-stories/f-1-visa-interview-questions/",
    "https://visaguide.world/us-visa/nonimmigrant/study-exchange-visas/f1/interview-questions-and-answers/",
]

# Predefined answers dataset (fallback)
predefined_answers = {
    "Why do you want to study in the USA?": "The USA offers top-ranked universities, research opportunities, and global recognition.",
    "What are your future plans after studying?": "I plan to return to my country and contribute to its industry with my acquired skills."
}

# Output file
output_file = "visa_questions.json"
visa_questions = []

for url in urls:
    print(f"Scraping: {url}")
    response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})

    if response.status_code == 200:
        soup = BeautifulSoup(response.content, "html.parser")

        # Extract questions from h2/h3 tags
        question_elements = soup.find_all(["h2", "h3"])

        for i, title in enumerate(question_elements):
            question_text = title.get_text(strip=True)

            # Try to find an answer from the next sibling paragraph, list, or div
            next_element = title.find_next_sibling(["p", "ul", "div"])
            if next_element:
                if next_element.name == "ul":
                    answer_text = "\n".join([li.get_text(strip=True) for li in next_element.find_all("li")])
                else:
                    answer_text = next_element.get_text(strip=True)
            else:
                answer_text = predefined_answers.get(question_text, "Answer not available.")

            visa_questions.append({
                "id": len(visa_questions) + 1,
                "question": question_text,
                "answer": answer_text,
                "difficulty": "Medium"
            })
    else:
        print(f"Failed to retrieve {url}. Status code: {response.status_code}")

# Save data to JSON
with open(output_file, "w", encoding="utf-8") as file:
    json.dump(visa_questions, file, indent=4, ensure_ascii=False)

print(f"Data saved to {output_file}")
