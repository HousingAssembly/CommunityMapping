import React, {useState} from 'react'
import HAlogo from '../assets/HA-swhite.png'
import { Button, Navbar, Image ,Modal, Form,  } from 'react-bootstrap';
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { toaster } from "../assets/ui/toaster"
import { AdminState } from "../context/Context";
import SignUp from './SignUp'
import { SelectPositioner } from '@chakra-ui/react';

const Header = () => {
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [openSignup, setopenSignup] = useState(false)
    const history = useNavigate();
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const handleSignup = () => setopenSignup(true)
    const { loggedIn,setLoggedIn, setUser} = AdminState();
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        if (!email || !password) {
            toaster.create({
                title: "Missing Email or Password",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
                type:'error'
            });
            setLoading(false);
            return;
        }
        try {
        const config = {
            headers: {
            "Content-type": "application/json",
            },
        };        
        const { data } = await axios.post(
            `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/admin/login`,
            { email, password },
            config
        );
        toaster.create({
            title: "Admin Login Successful",
            type: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
        });
        setLoggedIn(true)
        setUser(data)
        setLoading(false);
        handleClose();
        } catch (error) {
        toaster.create({
            title: "Invalid Credentials!",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
            type: 'error'
        });
        setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("userInfo")
        setUser(null)
        setLoggedIn(false)
        toaster.create({
            title: "Logout Successful",
            type: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
        });
        sleep(500)
        window.location.reload();
    };


  return (
    
    <Navbar style={{background:'#d32535', width:'100%', display:'flex', justifyContent:"space-between", alignItems:'center'}}>
        
        <Image
          src= {HAlogo}
          alt="Logo"
          rounded
          style={{ width:'70px', margin:"10px 20px 10px 20px", height:'60px', display:'flex', justifyContent:'left' }}
        />

        <header className="main-header"><h1 style={{color:'white', display:'flex', alignItems:"center", textAlign: "center", margin: "0px 10px 0px 10px" }}> <strong>Housing Assembly Interactive Map</strong> </h1></header>
        {!loggedIn && 
        <div style={{display:'flex', flexDirection:'column', }}>
            <Button variant='light' style={{height:'50%', margin:"10px 20px 10px 20px"}} onClick={handleShow}>
            <i> Admin Login </i>
            </Button> 
        </div>
        }
        {loggedIn && <div style={{display:'flex', flexDirection:'column', }}>
            <Button variant='light' style={{height:'50%', marginRight:'10px', marginBottom:'5px'}} onClick={handleLogout}>
            Admin Logout
            </Button> 
        </div> }

        
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton className="bg-danger text-white">
            <Modal.Title>Housing Assembly Admin Login</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    required
                    onChange={(e)=>setEmail(e.target.value)}
                />
                </Form.Group>

                <Form.Group controlId="password" className="mt-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                    onChange={(e)=>setPassword(e.target.value)}

                />
                </Form.Group>
                
               <div style={{display:'flex', justifyContent:'space-between', alignItems:'end'}}>
                    <Button variant='secondary' style={{height:'50%', marginRight:'10px'}} onClick={() => {
                    handleClose();
                    handleSignup();
                }}>
                        Create New Account
                    </Button>
                    <div className="d-flex justify-content-end mt-4">     
                        <Button variant="light" onClick={handleClose} className="me-2">
                            Cancel
                        </Button>
                        <Button variant="danger" type="submit" onClick={handleSubmit} loading={`${loading}`}>
                            Submit
                        </Button>
                    </div>
                </div>
            </Form>
            </Modal.Body>
        </Modal>


        {
            openSignup && <SignUp show={openSignup} setShow={setopenSignup}/>
        }
        
    </Navbar>
  )
}

export default Header