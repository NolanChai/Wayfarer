import cohere
import csv
import random

# get api key from key.txt
with open("key.txt", "r") as f:
    key = f.read()

co = cohere.Client(key)

location_examples = [
    ("'In this video, I'll show you some of the best places to visit in Tokyo, Japan. We'll start our tour in Shinjuku, which is one of the busiest districts in the city. From there, we'll head to the famous Tsukiji fish market and then make our way to the historic Senso-ji Temple in Asakusa. Finally, we'll end our tour by taking a relaxing boat ride on the Sumida River.","Tokyo, Japan: {Shinjuku -> Tsukiji fish market -> Senso-ji Temple in Asuka -> Sumida River}"),
    ("Hey guys, welcome back to my channel. Today, we're exploring the beautiful city of Paris. We'll start our tour at the famous Eiffel Tower, which offers stunning views of the city. From there, we'll head to the iconic Louvre Museum, home to some of the world's most famous art pieces, including the Mona Lisa. Next, we'll walk along the charming streets of Montmartre, where you can see the stunning Sacré-Cœur Basilica and enjoy some delicious French cuisine. Finally, we'll end our tour with a relaxing boat ride along the Seine River, where you can see some of the city's most beautiful landmarks. So let's get started!", "Paris, France: {Eiffel Tower -> Louvre Museum -> Montmartre (Sacré-Cœur Basilica) -> Seine River}"),
    ("Hey everyone, welcome back to my channel. Today, I'm taking you on a tour of some of the best beaches in Hawaii. Our first stop is Waikiki Beach, located in the heart of Honolulu. From there, we'll head to the stunning North Shore, home to some of the best surf spots in the world. Next, we'll visit the picturesque Lanikai Beach, which is known for its turquoise waters and soft sand. Finally, we'll end our tour at the secluded Polihale Beach, where you can enjoy some peace and quiet away from the crowds. Let's go!", "Hawaii, USA: {Waikiki Beach -> North Shore -> Lanikai Beach -> Polihale Beach}"),
    ("Welcome back, everyone! Today, I'm taking you on a tour of the beautiful city of Barcelona. We're starting our tour at the famous Sagrada Familia, one of the most iconic landmarks in the city. From there, we'll head to the Gothic Quarter, which is home to some of the city's most stunning architecture and historic buildings. Next, we'll explore the vibrant La Rambla street, where you can find some of the best restaurants and shops in the city. Then, we'll visit the beautiful Park Güell, designed by the famous architect Antoni Gaudí. Finally, we'll end our tour at the stunning Barceloneta Beach, where you can relax and soak up some sun. Let's get started!","Barcelona, Spain: {Sagrada Familia -> Gothic Quarter -> La Rambla street -> Park Güell -> Barceloneta Beach}"),
    ("Hey guys, welcome back to my channel. Today, I'm taking you on a tour of the beautiful city of Rome. We'll start our tour at the famous Colosseum, one of the most iconic landmarks in the city. From there, we'll head to the stunning Trevi Fountain, where you can make a wish and throw a coin into the water. Next, we'll visit the historic Pantheon, which is one of the best-preserved ancient Roman buildings in the world. Finally, we'll end our tour at the beautiful Spanish Steps, where you can enjoy some delicious Italian gelato. Let's get started!","Rome, Italy: {Colosseum -> Trevi Fountain -> Pantheon -> Spanish Steps}"),
]

class cohereExtractor():
    def __init__(self, examples, example_labels, labels, task_description, example_prompt):
        self.examples = examples
        self.example_labels = example_labels
        self.labels = labels
        self.task_desciption = task_description
        self.example_prompt = example_prompt

    def make_prompt(self, example):
        examples = self.examples + [example]
        labels = self.example_labels + [""]
        return (self.task_desciption +
                "\n---\n".join( [examples[i] + "\n" +
                                self.example_prompt + 
                                 labels[i] for i in range(len(examples))]))
    
    def extract(self, example):
      extraction = co.generate(
          model='large',
          prompt=self.make_prompt(example),
          max_tokens=10,
          temperature=0.1,
          stop_sequences=["\n"])
      return(extraction.generations[0].text[:-1])
    
cohereLocExtractor = cohereExtractor([e[1] for e in location_examples],
                                     [e[0] for e in location_examples], [],
                                     "", "extract the location order from the transcript: ")


