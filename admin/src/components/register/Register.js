import React, {useRef, useState, useEffect} from 'react'
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import { Modal, Button, Alert, Form, Container, Card } from 'react-bootstrap';
import Axios from 'axios'
import RegisterBody from './RegisterBody';
import RegisterInfo from './RegisterInfo';

export default function Register(props) {
  const [submit, setSubmit] = useState(false)
  const [submit_a, setSubmit_a] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loginInfo, setLoginInfo] = useState({})
  const [accntInfo, setAccntInfo] = useState({});

  const [page, setPage] = useState(1)

  useEffect(() => {
    if (props.show===false) {
      setPage(1)
      setLoginInfo({})
    }
  }, [props.show])

  useEffect(() => {
    if (Object.keys(accntInfo).length >0) {
      handleSubmit()
    }
  }, [accntInfo])

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
            title: 'Evaluator has been added!'
          }).then(() => {
            setLoading(false)
            props.onHide()
          })
    )
  }
  
  const getSubmit = (param) => {
      setLoading(false)
      setSubmit(false)
  }

  const getSubs = () => {
    setSubmit_a(false)
  }

  const getLoginInfo = (info) => {
    setLoginInfo(info)
    console.log(info);
    setPage(2)
  }

  const getAccntInfo = (info) => {
    setAccntInfo(info)
  }

  const handleNext = () => {
    setSubmit(true)
  }

  const handleClick = () => {
    setSubmit_a(true)
  }

  const handleSubmit = () => {
    setLoading(true)
    Axios.post('http://localhost:3001/create-evaulator', {
      email: loginInfo.email,
      password: loginInfo.password
    }).then((response) => {
      if(JSON.stringify(response.data).includes('uid')){
          Axios.post('http://localhost:3001/save-evaluator', {
            authID : response.data.uid,
            first_name: accntInfo.first_name,
            last_name: accntInfo.last_name,
          }).then(() => {
            Axios.post('http://localhost:3001/save-username', {
              username: loginInfo.username,
              email: loginInfo.email,
            }).then(() => {
              fire()
            })
          })
      }
    }).catch((error) => {
        console.log(error.response.data);
    })
  }

  return (
    <>
    <Modal
    {...props}
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    className="mt-5">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
            <p id='fw-bold' className='fs-1 m-0'>Add an Evaluator</p>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {
          page === 1 ? <RegisterBody getSubmit={getSubmit} submit={submit} savedLoginInfo={loginInfo} getLoginInfo={getLoginInfo}/> :
          <RegisterInfo submit2={submit_a} getAccntInfo={getAccntInfo} getSubs={getSubs}/>
        }
      </Modal.Body>
      <Modal.Footer className='d-flex justify-content-between p-3'>
          {/* <Button variant='outline-secondary' className='fw-bold' onClick={props.onHide}>Cancel</Button>
          <Button variant='success' className='fw-bold' disabled={loading} onClick={handleClick}>Add Evaluator</Button> */}
          {
            page === 1 
            ? 
            <>
             <Button variant='outline-secondary' className='fw-bold' onClick={props.onHide}>Cancel</Button>
             <Button variant='outline-primary' className='fw-bold' disabled={loading} onClick={handleNext}>Next</Button>
            </>
            :
           <>
            <Button variant='outline-primary' className='fw-bold' onClick={()=>{setPage(1)}}>Prev</Button>
            <Button variant='success' className='fw-bold' disabled={loading} onClick={handleClick}>Add Evaluator</Button>
           </>
          }
          
      </Modal.Footer>
    </Modal>
    </>
  )
}
