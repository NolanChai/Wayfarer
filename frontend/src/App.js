import React, { useState, useEffect } from "react";
import "./App.css";
import { Map } from  "./components/mapPath";
import { MapMarkers } from "./components/mapMarkers";
import { getMapData } from "./api";

const App = () => {

  const [query, setQuery] = useState('');
  const [mapData, setMapData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleClick= async () => {
    setIsLoading(true);
    setSearched(true);
    
    console.log(`Search for "${query}"`);
    const data = await getMapData(query);
    
    
    setIsLoading(false);
    setMapData(data);
    setQuery('');
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
            onClick={handleClick}
          >
            <img className="w-12 px-1" src="./Search_Icon.svg" alt="search"/>
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
          <p className="text-center mt-3 font-semibold">
            Pinpoint where your favourite YouTubers go!
          </p>
        )}
        
        {mapData && (
        
          <MapMarkers mapData={mapData} />
          
        )}

    </div>
      
  )
}

export default App;
