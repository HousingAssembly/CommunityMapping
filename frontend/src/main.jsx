import AdminProvider from "./context/Context"
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import App from './App.jsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import L from 'leaflet';

import L from "leaflet";

import iconRetina   from "leaflet/dist/images/marker-icon-2x.png";
import iconNormal   from "leaflet/dist/images/marker-icon.png";
import iconShadow   from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl:       iconNormal,
  shadowUrl:     iconShadow,
});

createRoot(document.getElementById('root')).render(

    <BrowserRouter>
      <AdminProvider>
        <ChakraProvider value={defaultSystem}>
          <App />
        </ChakraProvider>
      </AdminProvider>
    </BrowserRouter>
)
