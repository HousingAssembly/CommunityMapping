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
            height:'50px'
        }}>
           Contact Information
    </h1>
    <div>        
         <a href={subcouncilInfo[7].info}>City of Cape Town Waiting List Registration</a>
    </div>
    <div>        
         {current && <a href={current.info}>{current.name+' Subcouncil Contact Info'}</a>}
    </div>
    </>
  )
}

export default Contacts