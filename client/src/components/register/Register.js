import React, {useRef, useState} from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import './Register.css'
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../logo/Logo';

export default function Register() {
    const emailRef = useRef();
    const passRef = useRef();
    const conPassRef = useRef();

    const [emailError, setEmailError] = useState('');
    const [passError, setPassError] = useState('');
    const [conpassError, setconPassError] = useState('');

    const [emailValidity, setemailValidity] = useState(false);
    const [passValidity, setPassValidity] = useState(false);
    const [conPassValidity, setconPassValidity] = useState(false);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const {sign_up} = useAuth();

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault()

        const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

        if(emailRef.current.value.length < 1){
            setemailValidity(true)
            return setEmailError('Email is required')
        } else {
            setemailValidity(false)
            setEmailError('')
        }

        if(regex.test(emailRef.current.value) === false){
            setemailValidity(true)
            return setEmailError('Invalid Email address')
        }else {
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

        if(conPassRef.current.value.length < 1){
            setconPassValidity(true)
            return setconPassError('Confirmation password is required')
        }else {
            setPassValidity(false)
            setPassError('')
        }

        if (passRef.current.value !== conPassRef.current.value){
            setconPassValidity(true)
            conPassRef.current.value = ''
            setconPassError('')
            return setError('Password do not match')
        } 

        try {
            setError('');
            setLoading(true)
             await sign_up(emailRef.current.value, passRef.current.value)
             navigate('/login')
        } catch (error) {
            if (error.code.includes('auth/email-already-in-use')) {
                setError('Email is already used. Try to login')
            } else {
                setError('Error Occured. Unable to create account')

            }
        }
        
        setLoading(false)
        setconPassValidity(false)

    }

    const matchPassValidation =  (e) => {
        let passLen = passRef.current.value.length
       if( passLen < 8  ){
           setPassValidity(true)
           setPassError('Password must be more than 8 characters')
       } else{
           setPassValidity(false)
       }
    }

  return (
      <>
        <Logo/>
        <div className='d-flex mt-5 justify-content-center regs-form-container'>
            <div className='regs-form-card w-100'>
                <Card className='shadow-sm'>
                    <Card.Body>
                        <p id='medyo-bold' className='display-2'>Sign Up</p>
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
                            <Form.Group className='mb-2' id='password' controlId="formBasicPassword" onChange={matchPassValidation}>
                                <Form.Label>Password*</Form.Label>
                                <Form.Control type='password' ref={passRef} required isInvalid={passValidity}></Form.Control>
                                <Form.Control.Feedback type='invalid'>
                                    {passError}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group id='conPass' controlId="formBasicPassword">
                                <Form.Label>Password Confirmation*</Form.Label>
                                <Form.Control type='password' ref={conPassRef} required isInvalid={conPassValidity}></Form.Control>
                                <Form.Control.Feedback type='invalid'>
                                    {conpassError}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Button disabled={loading} className='w-30 mt-4 btn-success fw-bold' type='submit'>Sign Up</Button>
                        </Form>
                    </Card.Body>
                </Card>
                <div className='w-100 text-center mt-2'>
                    Already have an account? <Link to='/login'>Log In</Link>  here!
                </div>
            </div>
        </div> 
      </>
            
  )
}
