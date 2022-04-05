import React, {useRef, useEffect, useState} from 'react'
import { Form } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import Axios from 'axios';

export default function StundentInfo() {
    const {currentUser} = useAuth();

    const stud_number_ref = useRef();
    const first_name_ref = useRef();
    const mid_name_ref = useRef();
    const last_name_ref = useRef();
    const yr_lvl_ref = useRef();
    const sec_ref = useRef();

    useEffect(() => {
        console.log(currentUser.uid);
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
            }
        })
    }, [])


  return (
      <>
      <p id='medyo-bold' className='display-2'>Student Information</p>
      <hr className='mt-2 mb-3'/>
        <Form>
            <Form.Group className='mb-2' id='stud_number'>  
                <Form.Label>Student Number*</Form.Label>
                <Form.Control type='text' ref={stud_number_ref} required/>
            </Form.Group>
            <Form.Group className='mb-2' id='first_name'>  
                <Form.Label>First Name*</Form.Label>
                <Form.Control type='text' ref={first_name_ref} required/>
            </Form.Group>
            <Form.Group className='mb-2' id='mid_name'>  
                <Form.Label>Middle Name</Form.Label>
                <Form.Control type='text' ref={mid_name_ref}/>
            </Form.Group>
            <Form.Group className='mb-2' id='last_name'>  
                <Form.Label>Last Name*</Form.Label>
                <Form.Control type='text' ref={last_name_ref} required/>
            </Form.Group>
            <Form.Group className='mb-2' id='yr_lvl'>  
                <Form.Label>Year Level*</Form.Label>
                <Form.Control type='text' ref={yr_lvl_ref} required/>
            </Form.Group>
            <Form.Group className='mb-2' id='sect'>  
                <Form.Label>Section*</Form.Label>
                <Form.Control type='text' ref={sec_ref} required/>
            </Form.Group>
        </Form>          
      </>
  )
}
