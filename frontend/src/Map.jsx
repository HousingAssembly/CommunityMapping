import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Tooltip, useMap, useMapEvents, Marker, Popup } from 'react-leaflet';
import{CloseButton, Modal, Button, Form, Accordion} from 'react-bootstrap'
import { AdminState } from "./context/Context";
import axios from "axios";
import './index.css'
import {toaster} from './assets/ui/toaster'
import home from './assets/home.png'
import {shelters} from './assets/resourceData'

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
  
const ZoomableCircle = ({ center, radius, color, name, zoomLevel = 12, onSelect, selectedDistrict }) => {
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
  const [form, setForm] = useState({
  name: "",
  lat: "",
  long: "",
  housing: { RDPs: "", CRUs: "", backyardDwellings: "" },
  demo:    { total: "", black: "", coloured: "", asian: "", white: "", other: "" },
});
  const [showEditModal, setShowEditModal]= useState(false)
  const handleModalClose = () => setShowEditModal(false)
  const handleModalOpen = () => {
    setShowEditModal(true)
  }

  useEffect(() => {
    if (!community) return;
    setForm({
      name: community.name,
      lat:  community.coords.lat,
      long:  community.coords.long,
      housing: {
        RDPs:              community.housingStats?.RDPs              ?? "",
        CRUs:              community.housingStats?.CRUs              ?? "",
        backyardDwellings: community.housingStats?.backyardDwellings ?? "",
      },
      demo: {
        total:    community.demographics?.total    ?? "",
        black:    community.demographics?.black    ?? "",
        coloured: community.demographics?.coloured ?? "",
        asian:    community.demographics?.asian    ?? "",
        white:    community.demographics?.white    ?? "",
        other:    community.demographics?.other    ?? "",
      },
    });
  }, [community, showEditModal]);

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
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/addissue/fetch?community=${encodeURIComponent(community.name)}`
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
      await axios.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/addcom/${community._id}`, config);
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
    await axios.put(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/addcom/${community._id}`, {
      name: form.name,
      coords: {
        lat: form.lat,
        long: form.long,
      },
      housingStats: form.housing,
      demographics: form.demo,
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

  const handleDeleteIssue = async (iss) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        data : {
          id: iss._id,
        },
      };
      await axios.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/addissue/delete`,config);

      toaster.create({
              title: "Issue Successfully Deleted",
              type: "success",
              duration: 5000,
              isClosable: true,
              position: "bottom",
          });
      onHide(); // This is a holdover from delete Com, so I'm just leavin it in for now
    } catch (err) {
      console.error("Delete failed", err);
    }
    }
