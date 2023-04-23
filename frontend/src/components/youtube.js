import React, { useState, useEffect } from "react";

export const YoutubeVideo = (url) => {
    console.log("this is the url")
    console.log(url)

    const [videoUrl, setVideoUrl] = useState('');
    const [title, setTitle] = useState('');

    const API_KEY = "AIzaSyAlRmWzUU-pau84L87_rK4RFukOHs2_05g";

    useEffect(() => {
        const videoId = url.split('v=')[1];
        const videoUrl = `https://www.youtube.com/embed/${videoId}`;
        const titleUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${API_KEY}`;

        const fetchVideo = async () => {
            const response = await fetch(titleUrl);
            const data = await response.json();
            setTitle(data.items[0].snippet.title);
        };

        setVideoUrl(videoUrl);
        fetchVideo();
    }, [url]);

    return (
        <div className="justify-center">
           <iframe width="420" height="315" src={videoUrl}></iframe>
           <h2>{title}</h2>
        </div>
    );
}