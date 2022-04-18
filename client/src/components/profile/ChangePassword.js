import React, {useRef, useState} from 'react'
import { Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';

export default function ChangePassword() {

    const passRef = useRef();
    const newPassRef = useRef();
    const conPassRef = useRef();

    const [newPassError, setNewPassError] = useState('');
    const [passError, setPassError] = useState('');
    const [conpassError, setconPassError] = useState('');

    const [newPassValidiity, setnewPassValidiity] = useState(false);
    const [passValidity, setPassValidity] = useState(false);
    const [conPassValidity, setconPassValidity] = useState(false);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const {reAuth, currentUser, changePass, logout} = useAuth();
    
    const handleSubmit = () => {

      if(passRef.current.value.length < 1){
          setPassValidity(true)
          return setPassError('Password is required')
      }else {
          setPassValidity(false)
          setPassError('')
      }

      if(newPassRef.current.value.length < 1){
        setnewPassValidiity(true)
        return setNewPassError('New password is required')
      }else {
        setnewPassValidiity(false)
        setPassError('')
      }

      if(conPassRef.current.value.length < 1){
          setconPassValidity(true)
          return setconPassError('Confirmation password is required')
      }else {
          setconPassValidity(false)
          setconPassError('')
      }

      if (newPassRef.current.value !== conPassRef.current.value){
          setconPassValidity(true)
          conPassRef.current.value = ''
          setconPassError('')
          return setError('Password do not match')
      }

      reAuth(passRef.current.value).then((result) => {
        changePass(currentUser, newPassRef.current.value).then((response)=>{
            logout().then((result) => {
              window.location.replace('/login')
            })
         }).catch((err) => {
           console.log(err);
         })
      }).catch((err) => {
        console.log("login"+err);
        if(err.code.includes('auth/wrong-password')){
          setError('Password is incorrect')
        }
      });
      
    }

    const matchPassValidation =  (e) => {
      let passLen = newPassRef.current.value.length
     if( passLen < 8  ){
         setnewPassValidiity(true)
         setNewPassError('Password must be more than 8 characters')
     } else{
         setnewPassValidiity(false)
     }
  }
  return (
    <>
     <p id='medyo-bold' className='fs-2 m-0'>Change Password</p>
      <hr className='mt-3 mb-3'/>
      {error && <Alert variant='danger'>{error}</Alert>}
      <Form className='col-lg-6' onSubmit={handleSubmit}>
          <Form.Group className='mb-2' id='password' controlId="formBasicPassword">
            <Form.Label>Password*</Form.Label>
            <Form.Control type='password' ref={passRef} required isInvalid={passValidity}></Form.Control>
            <Form.Control.Feedback type='invalid'>
                {passError}
            </Form.Control.Feedback>
        </Form.Group>
          <Form.Group className='mb-2' id='newpassword' controlId="formBasiNewcPassword" onChange={matchPassValidation}>
            <Form.Label>New Password*</Form.Label>
            <Form.Control type='password' ref={newPassRef} required isInvalid={newPassValidiity}></Form.Control>
            <Form.Control.Feedback type='invalid'>
                {newPassError}
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
      <div className='d-flex flex-row justify-content-end'>
          <Button variant='success' className='w-30 mt-4 fw-bold' type='button' onClick={handleSubmit}>Save</Button>
      </div>
    </>
  )
}
