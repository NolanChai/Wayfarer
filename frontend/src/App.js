import React, { useState, useEffect } from "react";
import "./App.css";
import { Map, MapPath } from  "./components/mapPath";
import { MapMarkers } from "./components/mapMarkers";
import { getMapData, getMarkerImages } from "./api";
import { YoutubeVideo } from "./components/youtube"
import { PlaceCard } from "./components/cardButton";

const App = () => {

  const [query, setQuery] = useState('');
  const [youtubeURL, setYoutubeURL] = useState('');
  const [mapData, setMapData] = useState([]);
  const [imageListData, setImageListData] =useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [placeLinks, setPlaceLinks] = useState([]);

  const [openMarkers, setOpenMarkers] = useState(false);
  const [openPaths, setOpenPaths] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);

  const colors = ['bg-paper_yellow', 'bg-paper_brown', 'bg-paper_green']

  const handleClickMarkers = async () => {
    
    setIsInvalid(false);
    setIsLoading(true);
    setSearched(true); // initial boolean to get rid of intro page
    setOpenMarkers(false);
    setOpenPaths(false);
    
    console.log(`Search for "${query}"`);
    const data = await getMapData(query);
    
    if (data) {
      setIsLoading(false);
      setMapData(data);
      setYoutubeURL(query);
      setQuery('');
      console.log(youtubeURL)
      setOpenMarkers(true);

    } else {
      setIsLoading(false);
      setIsInvalid(true);
      setQuery('');
    }
  }

  const handleClickPaths = async () => {
    
    setIsInvalid(false);
    setIsLoading(true);
    setSearched(true); // initial boolean to get rid of intro page
    setOpenPaths(false);
    setOpenMarkers(false);

    console.log(`Search for "${query}"`);
    const data = await getMapData(query);
    
    if (data) {
      setIsLoading(false);
      setMapData(data);
      setYoutubeURL(query);
      setQuery('');
      console.log(youtubeURL)
      setOpenPaths(true);
    } else {
      setIsLoading(false);
      setIsInvalid(true);
      setQuery('');
    }
    
  }

  const customLinkGenerator = (data) => {
    let nameArray = data.map((data) => data[1].split(',')[0].trim());
    //console.log("we are in custom link generator")
    //console.log(nameArray)
    const googleSearch = 'https://www.google.com/search?q=';
    const linksArray = nameArray.map((name) => { 
      return {name: name, url: googleSearch + name }
    })
    //console.log(linksArray)
    setPlaceLinks(linksArray);
  }

  useEffect(() => {
    //console.log("Trying to find custom links!")
    //console.log(mapData)
    customLinkGenerator(mapData)
    //console.log(placeLinks)
  }, [mapData])

  return (
    <div className="font-sans">
      <h1 className=" text-white text-center font-semibold text-5xl font-sans mt-44 mb-3"> WayFarer </h1>
      <h1 className="text-white text-center text-xl font-sans mb-3"> Pinpoint where your favourite YouTubers go!</h1>
        
        <div className="flex flex-row justify-center gap-2">
            <input
              className="rounded w-6/12"
              type="text"
              placeholder="Explore..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />

          <button
            className="rounded px-2"
            onClick={handleClickMarkers}
          >
            <img className="w-10 px-1 py-1" src="./Map_pin_icon.svg" alt="search"/>
          </button>

          <button
            className="rounded px-2"
            onClick={handleClickPaths}
          >
            <img className="w-12 px-1" src="./path.svg" alt="search"/>
          </button>
        </div>

        {isLoading && (
          <div className="mt-3 flex justify-center">
            <div className="flex flex-col items-center">
              <div className="loader mb-3"/>
              <div className="loading mb-1"> Searching </div>
            </div>
          </div>
        )}

        {!searched && (
          <div className="text-center font-semibold">
          <p className=" text-white mt-3">
            Identify specific locations...
          </p>
          <p>
          ...Discover optimal paths
          </p>
          </div>
        )}
        
        {isInvalid && (
          <div>
          <div className="invalid"> </div>
          <div className="flex flex-row justify-center mt-6">
            <h1 className="text-white text-xl"> Couldn't find your video! </h1>
          </div>
          </div>
        )}

        {openPaths && (
          <div>
            <YoutubeVideo className="rounded-xl" url={youtubeURL}/>
            <MapPath mapData={mapData}/>
            
          </div>
        )}

        {openMarkers && (
          
          <div className="my-4 flex flex-col items-center">
            <YoutubeVideo className="rounded-xl" url={youtubeURL}/>
            <MapMarkers mapData={mapData} />
            <div className="rounded-xl flex justify-center placesList w-1/3">
              <div className="flex gap-2 justify-center items-center">
                <h1 className="font-sand text-2xl font-bold text-brown_red"> {mapData.length} Places of Interest </h1>
                <img className="w-10" src="./Search_Icon.svg"/>
              </div>
            </div>

            <PlaceCard links={placeLinks}/>
        
          </div>
        )}

    </div>
      
  )
}

export default App;
