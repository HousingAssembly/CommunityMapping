import React, { useState, useEffect } from 'react'
import {CloseButton, Button, Modal, Form, ModalDialog, Dropdown, Offcanvas, FormGroup} from 'react-bootstrap';
import { AdminState } from "../context/Context";
import {toaster} from '../assets/ui/toaster'
import axios from 'axios'
import { useMap } from 'react-leaflet';

const DistrictSideBar = () => {
    const { selectedDistrict, setSelectedDistrict, loggedIn, communityDraft, startCommunityPlacement, cancelCommunityPlacement,fetchCommunities, user} = AdminState();
    //whether "add community" modal shows
    const [showCommunityModal, setShowCommunityModal] = useState(false);
    //whether the “Add Issue” offcanvas shows
    const [showIssueModal, setShowIssueModal] = useState(false)
    //stores form data for a new community
    const [form, setForm] = useState({ name: "", lat: "", lng: "" });
    //stores form data for a new issue
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
                const { data } = await axios.get(`http://localhost:8000/addcom/fetch?district=${s.name}`);
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
    }, []);

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
            type: 'info'
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
        });
        setShowCommunityModal(true);
        }
    }, [communityDraft, selectedDistrict]);

    const handleSave = async () => {
    try {
        const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.post("http://localhost:8000/addcom", {
        name: form.name,
        districtName: selectedDistrict,
        coords: {lat:form.lat,long:form.lng},
      }, config);
      toaster.create({
            title: "Community Successfully Created",
            type: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
        });
      fetchCommunities(selectedDistrict)
      setShowCommunityModal(false);
      setForm({ name: "", lat: "", lng: "" });      
      cancelCommunityPlacement()
    } catch (err) {
      console.error(err);
    }
  };

  //backend updates with issues
  const handleSubmitIssue = async () => {
    try {
      await axios.post("http://localhost:8000/addissue", {
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
      setShowIssueModal(false);
      setForm({ name: "", lat: "", lng: "" });      
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
   if (!selectedDistrict) return null;
  return (
    <>
    {/* District Sidebar */}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "20px",
          marginRight: "20px",
        }}
      >
    <CloseButton onClick={() => setSelectedDistrict(null)} />
      </div>

      {/* District Header and Buttons */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
          margin: "10px",
          
        }}
      >
        <u>
          <h1>{selectedDistrict}</h1>
        </u>

        <div style={{ display: "flex", alignItems: "center", padding: "10px" }}>
          <Button variant="danger" onClick={() => handleAddIssueClick()}>
            + Add Issue
          </Button>

          {loggedIn && (
            <Button
              variant="danger"
              style={{ marginLeft: "20px" }}
              onClick={handleAddCommunityClick}
            >
              + Add Community
            </Button>
          )}
        </div>

        {/* Info Box */}
        <div
          style={{
            border: "2px solid #ccc",
            borderRadius: "20px",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h2
            style={{ display: "flex", margin: "10px", padding: "10px" }}
          >
            Local Contact Info:
          </h2>
          <div style={{ marginLeft: "10px" }}>
            {current && (
              <a href={current.info}>
                {current.name + " Subcouncil Contact Info"}
              </a>
            )}
          </div>
          <h2
            style={{ display: "flex", margin: "10px", padding: "10px" }}
          >
            Local Emergency Services:
          </h2>
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
                fontSize: '1.75rem',
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
                <Form.Label><strong>Choose Settlement</strong></Form.Label>
                  <Dropdown>
                        <Dropdown.Toggle
                          variant="secondary"
                          id="settlement-toggle"
                          style={{ width: "100%" }}
                        >
                          {selectedCom || "Choose Settlement"}
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
                    {issueForm.category || "Choose Issue Category"}
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
        
        <Modal show={showCommunityModal} onHide={handleModalClose}>
            <Modal.Header closeButton style={{background:'red', color:'white'}}>
            <Modal.Title>Add a Community</Modal.Title>
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
                <Form.Control value={form.lat} readOnly />
                </Form.Group>
                <Form.Group className="mt-3">
                <Form.Label>Longitude</Form.Label>
                <Form.Control value={form.lng} readOnly />
                </Form.Group>
            </Form>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
                Cancel
            </Button>
            <Button onClick={handleSave} disabled={!form.name.trim()} variant='danger'>
                Save
            </Button>
            </Modal.Footer>
        </Modal>    
    </>
)}

export default DistrictSideBar