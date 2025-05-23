import AdminProvider from "./context/Context"
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import App from './App.jsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <AdminProvider>
        <ChakraProvider value={defaultSystem}>
          <App />
        </ChakraProvider>
      </AdminProvider>
    </BrowserRouter>
)
