import React, {useState, useRef, useEffect} from 'react'
import {Form, Button} from 'react-bootstrap'
import Axios from 'axios'
import Swal from 'sweetalert2';


export default function RegisterInfo({submit2, getAccntInfo, getSubs}) {
    const first_name_ref = useRef();
    const last_name_ref = useRef();

    const [fname_error, setFnameErr] = useState();
    const [fname_validity, setFnameVal] = useState();

    const [lname_error, setlnameErr] = useState();
    const [lname_validity, setlnameVal] = useState();

    const submitBtnRef = useRef();

    useEffect(() => {
        if (submit2) {
          submitBtnRef.current.click();
        }

        getSubs()
    }, [submit2])

    const handleSubmit = () => {
        if (first_name_ref.current.value.length < 1){
            first_name_ref.current.focus()
            setFnameVal(true)
            return setFnameErr("First name is required")
        } else {
            setFnameVal(false)
            setFnameErr('')
        }
        if (last_name_ref.current.value.length < 1){
            last_name_ref.current.focus()
            setlnameVal(true)
            return setlnameErr("Last name is required")
        } else {
            setlnameVal(false)
            setlnameErr('')
        }

        getAccntInfo({
            first_name: first_name_ref.current.value,
            last_name: last_name_ref.current.value
        })

    }

  return (
    <>
      <p id='medyo-bold' className='fs-4 m-0'>Account Information</p>
      <hr className='my-2'/>
        <Form noValidate>
            <Form.Group className='mb-2' id='first_name'>  
                <Form.Label>First Name*</Form.Label>
                <Form.Control type='text' ref={first_name_ref} required isInvalid={fname_validity}/>
                <Form.Control.Feedback type="invalid">
                    {fname_error}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className='mb-2' id='last_name'>  
                <Form.Label>Last Name*</Form.Label>
                <Form.Control type='text' ref={last_name_ref} required isInvalid={lname_validity}/>
                <Form.Control.Feedback type="invalid">
                    {lname_error}
                </Form.Control.Feedback>
            </Form.Group>
            <Button variant='success' className='w-30 mt-4 fw-bold' ref={submitBtnRef} type='button' onClick={handleSubmit} hidden></Button>
        </Form>
    </>
  )
}
