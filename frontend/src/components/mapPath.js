import React, { useState, useEffect } from "react";

// Map Box API imports 
import mapboxgl from "mapbox-gl";
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiZWNsYWhhY2tzMjAyMyIsImEiOiJjbGdyanp4NDkxazA1M2VwM3lmb3QzNmpqIn0.0kouosUyDJf1DznZvltYZw';

export const MapPath = () => {
    
    useEffect(() => {
        const map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [-118.441318, 34.074949],
          zoom: 10,
        });
    
        const directions = new MapboxDirections({
          accessToken: mapboxgl.accessToken,
          unit: 'metric',
          profile: 'mapbox/cycling',
        });
    
        map.addControl(directions, 'top-left');
    
        const UCLA = [-118.441318, 34.074949];
        const UCI = [-117.838914978, 33.6405407712];
        const UCSD = [-117.2340, 32.8801];
    
        const toVisit = [UCLA, UCI, UCSD];
        const toVisitNames = ['UCLA', 'UCI', 'UCSD'];
    
        console.log('HELLO');
        map.on('load', () => {
          for (let i = 0; i < toVisit.length; i++) {
            if (i === 0) {
              directions.setOrigin(toVisit[i]);
            } else if (i === toVisit.length - 1) {
              directions.setDestination(toVisit[i]);
            } else {
              directions.setWaypoint(i, toVisit[i]);
              new mapboxgl.Marker().setLngLat(toVisit[i]).addTo(map);
            }
          }
        });
      }, []);
    
    return (
        <div className="rounded m-6 p-3 flex justify-center">
            <div className="rounded-xl bg-gray-300 p-2">
                <div className="rounded-xl" id="map" style={{ width: '800px', height: '600px' }} />
            </div>
        </div>
    )
}