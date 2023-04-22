import React, { useState, useEffect } from "react";

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
            <img src={thumbnailUrl} alt="Thumbnail" />
            <h2>{title}</h2>
        </div>
    );
}

/*
var Youtube = (function () {
    'use strict';

    var video, results;

    var getThumb = function (url) {
        if (url === null) {
            return '';
        }
        results = url.match('[\\?&]v=([^&#]*)');
        video   = (results === null) ? url : results[1];

        return 'http://img.youtube.com/vi/' + video + '/sddefault.jpg ';
    };

    return {
        thumb: getThumb
    };
}());
*/

//Example of usage:

//var thumb = Youtube.thumb('http://www.youtube.com/watch?v=F4rBAf1wbq4');

//console.log(thumb);