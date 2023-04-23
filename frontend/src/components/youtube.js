import React, { useState, useEffect } from "react";
import YouTube from 'react-youtube';

export const YoutubeVideo = (url) => {
    //console.log("this is the url")
    //console.log(url)

    //const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [title, setTitle] = useState('');
    const [vidID, setVidID] = useState('');

    const API_KEY = 'AIzaSyAlRmWzUU-pau84L87_rK4RFukOHs2_05g';

    useEffect(() => {
        let vidId = JSON.stringify(url).split('v=')[1].replace('\"}', '');
        setVidID(vidId);
        //console.log('vid id');
        //console.log(videoId);
        
        //const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;
        const titleUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${vidId}&key=${API_KEY}`;

        const fetchVideo = async () => {
            const response = await fetch(titleUrl);
            const data = await response.json();
            //console.log(data);
            setTitle(data.items[0].snippet.title);
            //console.log(data.items[0].snippet.title);
        };

        //setThumbnailUrl(thumbnailUrl);
        fetchVideo();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center">

                <h2 className="text-white text-3xl mb-4 text-bold font-sans text-center"> {title} </h2>
                <YouTube
                    className="bg-paper_yellow rounded-xl p-4"
                    videoId={vidID}
                    opts={{
                        height: '390',
                        width: '640',
                        playerVars: {
                        autoplay: 1,
                        },
                    }}
                    onReady={(event) => event.target.pauseVideo()}
                    onStateChange={(event) => console.log(event.target.getCurrentTime())}
                />
  
        </div>
    );
}