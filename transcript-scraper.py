from youtube_transcript_api import YouTubeTranscriptApi as yta
from urllib.parse import urlparse, parse_qs
from tqdm import tqdm
import pandas as pd
import cohere
import sys

# get api key from key.txt
with open("key.txt", "r") as f:
    key = f.read()

# initialize cohere client
client = cohere.Client(key)

# location_examples = pd.read_csv("location_examples.csv")

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
    
# get input from command line (main)
if __name__ == "__main__":
    # extract video id from link
    video_id = extract_id(sys.argv[1])
    # get transcript
    transcript = get_transcript(video_id)
    print(transcript.translate('en').fetch())