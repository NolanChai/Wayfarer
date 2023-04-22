import React, { useState, useEffect } from "react";
import YouTube from 'react-youtube';

export const YoutubeVideo = (url) => {
    console.log("this is the url")
    console.log(url)

    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [title, setTitle] = useState('');

    const API_KEY = 'AIzaSyAlRmWzUU-pau84L87_rK4RFukOHs2_05g';

    useEffect(() => {
        let videoId = JSON.stringify(url).split('v=')[1].replace('\"}', '');
        console.log('vid id');
        console.log(videoId);
        
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;
        const titleUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`;

        const fetchVideo = async () => {
            const response = await fetch(titleUrl);
            const data = await response.json();
            console.log(data);
            setTitle(data.items[0].snippet.title);
            console.log(data.items[0].snippet.title);
        };

        setThumbnailUrl(thumbnailUrl);
        fetchVideo();
    }, [url]);

    return (
        <div>
            <h2 className="text-white font-sans"> {title} </h2>
            <img src={thumbnailUrl} alt="Thumbnail" />
            
        </div>
    );
}