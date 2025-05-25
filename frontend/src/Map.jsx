import React from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'

const Map = () => {
  return (
     <MapContainer
      center={[-33.9, 19.7]}
      zoom={7}                 
      scrollWheelZoom          
      style={{
        height: "100%",        
        width: "100%"
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
    </MapContainer>
  )
}

export default Map