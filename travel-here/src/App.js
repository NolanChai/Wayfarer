import React, { useState, useEffect } from "react";
import "./App.css";
import { Map } from  "./components/mapSuccess";

const App = () => {
  
  const bgImage = "./japan_bg.jpg"

  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false)

  const handleClick= () => {
    console.log(`Search for "${query}"`);
    setSearched(true);
    // send request using info from query
    setQuery('');
  }

  return (
    <div className="font-sans">
      <h1 className=" text-white text-center font-semibold text-5xl font-sans mt-40 mb-3"> travel:here </h1>

        <div className="flex flex-row justify-center gap-2">
            <input
              className="rounded w-6/12"
              type="text"
              placeholder="Search..."
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

        {!searched && (
          <p className="text-center mt-3 font-semibold">
            Pinpoint where your favourite YouTubers go!
          </p>
        )}

        {searched && (
          <Map />
        )}

    </div>
      
  )
}

export default App;
