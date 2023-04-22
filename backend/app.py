# run 'python -m spacy download en_core_web_sm'
# run 'python -m spacy download xx_ent_wiki_sm'
from youtube_transcript_api import YouTubeTranscriptApi as yta
# pip install googlesearch-python
from googlesearch import search
import requests
from bs4 import BeautifulSoup
import urllib
from flask import Flask, request, jsonify
from flask_cors import CORS
from geopy.exc import GeocoderTimedOut
from urllib.parse import urlparse, parse_qs
from geopy.geocoders import Nominatim
import locationtagger
import spacy
from spacy import displacy 
from tqdm import tqdm
import pandas as pd
import nltk
import sys
import openai
import os

# PLEASE SET UP A GITIGNORE FILE TO IGNORE KEY.TXT

# get api key from key.txt
with open("key.txt", "r") as f:
    key = f.read()

def get_transcript(video_id):
    try:
        transcript = yta.get_transcript(video_id)
        return transcript
    except:
        return "No transcript available"
    
def extract_id(link):
    query = urlparse(link).query
    id = parse_qs(query)["v"][0]
    return id

app = Flask(__name__)
CORS(app)

@app.route('/api/get_coordinates')
def get_coordinates():
    url = request.args.get('url')

    # extract video id from link
    video_id = extract_id(url)
    # get transcript
    transcript = get_transcript(video_id)

    # run 'python -m spacy download en_core_web_sm'
    nlp = spacy.load('en_core_web_sm')
    # run 'python -m spacy download xx_ent_wiki_sm'
    nlp_wk = spacy.load('xx_ent_wiki_sm')

    text = ""
    for line in transcript:
        text += line['text'] + " "

    # use spacy to extract locations
    doc = nlp(text)

    # set up OpenAI API credentials
    openai.api_key = key

    # set up prompt and parameters for text generation
    prompt = "From this transcript, mark all the locations visited in the format of values separated by commas: "+text+"Here are the locations:"
    model = "text-davinci-003"
    params = {
        "max_tokens": 500,
        "temperature": 0.3,
        "n": 3,
        "stop": "\nHere are the locations: "
    }

    # generate text from prompt
    raw_places = openai.Completion.create(
        engine=model,
        prompt=prompt,
        max_tokens=params["max_tokens"],
        temperature=params["temperature"],
        n=params["n"],
        stop=params["stop"]
    )

    # spacy extract
    raw_text = nlp(raw_places.choices[0].text.strip())

    # nltk.download('punkt')
    # nltk.download('averaged_perceptron_tagger')
    # nltk.download('maxent_ne_chunker')
    # nltk.download('words')

    # string extract
    text_extract = str(raw_places.choices[0].text.strip())

    place_entity = locationtagger.find_locations(text = text_extract)

    # location tag the text
    cities = place_entity.cities
    others = place_entity.other

    # use openai to match cities and landmarks
    prompt = "Based on these cities - "+ str(cities) +" - and these miscellaneous locations - " + str(others) + "list only landmark locations to the cities in the format of 'location, city':"
    model = "text-davinci-003"
    params = {
        "max_tokens": 500,
        "temperature": 0.3,
        "n": 3,
        "stop": "'location, city':"
    }

    # generate text from prompt
    response1 = openai.Completion.create(
        engine=model,
        prompt=prompt,
        max_tokens=params["max_tokens"],
        temperature=params["temperature"],
        n=params["n"],
        stop=params["stop"]
    )

    # print generated text
    address = response1.choices[0].text.strip()

    geolocator = Nominatim(user_agent="MyApp")

    locations = address.split('\n')

    geos = []
    for location in locations:
        geo = geolocator.geocode(location, timeout=1000)
        if geo == None:
            pass
        else:
            geos.append([[geo.longitude, geo.latitude], geo.address])
    
    print(geos)
    return jsonify(geos)

@app.route('/get_image_urls', methods=['POST'])
def get_image_urls():
    headers = {
        "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.19582"
    }

    search_terms = request.get_json()
    img_urls = []

    for term in search_terms:
        params = {
            "q": f"{term} shareds photo",
            "sourceid": "chrome",
        }

        html = requests.get("https://www.google.com/search", params=params, headers=headers)
        soup = BeautifulSoup(html.text, 'lxml')

        for result in soup.select('div[jsname=dTDiAc]'):
            link = f"https://www.google.com{result.a['href']}"
            being_used_on = result['data-lpage']
            print(f'Link: {link}\nBeing used on: {being_used_on}\n')

        # finding all script (<script>) tags
        script_img_tags = soup.find_all('script')

        # https://regex101.com/r/L3IZXe/4
        img_matches = re.findall(r"s='data:image/jpeg;base64,(.*?)';", str(script_img_tags))

        for index, image in enumerate(img_matches):
            try:
                # https://stackoverflow.com/a/6966225/15164646
                img_data = base64.b64decode(str(image))
                img_url = f"data:image/jpeg;base64,{base64.b64encode(img_data).decode('utf-8')}"
                img_urls.append(img_url)
            except:
                pass

    return jsonify(img_urls)

"""
import React, { useState } from 'react';

function App() {
  const [searchTerms, setSearchTerms] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);

  const handleSearch = async () => {
    const response = await fetch('/get_image_urls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(searchTerms)
    });
    const data = await response.json();
    setImageUrls(data);
  };

  return (
    <div>
      <input type="text" onChange={(e) => setSearchTerms(e.target.value.split(','))} />
      <button onClick={handleSearch}>Search</button>
      {imageUrls.map((url) => (
        <img src={url} alt="search result" />
      ))}
    </div>
  );
}

export default App;
"""

if __name__ == '__main__':
    app.run(debug=True)