import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Tooltip, useMap, useMapEvents, Marker, Popup } from 'react-leaflet';
import{CloseButton, Modal, Button, Form, Accordion} from 'react-bootstrap'
import { AdminState } from "./context/Context";
import axios from "axios";
import './index.css'
import {toaster} from './assets/ui/toaster'

  function ResetMapView() {
    const map = useMap();                 
    const { selectedDistrict } = AdminState();

    useEffect(() => {
      if (selectedDistrict == null) {
        map.flyTo([-33.9, 18.7], 10, { duration: 1.2 });
      }
    }, [selectedDistrict, map]);

    return null;
  }
  
const ZoomableCircle = ({ center, radius, color, name, zoomLevel = 13, onSelect, selectedDistrict }) => {
  const map = useMap();

  return (
    <Circle
      center={center}
      radius={radius}
      pathOptions={{color, weight: selectedDistrict === name ? 4 : 2, fillOpacity: 0.07 }}
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
  const { communityDraft, setCommunityCoords } = AdminState();
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
  const { fetchCommunities, loggedIn, user } = AdminState();
  //state for issues
  const [issues, setIssues] = useState([]);
  const [form, setForm]= useState({
    name: community?.name || "",
    lat: community?.coords.lat || "",
    long: community?.coords.long || "",
  })
  const [showEditModal, setShowEditModal]= useState(false)
  const handleModalClose = () => setShowEditModal(false)
  const handleModalOpen = () => {
    setShowEditModal(true)
  }

  useEffect(() => {
    if (community) {
      setForm({
        name: community.name,
        lat: community.coords.lat,
        long: community.coords.long,
      });
    }
  }, [community]);

  //fetch issues when community opens or changes
  useEffect(() => {
    const fetchIssuesForCommunity = async () => {
      if (!community?.name) {
        //clears issues if there's no community selected
        setIssues([]);
        return;
      }
      try {
        //GET request for issues
        const { data } = await axios.get(
          `http://localhost:8000/addissue/fetch?community=${encodeURIComponent(community.name)}`
        );
        setIssues(data);
      } catch (err) {
        console.error("Failed to fetch issues:", err);
        //clears issues array if no issues fetch
        setIssues([]);
      }
    };

    //refetches the backend issues whne community changes
    fetchIssuesForCommunity();
  }, [community]);

  //group helper
  const groupByCategory = (issueList) => {
    return issueList.reduce((acc, issue) => {
      const cat = issue.category || "Other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(issue);
      return acc;
    }, {});
  };

  //becomes an object where each cat has an array of issues
  const issuesByCategory = groupByCategory(issues);

  const handleDeleteCom = async () => {
    if (!community?._id) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.delete(`http://localhost:8000/addcom/${community._id}`, config);
      fetchCommunities(community.districtName)
      toaster.create({
              title: "Community Successfully Deleted",
              type: "success",
              duration: 5000,
              isClosable: true,
              position: "bottom",
          });
      onHide(); 
    } catch (err) {
      console.error("Delete failed", err);
    }
    }

  const handleSave = async () => {
    if (!community?._id) return;

  try {
    const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
    await axios.put(`http://localhost:8000/addcom/${community._id}`, {
      name: form.name,
      coords: {
        lat: form.lat,
        long: form.long,
      },
    }, config);
    fetchCommunities(community.districtName);
    toaster.create({
            title: "Community Successfully Updated",
            type: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
        });
    handleModalClose(); 
  } catch (err) {
    console.error("Delete failed", err);
  }
  }

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        dialogClassName="modal-fullscreen-custom"
        backdrop="static"
        keyboard={true}
      >
        <Modal.Body
          style={{
            background: '#fff',
            height: '100%',
            padding: '2rem',
          }}
        >
          <CloseButton
            onClick={onHide}
            style={{ position: 'absolute', top: 20, right: 20 }}
          />
          <h1>{community?.name + ' (' + community?.districtName + ')'}</h1>
          <br />
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-around',
              gap: '2rem',
            }}
          >
            {/* Housing + Demographics Section */}
            <div style={{ flex: '1 1 300px', minWidth: '300px', maxWidth: '500px' }}>
              <h2 style={{ color: 'darkred', textAlign: 'center' }}>
                <u>Statistical Info</u>
              </h2>
              <div>
                <h2><u>Housing Stats: </u></h2>
                <h4>RDPs: </h4>
                <h4>CRUs: </h4>
                <h4>Backyard Dwellings: </h4>
                <br />
                <h2><u>Demographic Stats:</u></h2>
                <h4>Total Population: </h4>
                <h4>Black: </h4>
                <h4>Coloured: </h4>
                <h4>Asian: </h4>
                <h4>White: </h4>
                <h4>Other: </h4>
              </div>
            </div>

            {/* Issues Section */}
            <div style={{ flex: '1 1 300px', minWidth: '300px', maxWidth: '600px' }}>
              <h2 style={{ color: 'darkred', textAlign: 'center' }}>
                <u>Local Reported Issues</u>
              </h2>
              <Accordion defaultActiveKey="-1" style={{ width: '100%' }}>
                {Object.entries(issuesByCategory).map(([categoryName, issueList], index) => (
                  <Accordion.Item eventKey={String(index)} key={categoryName}>
                    <Accordion.Header>{categoryName}</Accordion.Header>
                    <Accordion.Body style={{ overflowY: 'auto', maxHeight: '250px' }}>
                      {issueList.map((iss) => (
                        <div
                          key={iss._id}
                          style={{
                            marginBottom: '1rem',
                            borderBottom: '1px solid #eee',
                            paddingBottom: '0.5rem',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <strong><u>{iss.title}</u></strong>
                            <p style={{ color: 'grey' }}>
                              {new Date(iss.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <p>{iss.description}</p>
                        </div>
                      ))}
                      {issueList.length === 0 && (
                        <p style={{ color: 'grey' }}>No issues in this category.</p>
                      )}
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
                {Object.keys(issuesByCategory).length === 0 && (
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>No Issues Reported</Accordion.Header>
                    <Accordion.Body style={{ textAlign: 'center' }}>
                      <em>There are currently no reported issues for this community.</em>
                    </Accordion.Body>
                  </Accordion.Item>
                )}
              </Accordion>
            </div>
          </div>
        </Modal.Body>

        {loggedIn && (
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalOpen}>
              Edit
            </Button>
            <Button variant="danger" onClick={handleDeleteCom}>
              Delete
            </Button>
          </Modal.Footer>
        )}
      </Modal>

    
      <Modal show={showEditModal} onHide={handleModalClose}>
        <Modal.Header closeButton style={{ background: 'red', color: 'white' }}>
          <Modal.Title>Edit {community?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Community name</Form.Label>
              <Form.Control
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Latitude</Form.Label>
              <Form.Control
                value={form.lat}
                onChange={(e) => setForm({ ...form, lat: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Longitude</Form.Label>
              <Form.Control
                value={form.long}
                onChange={(e) => setForm({ ...form, long: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!form.name.trim()}
            variant="danger"
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const DistrictPinsLayer = () => {
  const { selectedDistrict, communities, fetchCommunities } = AdminState();
  const [activeCommunity, setActiveCommunity] = useState(null);  // the selected one
  const handleOpenIssue = (c) => setActiveCommunity(c);
  const handleCloseIssue = () => setActiveCommunity(null);
  useEffect(() => {
    fetchCommunities(selectedDistrict);
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
      <ResetMapView />
    </MapContainer>
  );
};

export default Map;