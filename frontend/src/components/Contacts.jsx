import React, {useState} from 'react'
import { AdminState } from "../context/Context";
import{Button} from 'react-bootstrap'

const Contacts = () => {
    const { selectedDistrict, showShelters, setShowShelters } = AdminState();

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
   
  return (
    <>
    <h1 style={{
        display:'flex',
        justifyContent:'center',
        width:'100%',
        height:'30px',
        fontFamily: 'Arial, sans-serif'
    }}>
      Contact Information:
    </h1>

    <div style = {{
      display: 'flex',
      flexDirection: 'column',
      padding: '45px 0',
      fontFamily: 'Arial, sans-serif',
      justifyContent:'center'
    }}>        
      <a
        style={{ margin: '10px 0' }}
        href={subcouncilInfo[7].info}
        target= "_blank"
        rel="noopener noreferrer"
        >
          City of Cape Town Waiting List Registration
      </a>

      <a 
        style={{ marginBottom: '10px 0' }} 
        href={"https://www.capetown.gov.za/Family%20and%20home/residential-property-and-houses/informal-housing/about-informal-housing"}
        target="_blank"
        rel="noopener noreferrer"
      >
        City of Cape Town About Informal Settlements 
      </a>
      <Button variant={showShelters ? 'secondary' : 'danger'} onClick={()=>setShowShelters(!showShelters)}>{showShelters ? "Hide Homeless Shelters": "Show Homeless Shelters"}</Button>
    </div>
      <div>
      <h1 style={{
        display:'flex',
        justifyContent:'center',
        width:'100%',
        fontFamily: 'Arial, sans-serif'}}>
          Emergency Services:
        </h1>
            <br />
        <div style = {{
          display: 'flex',
          flexDirection: 'column',
          
          fontFamily: 'Arial, sans-serif'
        }}> <h3 style={{display:'flex', justifyContent:'left'}}> <u> Phone Numbers: </u> </h3>

        </div>
        <strong> Police Flying Squad: </strong> 10111 <br />
        <strong>Crime Stop: </strong> 0860 010 111 <br />
        <b>Ambulance:</b> 10177 <br />
        <strong>Cell Phone Emergency: </strong>112 (MTN, Vodacom, Cell C and
        Telkom) <br />
        <b>Poisons Information Helpline of the
        Western Cape: </b>
        0861 555 777<br />
        <b>Childline:</b> 116 <br />
        <b>Safe Schools call centre: </b>0800 454 647<br />
        <b>Bureau of Missing Persons: </b>021 918 3512 / 3449 / 3452<br />
        <b>Lifeline: </b>021 461 1113<br />
    
        </div>
    <div style = {{
      padding: '10px 0'
    }}>        
      {current && 
      <a
        href={current.info}
        target="_blank"
        rel="noopener noreferrer"
      >
        {current.name+' Subcouncil Contact Info'}
      </a>}
    </div>
    </>
  )
}

export default Contacts