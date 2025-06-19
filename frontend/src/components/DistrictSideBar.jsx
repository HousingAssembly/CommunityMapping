import React, { useState, useEffect } from 'react'
import {CloseButton, Button, Modal, Form, Accordion, Dropdown, Offcanvas, FormGroup} from 'react-bootstrap';
import { AdminState } from "../context/Context";
import {toaster} from '../assets/ui/toaster'
import axios from 'axios'
import flag from '../assets/Flag-South-Africa.webp'

const DistrictSideBar = () => {
    const { selectedDistrict, setSelectedDistrict, loggedIn, communityDraft, startCommunityPlacement, cancelCommunityPlacement,fetchCommunities, user, setGlobalCommunity} = AdminState();
    //whether "add community" modal shows
    const [showCommunityModal, setShowCommunityModal] = useState(false);
    //whether the “Add Issue” offcanvas shows
    const [showIssueModal, setShowIssueModal] = useState(false)
    const [form, setForm] = useState({
    name: "",
    lat: "",
    lng: "",
    housing: { RDPs: "", CRUs: "", backyardDwellings: "" },
    demo:    {
        total: "",
        black: "",
        coloured: "",
        asian: "",
        white: "",
        other: "",
    },});    
    const [issueForm, setIssueForm]=useState({title:'', category:'', description:''})
    //holds list of districts + their townships after fetching from backend
    const [subcouncils, setSubcouncils]= useState([])
    //Stores the chosen settlement/community for submitting an issue
    const [selectedCom, setSelectedCom]=useState('')
    
    //load data
    const loadTownships = async () => {
        const base= [
                { name: 'Khayelitsha',      info:'https://www.capetown.gov.za/family%20and%20home/meet-the-city/city-council/subcouncils/subcouncil-profile?SubCouncilCode=9' },
                { name: 'Athlone',          info:'https://www.capetown.gov.za/family%20and%20home/meet-the-city/city-council/subcouncils/subcouncil-profile?SubCouncilCode=11'},
                { name: 'Mitchells Plain',  info:'https://www.capetown.gov.za/family%20and%20home/meet-the-city/city-council/subcouncils/subcouncil-profile?SubCouncilCode=12'},
                { name: 'Northern Suburbs', info: 'https://www.capetown.gov.za/family%20and%20home/meet-the-city/city-council/subcouncils/subcouncil-profile?SubCouncilCode=5' },
                { name: 'Southern Suburbs', info: 'https://www.capetown.gov.za/family%20and%20home/meet-the-city/city-council/subcouncils/subcouncil-profile?SubCouncilCode=18'},
                { name: 'Malmesbury',       info: 'https://www.swartland.org.za/pages/english/contact-us/general.php'},
                { name: 'Ceres',            info: 'http://www.witzenberg.gov.za/contact-us'},
                { name: '',                 info: 'https://www.capetown.gov.za/City-Connect/Register/Housing-and-property/Register-on-the-housing-database/Register%20on%20the%20housing%20database'}
            ]

        //fetch townships by district
        const updated = await Promise.all(
            base.map(async (s) => {
            if (!s.name) return { ...s, townships: ['N/A'] }
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/addcom/fetch?district=${s.name}`);
                return { ...s, townships: data.map((c) => c.name) };
            } catch (err) {
                console.error(`Failed to fetch townships for ${s.name}`, err);
                return { ...s, townships: [] };
            }
            })
        );

        //updates districts array
        setSubcouncils(updated);
    };

    //runs only once to fetch data from backend
    useEffect(() => {
        loadTownships();
    }, [communityDraft]);

    //finds curret district object that matches selected district
    const current = subcouncils.find((sc) => sc.name === selectedDistrict);

    //calls context and toaster for add community
    const handleAddCommunityClick = () => {
        startCommunityPlacement(selectedDistrict);
        toaster.create({
            title: "Select Community!",
            description: 'Click on the map where to create community.',
            duration: 10000,
            isClosable: true,
            placement: "top",
            type: 'warning'
        });

    };

    //updates added issue and community
    const handleAddIssueClick = (com = '') => {
      setSelectedCom(com)
      setIssueForm({title:'',category:'',description:''})
      setShowIssueModal(true)
    }

    //watches community draft that it belongs to a selected district and has coordinates
    //set sup the form data and open add community modal.

    // CAN ADD SETTLEMENT OUTSIDE A DISTRICT
    useEffect(() => {
        if (
        communityDraft &&
        communityDraft.district === selectedDistrict &&
        communityDraft.lat !== null
        ) {
        setForm({
            name: "",
            lat: communityDraft.lat.toFixed(6),
            lng: communityDraft.lng.toFixed(6),
            housing: { RDPs: "", CRUs: "", backyardDwellings: "" },
            demo:    { total: "", black: "", coloured: "", asian: "", white: "", other: "" },
        });
        setShowCommunityModal(true);
        }
    }, [communityDraft, selectedDistrict]);

    const handleSave = async () => {
        const payload = {
            name: form.name,
            districtName: selectedDistrict,
            coords: { lat: form.lat, long: form.lng },
            housingStats: form.housing,   
            demographics: form.demo,
        };
        try {
            const config = {
            headers: {
            Authorization: `Bearer ${user.token}`,
            },
            };
            await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/addcom`, payload, config);
            toaster.create({
                    title: "Community Successfully Created",
                    type: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            fetchCommunities(selectedDistrict)
            setShowCommunityModal(false);
            setForm({
                name: "",
                lat: "",
                lng: "",
                housing: { RDPs: "", CRUs: "", backyardDwellings: "" },
                demo:    { total: "", black: "", coloured: "", asian: "", white: "", other: "" },
            });  
            cancelCommunityPlacement()
        } catch (err) {
            console.error(err);
        }
    };

  //backend updates with issues
  const handleSubmitIssue = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/addissue`, {
        title: issueForm.title,
        description: issueForm.description,
        category: issueForm.category,
        community: selectedCom
      });
      toaster.create({
            title: "Issue Successfully Added",
            type: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
        });
      setGlobalCommunity(selectedCom)
      setShowIssueModal(false);
      setForm({  name: "",
        lat: "",
        lng: "",
        housing: { RDPs: "", CRUs: "", backyardDwellings: "" },
        demo:    { total: "", black: "", coloured: "", asian: "", white: "", other: "" },});      
    } catch (err) {
      console.error(err);
      toaster.create({
        title: "Please Fill All Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
        type: 'error'
    });
    }
  }

  //updates states
  const handleModalClose = () => {
    setShowCommunityModal(false);
    cancelCommunityPlacement();
    };

  const handleFormClose = () => {
    setShowIssueModal(false);
  }

  // front end

   if (!selectedDistrict) return null;
  return (
    <>
  
  {/* District Sidebar */}

    {/* Main sidebar wrapper – holds all sidebar content */}
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100%",
        margin: "10px auto",
        width: "100%",
        padding: "10px",
      }}
    >

      {/* Box for District Name and Action Buttons */}
      <div
        style={{
          border: "2px solid #ccc",
          borderRadius: "5px",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
          width: "100%",
          padding: "20px",
          marginBottom: "10px",
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >

        {/* X button at top-right to close sidebar */}
        <div
          style={{
            position: "absolute",
            top: "15px",
            right: "20px",
          }}
        >

        <CloseButton onClick={() => setSelectedDistrict(null)} />
        </div>

        {/* District Name (e.g., "Malmesbury") */}
        <h1
        style={{
          textAlign: "center",
          flexWrap: "wrap",
          whiteSpace: "normal",
          fontFamily: "Verdana",
          fontWeight: "bold",
          textDecoration: "underline"
        }}>
          {selectedDistrict}
        </h1>

        {/* Add Issue and Add Community */}
        <div 
        style={{
          display: "flex", 
          justifyContent: "center", 
          paddingTop: "10px",
          gap: "20px",
          width: "100%"
        }}
        >

        <Button 
          variant="danger" 
          onClick={() => handleAddIssueClick()}
          style={{flex: 1}}
          >
          + Add Issue
        </Button>

          {loggedIn && (
            <Button
              variant="danger"
              onClick={handleAddCommunityClick}
              style={{ flex: 1}}
            >
              + Add Community
            </Button>
          )}
        </div>
      </div>


        {/* Info Box */}
        <div
          style={{
            border: "2px solid #ccc",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
            width: "100%",
            padding: "20px",
            flex: 1,
            height: "50%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
            overflowY: "auto",
          }}
        >

          <div>
          {/* Instructions Header */}
            <h2 style={{
              textAlign: "center",
              flexWrap: "wrap",
              whiteSpace: "normal",
              padding: "10px",
              fontFamily: "Verdana",
              fontWeight: "bold"
            }}>
              Instructions
            </h2>

            <p style={{ textAlign: "center", fontFamily: "Verdana", fontSize: "17px",  margin: "10px" }}>
              Click on one of the <b>pins</b> to view the name of the <span style={{ fontStyle: "italic" }}>township</span>.  
              Then click on the <span style={{ fontStyle: "italic" }}>township name</span> to see all the community issues.
            </p>

            <p style={{ textAlign: "center", fontFamily: "Verdana", fontSize: "17px",  padding: "10px" }}>
              To <span style={{ fontStyle: "italic" }}>report an issue</span> in your district, click the <b>"+ Add Issue"</b> button
              above and select your township.
            </p>

            <p style={{ textAlign: "center", fontFamily: "Verdana", fontSize: "17px",  margin: "10px" }}>
              Please refer to the information below for your <b>district-specific contacts</b>.
            </p>

          </div>

          {/* Contact Info Header */}
          <div>
          
            <hr style={{
              border: "none",
              borderTop: "2px solid #ccc",
              width: "90%",
              margin: "15px auto"
            }} />

            <h2 style={{
              textAlign: "center",
              flexWrap: "wrap",
              whiteSpace: "normal",
              padding: "10px",
              fontFamily: "Verdana",
              fontWeight: "bold"
            }}>
              Local Contact Info
            </h2>

          {/* Contact Info Link */}
         
          {current && (
            <div style={{ display: "flex", justifyContent: "center", margin: "10px 0" }}>

              <a 
                href={current.info} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  fontFamily: "Arial, sans-serif",
                  fontSize: "17px",
                }}
              >
                {current.name + " Subcouncil Contact Info"}
              </a>
            </div>
          )}
          
          </div>

          {/* Emergency Info Header */}
          
          <div>
            <hr style={{
              border: "none",
              borderTop: "2px solid #ccc",
              width: "90%",
              margin: "15px auto"
            }} 
          />

          <h2 style={{
            textAlign: "center",
            flexWrap: "wrap",
            whiteSpace: "normal",
            fontFamily: "Verdana",
            fontWeight: "bold",
            paddingBottom: "10px"
          }}>
            Emergency Services
          </h2>

          </div>

      <div style={{
          display: 'grid',
          gridTemplateColumns: 'calc(50% - 0.5px) 1px calc(50% - 0.5px)',
          gap: '0px',
          backgroundColor: '#f9f9f9',
          padding: '10px',
          borderRadius: '10px',
          fontSize: '14px',
          fontFamily: 'Arial, sans-serif',
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.25)",

        }}>
          <div style={{ display: 'contents' }}>
            <div style={{ borderBottom: '1px solid #ccc', padding: '5px 10px' }}><strong>Police Flying Squad:</strong></div>
            <div style={{ borderBottom: '1px solid #ccc', backgroundColor: '#ccc', width: '1px' }} />
            <div style={{ borderBottom: '1px solid #ccc', padding: '5px 10px' }}>10111</div>
          </div>
          <div style={{ display: 'contents' }}>
            <div style={{ borderBottom: '1px solid #ccc', padding: '5px 10px' }}><strong>Crime Stop:</strong></div>
            <div style={{ borderBottom: '1px solid #ccc', backgroundColor: '#ccc', width: '1px' }} />
            <div style={{ borderBottom: '1px solid #ccc', padding: '5px 10px' }}>0860 010 111</div>
          </div>
          <div style={{ display: 'contents' }}>
            <div style={{ borderBottom: '1px solid #ccc', padding: '5px 10px' }}><strong>Ambulance:</strong></div>
            <div style={{ borderBottom: '1px solid #ccc', backgroundColor: '#ccc', width: '1px' }} />
            <div style={{ borderBottom: '1px solid #ccc', padding: '5px 10px' }}>10177</div>
          </div>
          <div style={{ display: 'contents' }}>
            <div style={{ borderBottom: '1px solid #ccc', padding: '5px 10px' }}><strong>Cell Phone Emergency:</strong></div>
            <div style={{ borderBottom: '1px solid #ccc', backgroundColor: '#ccc', width: '1px' }} />
            <div style={{ borderBottom: '1px solid #ccc', padding: '5px 10px' }}>112 (MTN, Vodacom, Cell C and Telkom)</div>
          </div>
          <div style={{ display: 'contents' }}>
            <div style={{ borderBottom: '1px solid #ccc', padding: '5px 10px' }}><strong>Poisons Info Helpline (WC):</strong></div>
            <div style={{ borderBottom: '1px solid #ccc', backgroundColor: '#ccc', width: '1px' }} />
            <div style={{ borderBottom: '1px solid #ccc', padding: '5px 10px' }}>0861 555 777</div>
          </div>
          <div style={{ display: 'contents' }}>
            <div style={{ borderBottom: '1px solid #ccc', padding: '5px 10px' }}><strong>Childline:</strong></div>
            <div style={{ borderBottom: '1px solid #ccc', backgroundColor: '#ccc', width: '1px' }} />
            <div style={{ borderBottom: '1px solid #ccc', padding: '5px 10px' }}>116</div>
          </div>
          <div style={{ display: 'contents' }}>
            <div style={{ borderBottom: '1px solid #ccc', padding: '5px 10px' }}><strong>Safe Schools Call Centre:</strong></div>
            <div style={{ borderBottom: '1px solid #ccc', backgroundColor: '#ccc', width: '1px' }} />
            <div style={{ borderBottom: '1px solid #ccc', padding: '5px 10px' }}>0800 454 647</div>
          </div>
          <div style={{ display: 'contents' }}>
            <div style={{ borderBottom: '1px solid #ccc', padding: '5px 10px' }}><strong>Bureau of Missing Persons:</strong></div>
            <div style={{ borderBottom: '1px solid #ccc', backgroundColor: '#ccc', width: '1px' }} />
            <div style={{ borderBottom: '1px solid #ccc', padding: '5px 10px' }}>021 918 3512 / 3449 / 3452</div>
          </div>
          <div style={{ display: 'contents' }}>
            <div style={{ padding: '5px 10px' }}><strong>Lifeline:</strong></div>
            <div style={{ borderBottom: '1px solid #ccc', backgroundColor: '#ccc', width: '1px' }} />
            <div style={{ padding: '5px 10px' }}>021 461 1113</div>
          </div>
        </div>
      </div>
        
      </div>

  {/* Sidebar for add Issue */}
        <Offcanvas
          show={showIssueModal}
          onHide={handleFormClose}
          placement="end"
          backdrop={true}
        >
          <Offcanvas.Header style={{justifyContent: "center", position: "relative"}}>
            <Offcanvas.Title
              style={{
                fontSize: '1.85rem',
                fontWeight: '730',
                color: '#d9534f', // red
                letterSpacing: '0.5px',
                margin: 0,
              }}
            >
              ADD ISSUE
            </Offcanvas.Title>

            <CloseButton
              onClick={handleFormClose}
              style={{
                position: "absolute",
                right: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
          </Offcanvas.Header>

          <Offcanvas.Body>
            <Form>
              {/* Choose Settlement */}
              <Form.Group className="mb-4">
                <Form.Label><strong>Choose Township</strong></Form.Label>
                  <Dropdown>
                        <Dropdown.Toggle
                          variant="secondary"
                          id="settlement-toggle"
                          style={{ width: "100%" }}
                        >
                          {selectedCom || "Select Settlement"}
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{ width: "100%" }}>
                          {current?.townships.map((settlement, idx) => (
                            <Dropdown.Item
                              key={idx}
                              onClick={() => setSelectedCom(settlement)}
                            >
                              {settlement}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
              </Form.Group>

              {/* Issue Title */}
              <Form.Group className="mb-4">
                <Form.Label><strong>Issue Title</strong></Form.Label>
                <Form.Control
                  type="text"
                  maxLength="50"
                  placeholder="Enter Issue Title (50 characters max)"
                  required
                  onChange={(e) =>
                    setIssueForm({ ...issueForm, title: e.target.value })
                  }
                />
              </Form.Group>

              {/* Issue Category */}
              <Form.Group className="mb-4">
                <Form.Label><strong>Issue Category</strong></Form.Label>
                <Dropdown>
                  <Dropdown.Toggle 
                    variant="secondary" id="category-toggle" style={{ width: "100%" }}>
                    {issueForm.category || "Select Issue Category"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu style={{ width: "100%" }}>
                    {[
                      "Food/Water/Electricity",
                      "GBV",
                      "Eviction",
                      "Crime",
                      "Natural Disaster",
                      "Poor Housing Conditions",
                      "Other",
                    ].map((cat) => (
                      <Dropdown.Item
                        key={cat}
                        onClick={() => setIssueForm({ ...issueForm, category: cat })}
                      >
                        {cat}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>

              {/* Issue Description */}
              <Form.Group className="mb-4">
                <Form.Label><strong>Issue Description</strong></Form.Label>
                <Form.Control
                  as="textarea"
                  rows={8}
                  maxLength="500"
                  placeholder="Enter Issue Description (500 characters max)"
                  required
                  onChange={(e) =>
                    setIssueForm({ ...issueForm, description: e.target.value })
                  }
                />
              </Form.Group>

              {/* Submit Button */}
              <div className="d-grid">
                <Button variant="danger" size="lg" onClick={handleSubmitIssue}>
                  Submit
                </Button>
              </div>
            </Form>
          </Offcanvas.Body>
        </Offcanvas>
        
       <Modal show={showCommunityModal} onHide={handleModalClose} centered>
  <Modal.Header closeButton className="bg-danger text-white">
    <Modal.Title>Add a Community</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    <Form>
      <Form.Group className="mb-3">
        <Form.Label><strong>Community Name *</strong></Form.Label>
        <Form.Control
          value={form.name}
          maxLength="75"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Enter Community Name (Required)"
        />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Latitude</Form.Label>
        <Form.Control value={form.lat} readOnly />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Longitude</Form.Label>
        <Form.Control value={form.lng} readOnly />
      </Form.Group>

      <Accordion flush>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Housing Stats (optional)</Accordion.Header>
          <Accordion.Body>
            <Form.Group className="mb-2">
              <Form.Label>RDPs</Form.Label>
              <Form.Control
                type="text"
                value={form.housing.RDPs}
                onChange={(e) =>
                  setForm({
                    ...form,
                    housing: { ...form.housing, RDPs: e.target.value },
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>CRUs</Form.Label>
              <Form.Control
                type="text"
                value={form.housing.CRUs}
                onChange={(e) =>
                  setForm({
                    ...form,
                    housing: { ...form.housing, CRUs: e.target.value },
                  })
                }
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Backyard Dwellings</Form.Label>
              <Form.Control
                type="text"
                value={form.housing.backyardDwellings}
                onChange={(e) =>
                  setForm({
                    ...form,
                    housing: {
                      ...form.housing,
                      backyardDwellings: e.target.value,
                    },
                  })
                }
              />
            </Form.Group>
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
              <Form.Group className="mb-2" key={key}>
                <Form.Label>{label}</Form.Label>
                <Form.Control
                  type="text"
                  value={form.demo[key]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      demo: { ...form.demo, [key]: e.target.value },
                    })
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
      variant="danger"
      disabled={!form.name.trim()}
      onClick={handleSave}
    >
      Save
    </Button>
  </Modal.Footer>
</Modal>
 
    </>
)}

export default DistrictSideBar
