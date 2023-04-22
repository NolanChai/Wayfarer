import React, { useState, useEffect } from "react";
import "./App.css";
import { Map, MapPath } from  "./components/mapPath";
import { MapMarkers } from "./components/mapMarkers";
import { getMapData, getMarkerImages } from "./api";
import { YoutubeVideo } from "./components/youtube"

const App = () => {

  const [query, setQuery] = useState('');
  const [youtubeURL, setYoutubeURL] = useState('');
  const [mapData, setMapData] = useState([]);
  const [imageListData, setImageListData] =useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const [openMarkers, setOpenMarkers] = useState(false);
  const [openPaths, setOpenPaths] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);

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

  /*
  useEffect(() => {
    let locations = [];
    mapData.map((data) => locations = [...locations, data[1]])
    const imageURLs = getMarkerImages(locations);
    console.log(imageURLs);
  }, [mapData])
  */
 
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

  return (
    <div className="font-sans">
      <h1 className=" text-white text-center font-semibold text-5xl font-sans mt-40 mb-3"> YouPath </h1>
        
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
          <p className="text-center text-white mt-3 font-semibold">
            Pinpoint where your favourite YouTubers go!
          </p>
          
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
            <MapPath />
            
          </div>
        )}

        {openMarkers && (
          <div>
            <MapMarkers mapData={mapData} />
            <YoutubeVideo url={youtubeURL}/>
          </div>
        )}

    </div>
      
  )
}

export default App;
