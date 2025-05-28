import React from 'react'
import { MapContainer, TileLayer, Circle, useMapEvent } from 'react-leaflet'

function ZoomToDistrict(){
  // What does the function need to do
  // Get mouse click location
  // Check which district it's in
  // Given that, setView with a specific latlong at the center and then zoom in maybe 11 or 12
  // Then, populate the pins for the areas
  const map = useMapEvent({
    click() {
      map.setZoom(12)
    },
  })
  return null;
}

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

      <Circle center={[-34.040278, 18.677778]} pathOptions={{fillColor: 'red'}} radius={3000} />

    <ZoomToDistrict />
    </MapContainer>
  )
}

export default Map