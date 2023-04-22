

export const getMapData = (url) => {
    fetch(`http://localhost:5000/api/get_coordinates?url=${url}`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
        });
}



