

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

