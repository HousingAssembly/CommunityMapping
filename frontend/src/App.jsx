import { useEffect, useState } from 'react'
import Header from './components/Header'
import { Toaster } from "./assets/ui/toaster"
import { AdminState } from "./context/Context";
import Map from './Map'
import Contacts from './components/Contacts'
import Districts from './components/Districts'
import DistrictSideBar from './components/DistrictSideBar'
import "./index.css"

//main components are rendered on our website wiht view in mind
function App() {
  const { selectedDistrict } = AdminState();
  const[view,setView]=useState('main')
  
  useEffect(()=>{
    if(selectedDistrict){
      setView('district')
    }else{
      setView('main')
    }
  }, [selectedDistrict])
  return (
    <>
      <Header/>
      <div className="main-container">
        <div className="map-section">
          <Map />
        </div>

        <div className="sidebar" >
         {(view==='main') &&
          (<>
          <div className="contacts-section">
            <Contacts />
          </div>
          </>)}
          {view==='district'&&<DistrictSideBar /> }
          {view==='issue'&&<AddIssueSideBar />}
        </div>

      </div>
      <Toaster />
    </>
  )
}

export default App
