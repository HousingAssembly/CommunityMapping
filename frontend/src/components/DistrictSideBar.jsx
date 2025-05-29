import React, { useState, useEffect } from 'react'
import {CloseButton, Button, Modal, Form} from 'react-bootstrap';
import { AdminState } from "../context/Context";
import {toaster} from '../assets/ui/toaster'
import axios from 'axios'

const DistrictSideBar = () => {
    const { selectedDistrict, setSelectedDistrict, loggedIn, communityDraft, startCommunityPlacement, cancelCommunityPlacement} = AdminState();

    const [showCommunityModal, setShowCommunityModal] = useState(false);
    const [form, setForm] = useState({ name: "", lat: "", lng: "" });

    const subcouncilInfo = [
        { name: 'Khayelitsha',      info:'https://www.capetown.gov.za/family%20and%20home/meet-the-city/city-council/subcouncils/subcouncil-profile?SubCouncilCode=9'    },
        { name: 'Athlone',          info:'https://www.capetown.gov.za/family%20and%20home/meet-the-city/city-council/subcouncils/subcouncil-profile?SubCouncilCode=11'   },
        { name: 'Mitchells Plain',  info:'https://www.capetown.gov.za/family%20and%20home/meet-the-city/city-council/subcouncils/subcouncil-profile?SubCouncilCode=12'  },
        { name: 'Northern Suburbs', info: 'https://www.capetown.gov.za/family%20and%20home/meet-the-city/city-council/subcouncils/subcouncil-profile?SubCouncilCode=5'},
        { name: 'Southern Suburbs', info: 'https://www.capetown.gov.za/family%20and%20home/meet-the-city/city-council/subcouncils/subcouncil-profile?SubCouncilCode=18'},
        { name: 'Malmesbury',       info: 'https://www.swartland.org.za/pages/english/contact-us/general.php'  },
        { name: 'Ceres',            info: 'http://www.witzenberg.gov.za/contact-us' },
        { name: '',                 info: 'https://www.capetown.gov.za/City-Connect/Register/Housing-and-property/Register-on-the-housing-database/Register%20on%20the%20housing%20database' },

    ]

    const current = subcouncilInfo.find((sc) => sc.name === selectedDistrict);

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
        // population etc,
         coords: {lat:form.lat,long:form.lng},
      });

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

   if (!selectedDistrict) return null;
  return (
    <>
        <div size='3s' style={{display:'flex', justifyContent:'flex-end', marginTop:'20px', marginRight:'20px'}}>
        <CloseButton onClick={()=>setSelectedDistrict(null)}/>
        </div>
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', height:'100%', margin:"10px"}}>
            <u><h1>{selectedDistrict}</h1></u>
            <div>
                <Button variant='danger' style={{margin:'20px'}}>+ Add Issue</Button>
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