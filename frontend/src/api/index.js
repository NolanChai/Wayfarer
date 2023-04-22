

export const getMapData = async (url) => {
    try {
        const response = await fetch(`http://localhost:5000/api/get_coordinates?url=${url}`);
        const data = await response.json();
        console.log("200: Successss!");
        console.log(data);
        return data;
    } catch (error) {
        console.error(error);
    }
}



