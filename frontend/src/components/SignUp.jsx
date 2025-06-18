import React, {useState} from 'react'
import { Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { toaster } from "../assets/ui/toaster"
import { AdminState } from "../context/Context";

const SignUp = ({show, setShow}) => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [cpassword, setConfirmPassword] = useState('')

    const history = useNavigate();
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const { setLoggedIn } = AdminState();

    const handleSubmit= async (e)=>{
        e.preventDefault();
        setLoading(true);
        if ( !email || !password || !cpassword) {
            toaster.create({
                title: "Please Fill All Fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
                type: 'error'
            });
            setLoading(false);
            return;
        }
        if (password !== cpassword) {
            toaster.create({
                title: "Passwords Do Not Match",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
                type: 'error'
            });
            setLoading(false);
            return;
        }
        if(!email.endsWith('@housingassembly.org.za')){
            toaster.create({
                title: "Use Housing Assembly Email",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
                type: 'error'
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
        console.log('test')
        const { data } = await axios.post(
            `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/admin`,
            {
            email,
            password,
            },
            config
        );
        toaster.create({
            title: "Registration Successful",
            type: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
        });
        localStorage.setItem("userInfo", JSON.stringify(data));
        setLoading(false);
        setLoggedIn(true)
        history("/");
        } catch (error) {
        if (error.response.data.message == "User already exists"){
            toaster.create({
            title: "There is already an admin account with this email!",
            description: "",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
            type: 'error'
        });
        }
        else {
        toaster.create({
            title: "Error Occured!",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
            type: 'error'
        });
        }
        setLoading(false);
        }
    }
  return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton className="bg-danger text-white">
                <div className="w-100 text-center">
                    <Modal.Title style={{ fontFamily: 'Verdana', fontWeight: 'bold' }}>
                        Housing Assembly Admin Signup
                    </Modal.Title>
                </div>            
            </Modal.Header>

            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                <p style={{ fontSize: '0.95rem', color: '#555', fontStyle: 'italic' }}>
                    *Only the Housing Assembly administrative staff can create an account.*
                </p>

                    <Form.Group controlId="email">
                    <Form.Label>Email Address:</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        required
                        onChange={(e)=>setEmail(e.target.value)}
                    />
                    </Form.Group>

                    <Form.Group controlId="password" className="mt-3">
                    <Form.Label>Password:</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        onChange={(e)=>setPassword(e.target.value)}
                    />
                    </Form.Group>
                    <Form.Group controlId="confirmpassword" className="mt-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="confirmpassword"
                        placeholder="Confirm Password"
                        required
                        onChange={(e)=>setConfirmPassword(e.target.value)}
                    />
                    </Form.Group>

                    <div className="d-flex justify-content-end mt-4">
                    <Button variant="light" onClick={handleClose} className="me-2">
                        Cancel
                    </Button>
                    <Button variant="danger" type="submit" onClick={(e)=>handleSubmit(e)} loading={`${loading}`}>
                        Submit
                    </Button>
                    </div>
            </Form>
            </Modal.Body>
        </Modal>
  )
}

export default SignUp
