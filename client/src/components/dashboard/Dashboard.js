import React, { useEffect, useRef } from 'react'
import { Card, Button, Form } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import StundentInfo from '../multistep-form/StundentInfo';
import Logo from '../logo/Logo';
import IncidentReport from '../multistep-form/IncidentReport';
import Axios from 'axios';


export default function Dashboard() {
    const {currentUser} = useAuth();

    let form = <StundentInfo/>;


    if (currentUser === null) {
        return window.location.replace('/login');
    }

    // const save = () => {
    //     Axios.post("http://localhost:3001/save-student", {
    //         authID: currentUser.uid,
    //         student_number: stud_number_ref.current.value,
    //         first_name: first_name_ref.current.value,
    //         mid_name: mid_name_ref.current.value,
    //         last_name: last_name_ref.current.value,
    //         year_level: yr_lvl_ref.current.value,
    //         section: sec_ref.current.value,
    //     })
    // }    

    
  return (
      <>
        <Logo/>
        <div className='d-flex mt-5 justify-content-center regs-form-container'>
            <div className='col-8'>
                <Card className='shadow-sm'>
                    <Card.Body>
                        {form}
                        <IncidentReport/>
                        <Button variant='primary' className='w-30 mt-4 btn-success fw-bold' type='button'>Submit</Button>
                    </Card.Body>
                </Card>
            </div>
        </div>
      </>
  )
}
