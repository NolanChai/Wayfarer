

export const getMapData = async (url) => {
    try {
        const response = await fetch(`http://127.0.0.1:5000/api/get_coordinates?url=${url}`);
        const data = await response.json();
        console.log("200: Successss!");
        console.log(data);
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

/*
export const getMarkerImages = async (locations) => {
    try {
        // locations is an array of places
        // example: locations = ["New York", "Paris", "Tokyo"]; 
        const response = await fetch(`http://127.0.0.1:5000/api/get_images?locations[]="` + locations.join("&locations[]="));
        const data = await response.json();
        console.log("200: Successss!");
        console.log(data);
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}
*/

/*
export const getMarkerImages = async (locations) => {
    const url = "http://127.0.0.1:5000/api/generate_images";
    const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(locations)
      });
    return response;
}
*/

export const getWaypoints = async (arrayOfLL) => {
    try {
        let queryStr = '';

    for (var i = 0; i < arrayOfLL.length; i++) {
        if (i == arrayOfLL.length - 1) {
            queryStr += arrayOfLL[i][0] + ',' + arrayOfLL[i][1];
        } else {
        queryStr += arrayOfLL[i][0] + ',' + arrayOfLL[i][1] + ';';
        }
    }
    const accessToken = 'pk.eyJ1IjoiZWNsYWhhY2tzMjAyMyIsImEiOiJjbGdyanp4NDkxazA1M2VwM3lmb3QzNmpqIn0.0kouosUyDJf1DznZvltYZw';
    const url = `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${queryStr}?source=first&destination=last&roundtrip=false&access_token=${accessToken}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log("200: Successss!");
    //console.log(data);
    return data;
    } catch (error) {
        console.error(error);
        return null;
    }
    
}