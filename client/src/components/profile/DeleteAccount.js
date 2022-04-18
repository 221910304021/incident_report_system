import React, {useState, useRef} from 'react'
import { Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';


export default function DeleteAccount() {
  const passRef = useRef();
  const [passError, setPassError] = useState('');
  const [passValidity, setPassValidity] = useState(false);
  const [error, setError] = useState('');

  const title = 'I understand that I will never be able to use this account*'
  const [isChecked, setIsChecked] = useState();
  const [show, setShow] = useState('my-hidden');



  const {reAuth, currentUser, logout, deleteAccnt} = useAuth();

  const handleSubmit= () => {
    if(passRef.current.value.length < 1){
      setPassValidity(true)
      return setPassError('Password is required')
    }else {
        setPassValidity(false)
        setPassError('')
    }

    if (!isChecked) {
      return setShow('')
    } else {
      setShow('my-hidden')
    }


    reAuth(passRef.current.value).then((result) => {
      deleteAccnt(currentUser).then((result) => {
        window.location.replace('/login')
      }).catch((err) => {
        console.log(err)
      });
    }).catch((err) => {
      console.log("login"+err);
        if(err.code.includes('auth/wrong-password')){
          setError('Password is incorrect')
        }
    })

    
  }

  const handleCheck = (event) => {
      setIsChecked(event.target.checked)     
  }


  return (
      <>
        <p id='medyo-bold' className='fs-2 m-0'>Delete Account</p>
        <p id='medyo-bold' className='fs-6 m-0'>Enter your password to confirm your identity</p>
        <hr className='mt-3 mb-3'/>
        {error && <Alert variant='danger'>{error}</Alert>}
        <Form className='col-lg-6' onSubmit={handleSubmit}>
            <Form.Group className='mb-2' id='password' controlId="formDelBasicPassword">
              <Form.Label>Password*</Form.Label>
              <Form.Control type='password' ref={passRef} required isInvalid={passValidity}></Form.Control>
              <Form.Control.Feedback type='invalid'>
                  {passError}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className='mb-2' id='password' controlId="formCheck">
              <Form.Check label={title} value={title} onChange={handleCheck}/>
              <div className='text-danger fs-6' id={show}>
                  You should check this before deleting your account
              </div>
            </Form.Group>
          </Form>
          <div className='d-flex flex-row justify-content-end'>
            <Button variant='danger' className='w-30 mt-4 fw-bold' type='button' onClick={handleSubmit}>Delete</Button>
          </div>
      </>
    )
}
