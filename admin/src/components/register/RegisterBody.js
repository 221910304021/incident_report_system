import React, {useRef, useState, useEffect} from 'react'
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import { Modal, Button, Alert, Form, Container, Card } from 'react-bootstrap';
import Axios from 'axios'


export default function RegisterBody({submit, getSubmit, getLoginInfo, savedLoginInfo}) {
    const uNameRef = useRef()
    const emailRef = useRef();
    const passRef = useRef();
    const conPassRef = useRef();
    const submitBtnRef = useRef();

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

    useEffect(() => {
        if (submit) {
          submitBtnRef.current.click();
        }
        getSubmit(show)
    }, [submit, loading, show])

    useEffect(() => {
        if (Object.keys(savedLoginInfo).length > 0) {
            uNameRef.current.value = savedLoginInfo.username
            emailRef.current.value= savedLoginInfo.email
        }
    }, [])
    

    async function handleSubmit(e) {
        e.preventDefault()

        const emailregex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

        if(uNameRef.current.value.length < 1){
            uNameRef.current.focus()
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
            emailRef.current.focus()
            setemailValidity(true)
            return setEmailError('Email is required')
        } else {
            setemailValidity(false)
            setEmailError('')
        }

        if(emailregex.test(emailRef.current.value) === false){
            emailRef.current.focus()
            setemailValidity(true)
            return setEmailError('Invalid Email address')
        }else {
            setemailValidity(false)
            setEmailError('')
        }

        if(passRef.current.value.length < 1){
            passRef.current.focus()
            setPassValidity(true)
            return setPassError('Password is required')
        }else {
            setPassValidity(false)
            setPassError('')
        }

        if(conPassRef.current.value.length < 1){
            conPassRef.current.focus()
            setconPassValidity(true)
            return setconPassError('Confirmation password is required')
        }else {
            setconPassValidity(false)
            setconPassError('')
        }

        if (passRef.current.value !== conPassRef.current.value){
            setconPassValidity(true)
            conPassRef.current.focus()
            conPassRef.current.value = ''
            setconPassError('')
            return setError('Password do not match')
        } 

        setError('');
        setLoading(true)

     Axios.post('http://localhost:3001/check-evaluator', {
          email: emailRef.current.value
      }).then((response) => {
        if (JSON.stringify(response.data).includes('uid')) {
            emailRef.current.focus()
            setemailValidity(true)
            return setError('The email is already used by another account')
        } else{
            getLoginInfo({
                username: uNameRef.current.value,
                email: emailRef.current.value,
                password: passRef.current.value, 
            })
        }
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
       <p id='medyo-bold' className='fs-4 m-0'>Login Information</p>
        <hr className='my-2'/>
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
        </Form>
        <Button ref={submitBtnRef} hidden={true} onClick={handleSubmit}/>
      </>
            
  )
}
