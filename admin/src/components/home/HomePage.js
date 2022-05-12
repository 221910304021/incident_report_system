import React, { useState, useEffect } from 'react'
import SideBar from '../navs/SideBar'
import {Row, Col} from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext';


export default function HomePage() {
  
  const [menuState, setMenuState] = useState(false)
  const [reports, setReports] = useState([])

  const {currentUser} = useAuth();
  
  if (currentUser === undefined){
      return window.location.replace('/login');
  }

  const getMenuState = (state) => {
    setMenuState(state)
  }

  return (
        <>
          <Row className='p-0 m-0'>
            <Col className='p-0'>
              <SideBar/>
            </Col>
            <Col lg={10} xs={12} className='p-0'>
            </Col>
          </Row>
        </>

    )
}
