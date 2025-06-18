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
        <div>
      <h2 style={{
        display:'flex',
        justifyContent:'center',
        width:'100%',
        height:'20px',
        fontFamily: 'Verdana',
        fontWeight: "bold",
        marginTop: "10px",
        textDecoration: 'underline'
        }}>
        Welcome!
      </h2>

      <br/>

      <div style = {{
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Arial, sans-serif',
        justifyContent:'center',
        marginBottom:'10px'
        }}>
          
          <p>This is a normal paragraph of text. 
            This is a normal paragraph of text.
            This is a normal paragraph of text.
            This is a normal paragraph of text.
          </p>
      </div>
    </div>

    <br/>

    <div>
      <h2 style={{
        display:'flex',
        justifyContent:'center',
        width:'100%',
        height:'20px',
        fontFamily: 'Verdana',
        fontWeight: "bold",
        marginTop: "10px"
        }}>
        Contact Information
      </h2>

      <br/>

      <div style = {{
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Arial, sans-serif',
        justifyContent:'center',
        marginBottom:'10px'
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
          style={{ marginBottom: '10px' }} 
          href={"https://www.capetown.gov.za/Family%20and%20home/residential-property-and-houses/informal-housing/about-informal-housing"}
          target="_blank"
          rel="noopener noreferrer"
        >
          City of Cape Town About Informal Settlements 
        </a>
      </div>
    </div>
    
    <br/>

    <div>
      <h2 style={{
        display:'flex',
        justifyContent:'center',
        width:'100%',
        fontFamily: 'Verdana',
        fontWeight: 'bold',
        paddingBottom: '10px'
      }}> 
        Homeless Shelters
      </h2>
 
      <div style={{
        display:'flex', 
        justifyContent:'center', 
        marginBottom:'10px'
      }}>

        <Button 
          variant={showShelters ? 'secondary' : 'danger'} 
          onClick={()=>setShowShelters(!showShelters)}
        >
          {showShelters ? "Hide Homeless Shelters": "Show Homeless Shelters"}
        </Button>
      </div>
    </div>
    
    <br/>
    <br/>

    <div>
      <h2 style={{
        display:'flex',
        justifyContent:'center',
        width:'100%',
        fontFamily: 'Verdana',
        fontWeight: 'bold'
        }}>
          Emergency Services
      </h2>
        
      <br/>

      <div style={{
          display: 'grid',
          gridTemplateColumns: 'calc(50% - 0.5px) 1px calc(50% - 0.5px)',
          gap: '0px',
          backgroundColor: '#f9f9f9',
          padding: '15px',
          borderRadius: '10px',
          fontSize: '14px',
          fontFamily: 'Arial, sans-serif'
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