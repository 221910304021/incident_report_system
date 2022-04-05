import React,  {useRef, useState} from "react";
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import './Login.css'
import Logo from "../logo/Logo";

export default function Login() {
    const emailRef = useRef();
    const passRef = useRef();

    const [emailError, setEmailError] = useState('');
    const [passError, setPassError] = useState('');
    const [emailValidity, setemailValidity] = useState(false);
    const [passValidity, setPassValidity] = useState(false);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const {login} = useAuth();

    const navigate = useNavigate();


    async function handleSubmit(e) {
        e.preventDefault()

        if(emailRef.current.value.length < 1){
            setemailValidity(true)
            return setEmailError('Email is required')
        } else {
            setemailValidity(false)
            setEmailError('')
        }

        if(passRef.current.value.length < 1){
            setPassValidity(true)
            return setPassError('Password is required')
        }else {
            setPassValidity(false)
            setPassError('')
        }

        try {
            setError('');
            setLoading(true)
            await login(emailRef.current.value, passRef.current.value)
            navigate('/')
        } catch (error) {
            setError('Aunthentication failed. Incorrect email or password.')

        }

        setLoading(false)
    }

    return(
        <>
            <Logo/>
            <div className='d-flex mt-5 justify-content-center regs-form-container'>
                <div className='regs-form-card w-100'>
                    <Card className='shadow-sm'>
                        <Card.Body>
                            <p id='medyo-bold' className='display-2'>Log In</p>
                            <hr className='mt-2 mb-3'/>
                            {error && <Alert variant='danger'>{error}</Alert>}
                            <Form noValidate onSubmit={handleSubmit}>
                                <Form.Group className='mb-2' id='email' controlId='formBasicEmail'>
                                    <Form.Label>Email*</Form.Label>
                                    <Form.Control type='email' ref={emailRef} required isInvalid={emailValidity}></Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        {emailError}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className='mb-2' id='password' controlId="formBasicPassword">
                                    <Form.Label>Password*</Form.Label>
                                    <Form.Control type='password' ref={passRef} required isInvalid={passValidity}></Form.Control>
                                    <Form.Control.Feedback type='invalid'>
                                        {passError}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Button disabled={loading} className='w-30 mt-4 btn-success fw-bold' type='submit'>Log In</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                    <div className='w-100 text-center mt-2'>
                        Don't have an account? <Link to='/signup'>Sign Up</Link> here!
                    </div>
                </div>
            </div>
        </>
             
    );
}