import React, { useRef, useState} from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import './Register.css'
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Axios from 'axios'
import Swal from 'sweetalert2'

export default function Register() {
    const uNameRef = useRef()
    const emailRef = useRef();
    const passRef = useRef();
    const conPassRef = useRef();

    const [show, setShow] = useState(true)

    const [emailError, setEmailError] = useState('');
    const [passError, setPassError] = useState('');
    const [conpassError, setconPassError] = useState('');
    const [unameErr, setunameErr] = useState('');
    const [unameUsed, setunameUsed] = useState(false);



    const [emailValidity, setemailValidity] = useState(false);
    const [unameValidiity, setunameValidity] = useState(false);
    const [passValidity, setPassValidity] = useState(false);
    const [conPassValidity, setconPassValidity] = useState(false);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const {sign_up, logout} = useAuth();

    const navigate = useNavigate();

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })

      const fire = () => {
        return(
            Toast.fire({
                icon: 'success',
                title: 'Registered successfully'
              }).then(() => {
                setLoading(false)
                window.location.href = '/login'
              })
        )
      }

    async function handleSubmit(e) {
        e.preventDefault()

        const emailregex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

        if(uNameRef.current.value.length < 1){
            setunameValidity(true)
            return setunameErr('Username is required')
        } else {
            setunameValidity(false)
            setunameErr('')
        }
         if (unameUsed) {
            setunameValidity(true)
            return setunameErr('Username is already used')
         }

        if(emailRef.current.value.length < 1){
            setemailValidity(true)
            return setEmailError('Email is required')
        } else {
            setemailValidity(false)
            setEmailError('')
        }

        if(emailregex.test(emailRef.current.value) === false){
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
            setconPassValidity(false)
            setconPassError('')
        }

        if (passRef.current.value !== conPassRef.current.value){
            setconPassValidity(true)
            conPassRef.current.value = ''
            setconPassError('')
            return setError('Password do not match')
        } 
        
        setError('');
        setLoading(true)
        sign_up(emailRef.current.value, passRef.current.value).then(() => {
            Axios.post('http://localhost:3001/save-username', {
                username: uNameRef.current.value,
                email: emailRef.current.value,
                }).then(async (response) => {
                if (response.status === 200){
                    console.log(response);
                    logout().then(() => {
                        fire()
                    })
                }
                }).catch((error) => {
                    setError(error)
                })
        }).catch((error) => {
            if (error.code.includes('auth/email-already-in-use')) {
                setError('The email address is already in use by another account.')
            } else {
                setError('Error Occured. Unable to create account')
            }
            setLoading(false)

        })
            
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

    const onUnameChange = (e) => {
        const unamaregex = /^[a-zA-Z0-9@#\$\^\&\)\(+._-]+$/g

        if (unamaregex.test(uNameRef.current.value) === false && uNameRef.current.value.length > 0){
            setunameValidity(true)
            return setunameErr('Special characters is not allowed ( ? % & / < )')
        }

        if (uNameRef.current.value.length <= 6) {
            setunameValidity(true)
            return setunameErr('Username must be more than 6 characters')
        } else{
            setunameErr('')
            setunameValidity(false)
        }
        
        
        Axios.post('http://localhost:3001/check-username', {
                username: e.target.value,
            }).then(async (response) => {
                console.log(response);
               if (response.data.length > 0) {
                setunameValidity(true)
                setunameUsed(true)
                return setunameErr('Username is already used')
               } else{
                    setunameUsed(false)

               }
            })
         
    }

  return (
      <>

        <div className='d-flex mt-5 justify-content-center regs-form-container'>
            <div className='regs-form-card w-100'>
                <Card className='shadow-sm'>
                    <Card.Body>
                        <p id='medyo-bold' className='display-2'>Sign Up</p>
                        <hr className='mt-2 mb-3'/>
                        {error && <Alert variant='danger'>{error}</Alert>}
                        <Form noValidate onSubmit={handleSubmit}>
                            <Form.Group className='mb-2' id='text' controlId='formBasicUname'>
                                <Form.Label>Username*</Form.Label>
                                <Form.Control type='email' ref={uNameRef} required isInvalid={unameValidiity} onChange={onUnameChange}></Form.Control>
                                <Form.Control.Feedback type="invalid">
                                    {unameErr}
                                </Form.Control.Feedback>
                            </Form.Group>
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
                            <Form.Group id='conPass' controlId="formBasicConPassword">
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
