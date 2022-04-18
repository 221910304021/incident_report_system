import React, {useState, useRef} from 'react'
import { Col, Row, Image, Button, Overlay, Popover } from 'react-bootstrap'
import EditProfile from './EditProfile'
import UploadImage from './UploadImage'
import { useAuth } from '../../contexts/AuthContext'


export default function AccountView({studentInfo, getFragment}) {
  
  const {currentUser} = useAuth()

  const [show, setShow] = useState(false);
  const [target, setTarget] = useState(null);
  const ref = useRef(null);

  const edit = () => {
    getFragment(<EditProfile/>)
  }

  const dp = () => {
    getFragment(<UploadImage/>)

  }

  const popOver = (event) => {
    setShow(!show);
    setTarget(event.target);
    
  }
  return (
      <>  
        <div ref={ref}>
          <Overlay
            show={show}
            target={target}
            placement="bottom"
            container={ref}
            containerPadding={20}
            >
            <Popover id="popover-contained">
              <Popover.Header as="h3">Edit Account</Popover.Header>
              <Popover.Body>
                <Button className='w-100 mb-2' onClick={edit}>Information</Button>
                <Button className='w-100' onClick={dp}>Display Picture</Button>
              </Popover.Body>
            </Popover>
          </Overlay>
        </div>
        <div className='d-flex justify-content-between ps-2 pe-2'>
          <p id='medyo-bold' className='fs-2 m-0'>Account View</p>
          <Button variant='outline-primary' onClick={popOver}>Edit</Button>
        </div>
        <hr className='mt-3 mb-3'/>
        <Row className='justify-content-center'>
          <Col xl='2' md='3'  xs='5'>
            <img className='img-thumbnail rounded-circle my-image' src={studentInfo.photoUrl}/>
          </Col>
          <Col xl='10' md='9' xs='7' className='mt-auto mb-auto'>
              <p className='fs-3 m-0'>{studentInfo.first_name} {studentInfo.mid_name} {studentInfo.last_name}</p>
              <p className='fs-5 m-0'>{studentInfo.student_number}</p>
              <p className='fs-5 m-0'>{studentInfo.year_level} - {studentInfo.section}</p>
          </Col>
        </Row>
      </>
   
  )
}
