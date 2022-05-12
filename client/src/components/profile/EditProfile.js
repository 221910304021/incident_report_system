import React, {useEffect, useState, useRef} from 'react'
import Axios from 'axios'
import { Form, Button } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import AccountView from './AccountView'
import Swal from 'sweetalert2';

export default function EditProfile({getFragment}) {
  const {currentUser} = useAuth();

    const stud_number_ref = useRef();
    const first_name_ref = useRef();
    const mid_name_ref = useRef();
    const last_name_ref = useRef();
    const yr_lvl_ref = useRef();
    const sec_ref = useRef();

    const [student_id, setStudent_id] = useState()
    const [loading, setLoading]= useState(false)

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

                setStudent_id(response.data[0]._id)
                
                setHasUserInfo(true)
            }
        })
    }, [])

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
                title: 'Account has been edited'
              }).then(() => {
                  window.location.reload()
                  setLoading(false)
              })
        )
      }

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

        setLoading(true)

        if (hasUserInfo){
            Axios.put("http://localhost:3001/update-student", {
            object_id: student_id,
            authID: currentUser.uid,
            student_number: stud_number_ref.current.value,
            first_name: first_name_ref.current.value,
            mid_name: mid_name_ref.current.value,
            last_name: last_name_ref.current.value,
            year_level: yr_lvl_ref.current.value,
            section: sec_ref.current.value,
            }).then((result) => {
                if (result) {
                    fire()
                }
            }).catch((err) => {
                
            });
        }
    }

    const handleCancel = () => {
        window.location.reload()
    }
  return (
    <>
      <p id='medyo-bold' className='fs-2 m-0'>Edit Profile</p>
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
                <Button variant='outline-secondary' className='w-30 mt-4 me-3 fw-bold' type='button' onClick={handleCancel}>Cancel</Button>
                <Button variant='success' className='w-30 mt-4 fw-bold' type='button' onClick={handleSubmit}>Save</Button>
            </div>
        </Form>          
    </>
  )
}
