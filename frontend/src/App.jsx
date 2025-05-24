import { useState } from 'react'
import Header from './components/Header'
import { Toaster } from "./assets/ui/toaster"
import { AdminState } from "./context/Context";
import Map from './Map'
import Contacts from './components/Contacts'
import AddPin from './components/AddPin'
import AddProject from './components/AddProject'
import "./index.css"

function App() {
    const { loggedIn } = AdminState();
  return (
    <>
      <Header/>
      <div className="main-container">
        <div className="map-section">
          <Map />
        </div>

        <div className="sidebar">
          <div className="contacts-section">
            <Contacts />
          </div>

          <div className="actions-section">
            <AddPin />
            {loggedIn && <AddProject />}
          </div>
        </div>
      </div>
      <Toaster />
    </>
  )
}

export default App
