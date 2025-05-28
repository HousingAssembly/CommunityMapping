import React from 'react'
import {} from 'react-bootstrap'

const Districts = () => {
  return (
    <div style={{
            display:'flex',
            flexDirection:'column',
            width:'100%',
            color:'black'
        }}>
     <div style={{
             display:'flex',
            justifyContent:'center',
        }}>
           Current HA Districs
    </div>
    <ul
    style={{
      listStyleType: 'disc',}}>
        <li>Kayelitsha</li>
        <li>Athone</li>
        <li>Mitchell's Plain</li>
        <li>Northern Suburbs</li>
        <li>Southern Suburbs</li>
        <li>Malmesbury</li>
        <li>Ceres</li>
    </ul>
    </div>
  )
}

export default Districts