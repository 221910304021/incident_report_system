import React, {useState, useRef} from 'react'
import { Modal, Button, Form } from "react-bootstrap";
import Axios  from 'axios';


export default function SetUpAccount(props) {

    const stud_number_ref = useRef();
    const first_name_ref = useRef();
    const mid_name_ref = useRef();
    const last_name_ref = useRef();
    const yr_lvl_ref = useRef();
    const sec_ref = useRef();

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

    const handleSubmit = () => {
        if (stud_number_ref.current.value.length < 1){
            stud_number_ref.current.focus()
            setStudentNumVal(true)
            return setStudentNumErr("Student number is required")
        } else {
            setStudentNumVal(false)
            setStudentNumErr('')
        }
        if (first_name_ref.current.value.length < 1){
            setFnameVal(true)
            first_name_ref.current.focus()
            return setFnameErr("First name is required")
        } else {
            setFnameVal(false)
            setFnameErr('')
        }
        if (last_name_ref.current.value.length < 1){
            last_name_ref.current.focus()
            setlnameVal(true)
            return setlnameErr("Student number is required")
        } else {
            setlnameVal(false)
            setlnameErr('')
        }
        if (yr_lvl_ref.current.value.length < 1){
            yr_lvl_ref.current.focus()
            setyrlvlVal(true)
            return setyrlvlErr("Student number is required")
        } else {
            setyrlvlVal(false)
            setyrlvlErr('')
        }
        if (sec_ref.current.value.length < 1){
            sec_ref.current.focus()
            setsecVal(true)
            return setsecErr("Student number is required")
        } else {
            setsecVal(false)
            setsecErr('')
        }

        Axios.post("http://localhost:3001/save-student", {
            authID: props.currentUser.uid,
            student_number: stud_number_ref.current.value,
            first_name: first_name_ref.current.value,
            mid_name: mid_name_ref.current.value,
            last_name: last_name_ref.current.value,
            year_level: yr_lvl_ref.current.value,
            section: sec_ref.current.value,
            photoUrl: 'https://firebasestorage.googleapis.com/v0/b/ojt-incident-report-system-dev.appspot.com/o/default-dp%2Fdefault.png?alt=media&token=7c71ba77-d746-49e2-967d-1f2cf0ad7e6a',
            }).then(()=>{
                props.onHide()
            });

    }
    const handleKeyDown = (e) => {
        if (e.keyCode >= 65 && e.keyCode <= 90) {
            e.preventDefault();
            return false
        }
    }

    const sectionItem = String.fromCharCode(...Array(123).keys()).slice(97).toUpperCase().split('');

    return (
        <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          className="mt-5"
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
                <p id='medyo-bold' className='fs-1 m-0'>Welcome!</p>
                <p className='fs-6 m-0 ms-3'>You need to fill up the following student information</p>
                <p className='fs-6 m-0 ms-3'>This will help to identify and process your reports faster</p>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body >
          <p className='fs-6 m-0'>Field with asterisk " * " is required.</p>

          <Form noValidate>
            <Form.Group className='mb-2' id='stud_number'>  
                <Form.Label>Student Number*</Form.Label>
                <Form.Control min={0} type='text' onKeyDown={handleKeyDown} maxLength={10} ref={stud_number_ref} required isInvalid={stud_number_validity}/>
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
                <Form.Select ref={yr_lvl_ref} required isInvalid={yrlvl_validity}>
                    <option value='' key={-1}>Select Year Level</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                    {yrlvl_error}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className='mb-2' id='sect'>  
                <Form.Label>Section*</Form.Label>
                <Form.Select ref={sec_ref} required isInvalid={sec_validity} >
                    <option value='' key={-1}>Select Section</option>   
                    {
                        sectionItem.map((value) => {
                            return (
                                <option key={value} value={value}>{value}</option>
                            )
                        })
                    }
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                    {sec_error}
                </Form.Control.Feedback>
            </Form.Group>  
            </Form>  
          
          </Modal.Body>

          <Modal.Footer>
            <div className='d-flex flex-row justify-content-end'>
                    <Button variant='success' className='w-30 fw-bold' type='button' onClick={handleSubmit}>Save</Button>
                </div>
          </Modal.Footer>
        </Modal>
      );
}
