import React, {useRef, useEffect, useState} from 'react'
import { Form, Button } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import Axios from 'axios';

export default function StundentInfo({getForm}) {
    const {currentUser} = useAuth();

    const stud_number_ref = useRef();
    const first_name_ref = useRef();
    const mid_name_ref = useRef();
    const last_name_ref = useRef();
    const yr_lvl_ref = useRef();
    const sec_ref = useRef();

    const [hasUserInfo, setHasUserInfo] = useState(false);

    const [stud_number_error, setStudentNumErr] = useState();
    const [stud_number_validity, setStudentNumVal] = useState();

    const [fname_error, setFnameErr] = useState();
    const [fname_validity, setFnameVal] = useState();

    const [lname_error, setlnameErr] = useState();
    const [lname_validity, setlnameVal] = useState();
    
    const [yrlvl_error, setyrlvlErr] = useState();
    const [yrlvl_validity, setyrlvlVal] = useState();

    const [sec_error, setsecErr] = useState();
    const [sec_validity, setsecVal] = useState();

    useEffect(() => {
        Axios.post('http://localhost:3001/student', {
            authID: currentUser.uid,
        }).then((response) => {
            console.log(response);
            if (response.data.length > 0){
                stud_number_ref.current.value = response.data[0].student_number;
                first_name_ref.current.value = response.data[0].first_name;
                mid_name_ref.current.value = response.data[0].mid_name;
                last_name_ref.current.value = response.data[0].last_name;
                yr_lvl_ref.current.value = response.data[0].year_level;
                sec_ref.current.value = response.data[0].section;
                setHasUserInfo(true)
            }
        })
    }, [])

    const handleSubmit = () => {
        if (stud_number_ref.current.value.length < 1){
            setStudentNumVal(true)
            return setStudentNumErr("Student number is required")
        } else {
            setStudentNumVal(false)
            setStudentNumErr('')
        }
        if (first_name_ref.current.value.length < 1){
            setFnameVal(true)
            return setFnameErr("First name is required")
        } else {
            setFnameVal(false)
            setFnameErr('')
        }
        if (last_name_ref.current.value.length < 1){
            setlnameVal(true)
            return setlnameErr("Student number is required")
        } else {
            setlnameVal(false)
            setlnameErr('')
        }
        if (yr_lvl_ref.current.value.length < 1){
            setyrlvlVal(true)
            return setyrlvlErr("Student number is required")
        } else {
            setyrlvlVal(false)
            setyrlvlErr('')
        }
        if (sec_ref.current.value.length < 1){
            setsecVal(true)
            return setsecErr("Student number is required")
        } else {
            setsecVal(false)
            setsecErr('')
        }

        if (!hasUserInfo){
            Axios.post("http://localhost:3001/save-student", {
            authID: currentUser.uid,
            student_number: stud_number_ref.current.value,
            first_name: first_name_ref.current.value,
            mid_name: mid_name_ref.current.value,
            last_name: last_name_ref.current.value,
            year_level: yr_lvl_ref.current.value,
            section: sec_ref.current.value,
            });
        }
        getForm('student')
    }


  return (
      <>
      <p id='medyo-bold' className='fs-1 m-0'>Student Information</p>
      <p className='m-0'>Please fill up the following information.</p>
      <p className='m-0'>Field with asterisk " * " is required.</p>
      <hr className='mt-3 mb-3'/>
        <Form noValidate>
            <Form.Group className='mb-2' id='stud_number'>  
                <Form.Label>Student Number*</Form.Label>
                <Form.Control type='text' ref={stud_number_ref} required isInvalid={stud_number_validity}/>
                <Form.Control.Feedback type="invalid">
                    {stud_number_error}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className='mb-2' id='first_name'>  
                <Form.Label>First Name*</Form.Label>
                <Form.Control type='text' ref={first_name_ref} required isInvalid={fname_validity}/>
                <Form.Control.Feedback type="invalid">
                    {fname_error}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className='mb-2' id='mid_name'>  
                <Form.Label>Middle Name</Form.Label>
                <Form.Control type='text' ref={mid_name_ref}/>
            </Form.Group>
            <Form.Group className='mb-2' id='last_name'>  
                <Form.Label>Last Name*</Form.Label>
                <Form.Control type='text' ref={last_name_ref} required isInvalid={lname_validity}/>
                <Form.Control.Feedback type="invalid">
                    {lname_error}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className='mb-2' id='yr_lvl'>  
                <Form.Label>Year Level*</Form.Label>
                <Form.Control type='text' ref={yr_lvl_ref} required isInvalid={yrlvl_validity}/>
                <Form.Control.Feedback type="invalid">
                    {yrlvl_error}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className='mb-2' id='sect'>  
                <Form.Label>Section*</Form.Label>
                <Form.Control type='text' ref={sec_ref} required isInvalid={sec_validity} />
                <Form.Control.Feedback type="invalid">
                    {sec_error}
                </Form.Control.Feedback>
            </Form.Group>
            <div className='d-flex flex-row justify-content-end'>
                <Button variant='primary' className='w-30 mt-4 fw-bold' type='button' onClick={handleSubmit}>Next</Button>
            </div>
        </Form>          
      </>
  )
}
