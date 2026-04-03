import requests
import json
import urllib.parse
import os 
from datetime import datetime


API_KEY = os.environ.get("GNEWS_API_KEY") 

query = '"AI" OR "Artificial Intelligence" OR "Machine Learning"'
encoded_query = urllib.parse.quote(query)
URL = f'https://gnews.io/api/v4/search?q={encoded_query}&lang=en&apikey={API_KEY}'

print(f"[{datetime.now().strftime('%H:%M:%S')}] Fetching news...")
response = requests.get(URL)

if response.status_code == 200:
    data = response.json()
    with open('AI_news.json', 'w', encoding='utf-8') as file:
        json.dump(data, file, indent=4, ensure_ascii=False)
    
    print("Τα νέα αποθηκεύτηκαν στο AI_news.json")
else:
    print(f"Error fetching news: {response.status_code} - {response.text}")
    
