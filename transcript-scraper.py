# run 'python -m spacy download en_core_web_sm'
# run 'python -m spacy download xx_ent_wiki_sm'
from youtube_transcript_api import YouTubeTranscriptApi as yta
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

# extract video id from link
video_id = extract_id(sys.argv[1])
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
    geo = geolocator.geocode(location, timeout=200)
    geos.append([geo.latitude, geo.longitude])

print(geos)