let numIssues = Object.entries(issuesByCategory).reduce((sum, [category, list]) => sum + list.length, 0);
// object.entries takes issuesByCategory, which is a map with keys of categories and values of issueLists and then
// turns it into a list (e.g., [ ["GBV", [issue1, issue2]], ["food/water", [issue1]] ]). Reduce then works this list
// into a single value based on a function we define. We call this single value sum. sum is supposed to be the 
// total number of issues, i.e., the sum of the length of each issueList. 
// Reduce deconstructs each item of this list into each key-value pair list and says, "the first part is the 
// category, and the second one is the list"
// Knowing which is the list, it then uses list.length to add to the sum.
// Thus, we get the sum.

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
            style={{ position: 'absolute', top: '4rem', right: '2rem' }}
          />
          <h1 style={{ marginTop: '3rem' }}>
            {community?.name} <span style={{color:'dodgerblue'}}> {' (' + community?.districtName + ')'}</span>
          </h1>
          <br />
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-around',
              gap: '2rem',
            }}
          >
            <div>
              <h2><u>Housing Stats:</u></h2>
              <h4>RDPs:&nbsp;
                {community?.housingStats?.RDPs || "Not Entered"}
              </h4>
              <h4>CRUs:&nbsp;
                {community?.housingStats?.CRUs || "Not Entered"}
              </h4>
              <h4>Backyard Dwellings:&nbsp;
                {community?.housingStats?.backyardDwellings || "Not Entered"}
              </h4>

              <br />

              <h2><u>Demographic Stats:</u></h2>
              <h4>Total Population:&nbsp;
                {community?.demographics?.total || "Not Entered"}
              </h4>
              <h4>Black:&nbsp;
                {community?.demographics?.black || "Not Entered"}
              </h4>
              <h4>Coloured:&nbsp;
                {community?.demographics?.coloured || "Not Entered"}
              </h4>
              <h4>Asian:&nbsp;
                {community?.demographics?.asian || "Not Entered"}
              </h4>
              <h4>White:&nbsp;
                {community?.demographics?.white || "Not Entered"}
              </h4>
              <h4>Other:&nbsp;
                {community?.demographics?.other || "Not Entered"}
              </h4>
            </div>
            <div style={{ flex: '1 1 300px', minWidth: '300px', maxWidth: '600px' }}>
              <h2 style={{ color: 'darkred', textAlign: 'center' }}>
                <u>Local Reported Issues - {numIssues} Total</u>
              </h2>
              <Accordion defaultActiveKey="-1" style={{ width: '100%' }}>
                {Object.entries(issuesByCategory).map(([categoryName, issueList], index) => (
                  <Accordion.Item eventKey={String(index)} key={categoryName}>
                    <Accordion.Header>{categoryName + " (" + issueList.length + ")"}</Accordion.Header>
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
                              {new Date(iss.createdAt).toLocaleDateString('en-GB')}
                            </p>
                          </div>
                          <p>{iss.description}</p>
                          {loggedIn && <Button variant="danger" onClick =  {() => handleDeleteIssue(iss)}> Delete This Issue </Button>}
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
            <Form.Group className="mb-3">
              <Form.Label><strong>Community Name *</strong></Form.Label>
              <Form.Control
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Latitude</Form.Label>
              <Form.Control
                value={form.lat}
                onChange={(e) => setForm({ ...form, lat: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Longitude</Form.Label>
              <Form.Control
                value={form.long}
                onChange={(e) => setForm({ ...form, long: e.target.value })}
              />
            </Form.Group>

            <Accordion flush>
              <Accordion.Item eventKey="0">
                <Accordion.Header>Housing Stats (optional)</Accordion.Header>
                <Accordion.Body>
                  {[
                    ["RDPs", "RDPs"],
                    ["CRUs", "CRUs"],
                    ["Backyard Dwellings", "backyardDwellings"],
                  ].map(([label, key]) => (
                    <Form.Group key={key} className="mb-2">
                      <Form.Label>{label}</Form.Label>
                      <Form.Control
                        type="text"
                        value={form.housing[key]}
                        onChange={(e) =>
                          setForm({ ...form, housing: { ...form.housing, [key]: e.target.value }})
                        }
                      />
                    </Form.Group>
                  ))}
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="1">
                <Accordion.Header>Demographic Stats (optional)</Accordion.Header>
                <Accordion.Body>
                  {[
                    ["Total Population", "total"],
                    ["Black", "black"],
                    ["Coloured", "coloured"],
                    ["Asian", "asian"],
                    ["White", "white"],
                    ["Other", "other"],
                  ].map(([label, key]) => (
                    <Form.Group key={key} className="mb-2">
                      <Form.Label>{label}</Form.Label>
                      <Form.Control
                        type="text"
                        value={form.demo[key]}
                        onChange={(e) =>
                          setForm({ ...form, demo: { ...form.demo, [key]: e.target.value }})
                        }
                      />
                    </Form.Group>
                  ))}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
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
  const { selectedDistrict, communities, fetchCommunities, globalCommunity,setGlobalCommunity } = AdminState();
  const [activeCommunity, setActiveCommunity] = useState(null);
  const handleOpenIssue = (c) => setActiveCommunity(c);
  const handleCloseIssue = () => {
    setActiveCommunity(null) 
    setGlobalCommunity(null)
  };
  const [buttonColor, setButtonColor] = useState(null)

  const mouseOn = () => {
    setButtonColor("LightGray")
  }
  
  const mouseOff = () => {
    setButtonColor("White")
  }

  useEffect(() => {
    fetchCommunities(selectedDistrict);
  }, [selectedDistrict]);


  useEffect(()=>{
     setActiveCommunity(communities.find((c) => c.name === globalCommunity))
  }, [globalCommunity])

  return (
    <>
    
      {communities.map((c) => (
        <Marker
          key={c._id}
          position={[c.coords.lat, c.coords.long]}
          eventHandlers={{
            mouseover: (e) => e.target.openPopup(),
          }}
        >
          <Popup closeOnClick={false} autoClose={true}>
            <div style={{width : "100%"}}>
              <button 
              onClick={() => handleOpenIssue(c)} 
                style={{ color : "black", backgroundColor: buttonColor , width : "115px",height : "30px", borderRadius : "5px",  border : "1px solid black"}}
                onMouseOver = {mouseOn}
                onMouseOut = {mouseOff}
                >
                <span style={{ fontFamily: "Verdana", fontWeight: 'bold', fontSize: '15px' }}>{c.name}</span>
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
        <FullScreenOverlay show={!!activeCommunity} onHide={handleCloseIssue} community={activeCommunity} />
    </>
  );
}

const ShelterPinsLayer = () => {
  const [activeShelter, setActiveShelter] = useState(null);
  const handleOpenShelter = (c) => setActiveShelter(c);
  const handleCloseShelter = () => setActiveShelter(null);
  const [buttonColor, setButtonColor] = useState(null)

  const mouseOn = () => {
    setButtonColor("LightGray")
  }
  
  const mouseOff = () => {
    setButtonColor("White")
  }

  const shelterIcon = L.icon({
    iconUrl: home,
    iconSize:    [30, 40],  
    iconAnchor:  [20, 40],    
    popupAnchor: [ 0, -32]  
    });

  return (
    <>
      {shelters.map((c) => (
        <Marker
          key={c._id}
          position={[c.lat, c.lon]}
          icon={shelterIcon}
        >
          <Popup >
            <div style={{width : "100%"}}>
              <button onClick={()=>handleOpenShelter(c)}
                style={{ 
                  color : "black", 
                  backgroundColor: buttonColor , width : "100%", 
                  padding: "10px", height : "55px", borderRadius : "5px",  border : "1px solid black"}}
                onMouseOver = {mouseOn}
                onMouseOut = {mouseOff}
                >
                {c.name}
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
      <SheltersScreenOverlay show={!!activeShelter} onHide={handleCloseShelter} shelter={activeShelter}/>
    </>
  );
}

const SheltersScreenOverlay = ({ show, onHide, shelter }) => {


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
          <h1>{shelter?.name} <span style={{color:'red'}}> (Homeless Shelter)</span></h1>
          <br /><br />
          <h4><b >Contact Name: </b> {shelter?.contact ? shelter?.contact : 'N/A'}</h4>
          <h4><b >Phone Number: </b> {shelter?.tel ? shelter?.tel : 'N/A'}</h4>
          <h4><b >Address: </b> {shelter?.address ? shelter?.address : 'N/A'}</h4>
          <h4><b >Email: </b> {shelter?.emails ?shelter?.emails : 'N/A' }</h4>
          <h4><b >Website: </b> <a href={shelter?.website } target="_blank" rel="noopener noreferrer">{shelter?.website ? shelter?.website : 'N/A'}</a></h4>

        </Modal.Body>
      </Modal>
    </>
  );
};

const Map = () => {
  const { selectedDistrict, setSelectedDistrict, showShelters } = AdminState();
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
      {showShelters && <ShelterPinsLayer/>}
      <ResetMapView />
    </MapContainer>
  );
};

export default Map;
