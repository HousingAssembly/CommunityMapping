import React, { useRef, useState } from 'react';
import { MapContainer, TileLayer, Circle, Tooltip, useMap } from 'react-leaflet';
import { AdminState } from "./context/Context";

const ZoomableCircle = ({ center, radius, color, name, zoomLevel = 13, onSelect, selectedDistrict }) => {
  const map = useMap();

  return (
    <Circle
      center={center}
      radius={radius}
      pathOptions={{ color, weight: 2, fillOpacity: 0.15 }}
      eventHandlers={{
        click: () => {
          map.flyTo(center, zoomLevel, { duration: 1.4 }); 
          onSelect?.(name);                                
        },
      }}
    >
      {(!selectedDistrict || selectedDistrict !== name) && <Tooltip direction="top">{name}</Tooltip>}
    </Circle>
  );
};

const Map = () => {
  const { selectedDistrict, setSelectedDistrict } = AdminState();
  const districts = [
    { name: 'Khayelitsha',      pos: [-34.035, 18.675], radius: 4200,  color: 'red'    },
    { name: 'Athlone',          pos: [-33.92, 18.48],   radius: 11000, color: 'blue'   },
    { name: 'Mitchells Plain',  pos: [-34.04, 18.59],   radius: 4800,  color: 'green'  },
    { name: 'Northern Suburbs', pos: [-33.955, 18.64],  radius: 6000,  color: 'purple' },
    { name: 'Southern Suburbs', pos: [-34.10, 18.43],   radius: 11600, color: 'orange' },
    { name: 'Malmesbury',       pos: [-33.52, 18.68],   radius: 10500, color: 'teal'   },
    { name: 'Ceres',            pos: [-33.40, 19.26],   radius: 7000,  color: 'brown'  },
  ];

  return (
    <MapContainer
      center={[-33.9, 18.7]}
      zoom={10}
      scrollWheelZoom
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {districts.map((d) => (
        <ZoomableCircle
          key={d.name}
          center={d.pos}
          radius={d.radius}
          color={d.color}
          name={d.name}
          onSelect={setSelectedDistrict}
          selectedDistrict={selectedDistrict}  
        />
      ))}
    </MapContainer>
  );
};

export default Map;
