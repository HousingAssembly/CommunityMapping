import React, {useState} from 'react'
import { AdminState } from "../context/Context";

const Contacts = () => {
    const { selectedDistrict } = AdminState();

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
      Contact Information
    </h1>

    <div style = {{
      display: 'flex',
      flexDirection: 'column',
      padding: '45px 0',
      fontFamily: 'Arial, sans-serif'
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