import React, { useRef, useState } from 'react'
import { Card, Button, Col, Container, Tabs, Tab, Row } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import NavBar from '../navbar/NavBar';
import './MainForm.css'
import IncidentReport from './IncidentReport';
import StundentInfo from './StundentInfo';




export default function MainForm() {
    const {currentUser} = useAuth();
    const [key, setKey] = useState('info');

    const getForm = (param) => {
        if (param === 'student') {
            setKey('report')
        } else {
            setKey('info')

        }
    }
    
    const [form, setForm] = useState(<StundentInfo getForm={getForm}/>);
    const reportBtnRef = useRef();
    const studentBtnRef = useRef();


    if (currentUser === null) {
        return window.location.replace('/login');
    }

  return (
      <>
      <NavBar/>
      <Container>
            <Col className='mt-5 p-0' >
                <Tabs
                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className="mb-2 my-tablist"
                    >
                    <Tab eventKey="info" title="Student Information">
                        <Card className='p-3'>
                            <StundentInfo getForm={getForm}/>
                        </Card>
                    </Tab>
                    <Tab eventKey="report" title="Report an Incident">
                        <Card className='p-3'>
                            <IncidentReport getForm={getForm}/>
                        </Card>
                    </Tab>
                </Tabs>
            </Col>
        </Container>
      </>
  )
}
