import React, { useState, useEffect } from "react";

export const YoutubeVideo = (url) => {
    console.log("this is the url")
    console.log(url)

    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [title, setTitle] = useState('');

    const API_KEY = "AIzaSyAlRmWzUU-pau84L87_rK4RFukOHs2_05g";

    useEffect(() => {
        const videoId = url.split('v=')[1];
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;
        const titleUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${API_KEY}`;

        const fetchVideo = async () => {
            const response = await fetch(titleUrl);
            const data = await response.json();
            setTitle(data.items[0].snippet.title);
        };

        setThumbnailUrl(thumbnailUrl);
        fetchVideo();
    }, [url]);

    return (
        <div>
            <img src={thumbnailUrl} alt="Thumbnail" />
            <h2>{title}</h2>
        </div>
    );
}