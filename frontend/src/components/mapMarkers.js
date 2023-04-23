import React, { useState, useEffect } from "react";

// Map Box API imports 
import mapboxgl from "mapbox-gl";
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiZWNsYWhhY2tzMjAyMyIsImEiOiJjbGdyanp4NDkxazA1M2VwM3lmb3QzNmpqIn0.0kouosUyDJf1DznZvltYZw';

export const MapMarkers = (MapData) => {

    console.log("this is map data")
    console.log(MapData)

    let data = MapData.mapData;

    useEffect(() => {
        
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
        
        let toVisit = [];
        let toVisitNames = []
        
        data.map(data => {
            toVisit = [...toVisit, data[0]];
            toVisitNames = [...toVisitNames, data[1]];
        })
    
        map.on('load', function() {
            for (var i = 0; i < toVisit.length; i++) {
               // directions.setWaypoint(i, toVisit[i]);
                const marker = new mapboxgl.Marker().setLngLat(toVisit[i]).setPopup(new mapboxgl.Popup({offset: 10}).setText(toVisitNames[i])).addTo(map);
                const markerDiv = marker.getElement();
                markerDiv.addEventListener('mouseenter', () => marker.togglePopup());
                markerDiv.addEventListener('mouseleave', () => marker.togglePopup());
            }
        });
        
      }, []);
    
    return (
        <div className="rounded m-6 p-3 flex justify-center">
            <div className="rounded-xl bg-paper_yellow p-2">
                <div className="rounded-xl" id="map" style={{ width: '800px', height: '600px' }} />
            </div>
        </div>
    )

}