import React,  {useRef, useState} from "react";
import { Form, Button, Card, Alert, Navbar} from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import './Login.css'
import Axios from 'axios';
import Swal from "sweetalert2";

export default function Login() {
    const emailRef = useRef();
    const passRef = useRef();

    const [attempt, setAttempt] = useState(0);

    const [emailError, setEmailError] = useState('');
    const [passError, setPassError] = useState('');
    const [emailValidity, setemailValidity] = useState(false);
    const [passValidity, setPassValidity] = useState(false);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [show, setShow] = useState(true)


    const {login} = useAuth();

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
                title: 'Login successfully'
              }).then(() => {
                  window.location.replace('/')
                  setLoading(false)
              })
        )
      }
    
    const emailregex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const unamaregex = /^[a-zA-Z0-9@#\$\^\&\)\(+._-]+$/g

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
        
        if (attempt >= 2) {
            return attempReached();
        }

        if(emailregex.test(emailRef.current.value) === false){
            if(unamaregex.test(emailRef.current.value) === false){
                setError('Aunthentication failed. Incorrect email or password.')
                return setAttempt(attempt+1)
            }else {
                Axios.post('http://localhost:3001/check-username', {
                username: emailRef.current.value,
                }).then(async (response) => {
                    if (response.data.length > 0) {
                        login(response.data[0].email, passRef.current.value).then(()=>{
                            fire()
                            setError('');
                            setLoading(true)
                        }).catch( (error) => {
                            setLoading(false)
                            setError('Aunthentication failed. Incorrect email or password.')
                            setAttempt(attempt+1)
                        })
                    } else{
                        setLoading(false)
                        setError('Aunthentication failed. Incorrect email or password.')
                        return setAttempt(attempt+1)

                    }
                })
            }
        } else{
            login(emailRef.current.value, passRef.current.value).then(()=>{
                fire()
                setError('');
                setLoading(true)
            }).catch( (error) => {
                setLoading(false)
                setError('Aunthentication failed. Incorrect email or password.')
                setAttempt(attempt+1)
            })
        }
    }

    const attempReached = () => {
        let timeleft = '';

        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            html: `<p>You've reach the maximum number of login attmepts <br/><p/><p>Try again after <strong></strong> second</p>`,
            timer: 30000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowEnterKey:false,
            allowEscapeKey: false,
            allowOutsideClick: false,
            didRender: () => {
                timeleft = setInterval(() => {
                    Swal.getHtmlContainer().querySelector('strong')
                      .textContent = (Swal.getTimerLeft() / 1000)
                        .toFixed(0)
                  }, 100)
            },
            willClose: () => {
                clearInterval(timeleft)
            }
      }).then(()=> {
          setAttempt(0)
      })
    }

    return(
        <>  
            <div className='d-flex mt-5 justify-content-center regs-form-container'>
                <div className='regs-form-card w-100'>
                    <Card className='shadow-sm'>
                        <Card.Body>
                            <p id='medyo-bold' className='display-2'>Log In</p>
                            <hr className='mt-2 mb-3'/>
                            {error && <Alert variant='danger'>{error}</Alert>}
                            <Form noValidate onSubmit={handleSubmit}>
                                <Form.Group className='mb-2' id='email' controlId='formBasicEmail'>
                                    <Form.Label>Email or Username*</Form.Label>
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