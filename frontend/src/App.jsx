import { useState } from 'react'
import Header from './components/Header'
import { Toaster } from "./assets/ui/toaster"
import { AdminState } from "./context/Context";
import Map from './Map'
import Contacts from './components/Contacts'
import Districts from './components/Districts'
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
            <Districts />
          </div>
        </div>
      </div>
      <Toaster />
    </>
  )
}

export default App
