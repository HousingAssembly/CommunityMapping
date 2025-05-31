import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Tooltip, useMap, useMapEvents, Marker, Popup } from 'react-leaflet';
import{CloseButton, Modal} from 'react-bootstrap'
import { AdminState } from "./context/Context";
import './index.css'

const ZoomableCircle = ({ center, radius, color, name, zoomLevel = 13, onSelect, selectedDistrict }) => {
  const map = useMap();
  
  return (
    <Circle
      center={center}
      radius={radius}
      pathOptions={{ color, weight: 2, fillOpacity: 0.07 }}
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

const MapClickHandler = () => {
  const { communityDraft, setCommunityCoords, cancelCommunityPlacement } = AdminState();
  const map = useMapEvents({});
  useEffect(() => {
      console.log("sidebar sees draft", communityDraft);
      const container = map.getContainer();
      if (communityDraft) {
      container.classList.add("add-community-cursor");
    } else {
      container.classList.remove("add-community-cursor");
    }
    }, [communityDraft, map]);

  useMapEvents({
    click(e) {
      if (!communityDraft) return;           

      const { lat, lng } = e.latlng;
      setCommunityCoords(lat, lng);           
    },
  });
  useEffect(() => console.log("draft changed", communityDraft), [communityDraft]);
  return null; 
}

const FullScreenOverlay = ({ show, onHide, community }) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      dialogClassName="modal-fullscreen-custom"
      backdrop="static"
      keyboard={true}
    >
      <Modal.Body
        style={{
          background: "#fff",
          height: "100%",
          padding: "2rem",
        }}
      >
        <CloseButton onClick={onHide} style={{ position: "absolute", top: 20, right: 20 }}>
        </CloseButton>
        <h1>{community?.name +' ('+community?.districtName+')'}</h1>
        {/* TODO: add issue form, stats, etc. */}
      </Modal.Body>
    </Modal>
  );
}

const DistrictPinsLayer = () => {
  const { selectedDistrict, communities, fetchCommunities } = AdminState();
  const [activeCommunity, setActiveCommunity] = useState(null);  // the selected one
  const handleOpenIssue = (c) => setActiveCommunity(c);
  const handleCloseIssue = () => setActiveCommunity(null);
  useEffect(() => {
    fetchCommunities(selectedDistrict);
    console.log( communities);
  }, [selectedDistrict]);

  return (
    <>
      {communities.map((c) => (
        <Marker
          key={c._id}
          position={[c.coords.lat, c.coords.long]}
        >
          <Popup >
            <div style={{display:'flex',justifyContent:'center'}}>
              <button onClick={() => handleOpenIssue(c)}>
                {c.name}
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
        <FullScreenOverlay show={!!activeCommunity} onHide={handleCloseIssue} community={activeCommunity} />
    </>
  );
}

const Map = () => {
  const { selectedDistrict, setSelectedDistrict } = AdminState();
  const districts = [
    { name: 'Khayelitsha',      pos: [-34.035, 18.675], radius: 4200,  color: 'red'    },
    { name: 'Athlone',          pos: [-33.92, 18.48],   radius: 11000, color: 'red'   },
    { name: 'Mitchells Plain',  pos: [-34.04, 18.59],   radius: 4800,  color: 'red'  },
    { name: 'Northern Suburbs', pos: [-33.955, 18.64],  radius: 6000,  color: 'red' },
    { name: 'Southern Suburbs', pos: [-34.10, 18.43],   radius: 11600, color: 'red' },
    { name: 'Malmesbury',       pos: [-33.52, 18.68],   radius: 10500, color: 'red'   },
    { name: 'Ceres',            pos: [-33.40, 19.26],   radius: 7000,  color: 'red'  },
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
      <MapClickHandler />
      <DistrictPinsLayer />
    </MapContainer>
  );
};

export default Map;