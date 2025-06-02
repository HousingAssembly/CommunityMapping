import React, { useState, useEffect } from 'react'
import {CloseButton, Button, Modal, Form, ModalDialog, Dropdown, Offcanvas, FormGroup} from 'react-bootstrap';
import { AdminState } from "../context/Context";
import {toaster} from '../assets/ui/toaster'
import axios from 'axios'
import { useMap } from 'react-leaflet';

const DistrictSideBar = () => {
    const { selectedDistrict, setSelectedDistrict, loggedIn, communityDraft, startCommunityPlacement, cancelCommunityPlacement,fetchCommunities} = AdminState();
    const [showCommunityModal, setShowCommunityModal] = useState(false);
    const [showIssueModal, setShowIssueModal] = useState(false)
    const [form, setForm] = useState({ name: "", lat: "", lng: "" });
    const [issueForm, setIssueForm]=useState({title:'', category:'', description:''})
    const [subcouncils, setSubcouncils]= useState([])
      
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

        const updated = await Promise.all(
            base.map(async (s) => {
            if (!s.name) return { ...s, townships: ['N/A'] }
            try {
                const { data } = await axios.get(`http://localhost:8000/addcom/fetch?district=${s.name}`);
                return { ...s, townships: data.map((c) => c.name) };
            } catch (err) {
                console.error(`Failed to fetch communities for ${s.name}`, err);
                return { ...s, townships: [] };
            }
            })
        );

        setSubcouncils(updated);
    };

    useEffect(() => {
        loadTownships();
    }, []);

    const current = subcouncils.find((sc) => sc.name === selectedDistrict);

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

    const handleAddIssueClick = () => {
      
      setIssueForm({title:'',category:'',description:''})
      setShowIssueModal(true)
    }

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
      await axios.post("http://localhost:8000/addcom", {
        name: form.name,
        districtName: selectedDistrict,
        coords: {lat:form.lat,long:form.lng},
      });
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
        <div size='3s' style={{display:'flex', justifyContent:'flex-end', marginTop:'20px', marginRight:'20px'}}>
        <CloseButton onClick={()=>setSelectedDistrict(null)} />
        </div>
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', height:'100%', margin:"10px"}}>
            <u><h1>{selectedDistrict}</h1></u>
            <div style={{display:'flex', alignItems:'center'}}>
                <Dropdown>
                  <Dropdown.Toggle variant='danger' id="dropdown-basic" >
                    + Add Issue
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {current?.townships.map((value, index) => (
                          <Dropdown.Item key={index}  onClick={handleAddIssueClick}>
                            {value}
                          </Dropdown.Item>
                      )) 
                      }
                    </Dropdown.Menu>
                </Dropdown>
                {loggedIn && <Button variant='danger' style={{margin:'20px'}} onClick={handleAddCommunityClick}>+ Add Community</Button>}
            </div>
            <div style={{
                border: '2px solid #ccc',
                borderRadius: '8px',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                width:'100%',
                height: '100%',
                display:'flex',
                flexDirection:'column',
            }}>
                <h2 style={{display:'flex', justifyContent:'center', margin:"10px"}}>Local Contact Info</h2>
                 <div style={{marginLeft:'10px'}}>        
                    {current && <a href={current.info}>{current.name+' Subcouncil Contact Info'}</a>}
                </div>
                <h2 style={{display:'flex', justifyContent:'center', margin:"10px"}}>Local Emergency Services</h2>
            </div>
        </div>   

       
        <Offcanvas show={showIssueModal} onHide={handleFormClose} placement="end">
          <div style={{display:"flex", justifyContent:"right"}}>
            <CloseButton style={{marginTop:"10px", marginRight:"10px"}} onClick={handleFormClose}></CloseButton>
          </div>
          <div>
            <h1 style={{display:"flex", justifyContent:"center"}}><u><strong> Add Issue </strong></u></h1>
             <br />
            <Form>
              <FormGroup >
                <Form.Label style={{marginLeft:'10px'}}>Issue Title:</Form.Label>
                  <Form.Control
                      type="title"
                      name="title"
                      maxLength="50"
                      placeholder="Enter Issue Title (50 characters max)"
                      required
                      onChange={(e)=>setIssueForm({...issueForm, title: e.target.value})}
                  />
              </FormGroup>
            </Form>
            <br />
            <br />
            <Dropdown >
                <Dropdown.Toggle variant="dark" id="dropdown-basic" style={{marginLeft:'10px'}}>
                  {issueForm.category==='' ? 'Choose Issue Category' : issueForm.category}
                      <Dropdown.Menu>
                          <Dropdown.Item href="#/action1" onClick={(e)=>setIssueForm({...issueForm, category: 'Food/Water/Electricity'})}> Food/Water/Electricity </Dropdown.Item>
                          <Dropdown.Item href="#/action2" onClick={(e)=>setIssueForm({...issueForm, category: 'GBV'})}> GBV </Dropdown.Item>
                          <Dropdown.Item href="#/action3" onClick={(e)=>setIssueForm({...issueForm, category: 'Eviction'})}> Eviction </Dropdown.Item>
                          <Dropdown.Item href="#/action4" onClick={(e)=>setIssueForm({...issueForm, category: 'Crime'})}> Crime </Dropdown.Item>
                          <Dropdown.Item href="#/action5" onClick={(e)=>setIssueForm({...issueForm, category: 'Natural Disaster'})}> Natural Disaster </Dropdown.Item>
                          <Dropdown.Item href="#/action6" onClick={(e)=>setIssueForm({...issueForm, category: 'Poor Housing Conditions'})}> Poor Housing Conditions </Dropdown.Item>
                          <Dropdown.Item href="#/action7" onClick={(e)=>setIssueForm({...issueForm, category: 'Other'})}> Other </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown.Toggle>
            </Dropdown>
            <br />
            <br />
            <Form>
              <FormGroup >
                <Form.Label style={{marginLeft:'10px'}}>Issue Description:</Form.Label>
                  <Form.Control
                      as="textarea"
                      rows={3}
                      type="title"
                      name="title"
                      maxLength="500"
                      placeholder="Enter Issue Description (500 characters max)"
                      required
                      onChange={(e)=>setIssueForm({...issueForm, description: e.target.value})}
                  />
              </FormGroup>
            </Form>
            </div>
            <br />
            <br />
            <div style={{display:"flex", justifyContent:"center"}}>
            <Button variant="danger" size="lg" onClick={handleFormClose}>
              Submit
            </Button>
            </div>
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