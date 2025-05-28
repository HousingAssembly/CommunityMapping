import React from 'react'
import { MapContainer, TileLayer, Circle, Tooltip } from 'react-leaflet'


const Map = () => {

  const khayelitshapos = [-34.035, 18.675]
  const athlonepos = [-33.92, 18.48]
  const mitchellsplainpos = [-34.04, 18.59]
  const northernsuburbspos = [-33.955, 18.64]
  const southernsuburbspos = [-34.10, 18.43]
  const cerespos = [-33.40, 19.26]
  const malmesburypos = [-33.52, 18.68]
  return (
     <MapContainer
      center={[-33.9, 18.7]}
      zoom={10}                 
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
      

      //Khayelitsha
      <Circle center={khayelitshapos} radius={4200} pathOptions={{color:'red', weight:2, fillOpacity:0.15}}>
      <Tooltip direction="top" > Khayelitsha </Tooltip>
      </Circle>

      //Athlone
      <Circle center={athlonepos} radius={9000} pathOptions={{color:'blue', weight:2, fillOpacity:0.15}}>
      <Tooltip direction="top" > Athlone </Tooltip>
      </Circle>

      //Mitchells Plain
      <Circle center={mitchellsplainpos} radius={4800} pathOptions={{color:'green', weight:2, fillOpacity:0.15}} >
      <Tooltip direction="top" > Mitchells Plain </Tooltip>
      </Circle>


      //Northern Suburbs
      <Circle center={northernsuburbspos} radius={6000} pathOptions={{color:'purple', weight:2, fillOpacity:0.15}}>
      <Tooltip direction="top" > Northern Suburbs </Tooltip>
      </Circle>

      //Southern Suburbs
      <Circle center={southernsuburbspos} radius={11600} pathOptions={{color:'orange', weight:2, fillOpacity:0.15}}>
      <Tooltip direction="top" > Southern Suburbs </Tooltip>
      </Circle>

      //Malmesbury
      <Circle center={malmesburypos} radius={10500} pathOptions={{color:'teal', weight:2, fillOpacity:0.15}}>
      <Tooltip direction="top" > Malmesbury </Tooltip>
      </Circle>

      //Ceres
      <Circle center={cerespos} radius={7000} pathOptions={{color:'brown', weight:2, fillOpacity:0.15}}>
      <Tooltip direction="top" > Ceres </Tooltip>
      </Circle>

    </MapContainer>
  )
}

 

export default Map