import React, { useState, useEffect } from "react";

// Map Box API imports 
import mapboxgl from "mapbox-gl";
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import { getWaypoints } from "../api";
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiZWNsYWhhY2tzMjAyMyIsImEiOiJjbGdyanp4NDkxazA1M2VwM3lmb3QzNmpqIn0.0kouosUyDJf1DznZvltYZw';

export const MapPath = (MapData) => {
    
  let data = MapData.mapData;
  
  let toVisit = [];
  let toVisitNames = [];
  //console.log("1st")
  data.map(data => {
      toVisit = [...toVisit, data[0]];
      toVisitNames = [...toVisitNames, data[1]];
  })

  if (toVisit.length > 12) {
    toVisit = toVisit.slice(0, 12);
  }
  
  //console.log(data)
  const [wayPoints, setWayPoints] = useState(null);

  useEffect(() => {
    console.log("1st useEffect hook!")
    const fetchWaypoint = async () => {
      const wayPoint = await getWaypoints(toVisit);
      console.log("This is 1st hook waypoint :)")
      console.log(wayPoint)
      setWayPoints(wayPoint);
    }
    fetchWaypoint(toVisit);
  }, [])

  useEffect(() => {
    if (wayPoints != null) {
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: data[0][0],
      zoom: 10,
    });

    const directions = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        unit: 'metric',
        profile: 'mapbox/cycling',
    });

    map.addControl(directions, 'top-left');

    console.log("2nd useEffect hook! This is the waypoint!")
    console.log(wayPoints);
    console.log("After waypoint")
    const initObj = wayPoints.waypoints;
    console.log(initObj)
    const waypointDirections = initObj.map((data) => data.location);
    console.log(waypointDirections);
    
    map.on('load', function() {
        for (var i = 0; i < waypointDirections.length; i++) {
            if (i == 0) {
                directions.setOrigin(waypointDirections[i]); 
            } else if (i == (waypointDirections.length - 1)) {
                directions.setDestination(waypointDirections[i]);
            } else {
                directions.setWaypoint(i, waypointDirections[i]);
            }
            const marker = new mapboxgl.Marker().setLngLat(waypointDirections[i]).addTo(map);
            const markerDiv = marker.getElement();
            //markerDiv.addEventListener('mouseenter', () => marker.togglePopup());
            //markerDiv.addEventListener('mouseleave', () => marker.togglePopup());
        }
    }) }
    }, [wayPoints]);
  
  return (
      <div className="rounded m-4 flex justify-center">
          <div className="rounded-xl bg-paper_yellow p-3">
              <div className="rounded-xl" id="map" style={{ width: '800px', height: '600px' }} />
          </div>
      </div>
  )
}