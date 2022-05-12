import React, { useRef, useState, useEffect } from 'react'
import { Card, Button, Col, Container, Tabs, Tab, Row } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import NavBar from '../navbar/NavBar';
import './MainForm.css'
import IncidentReport from './IncidentReport';
import AccountView from '../profile/AccountView'
import Axios from 'axios'



export default function MainForm() {
    const {currentUser} = useAuth();
    const [key, setKey] = useState('info');
    const [studentInfo, setStudentInfo] = useState()

    const [fragment, setFragment] = useState()

    const getForm = (param) => {
        if (param === 'student') {
            setKey('report')
        } else {
            setKey('info')

        }
    }

    const getFragment = (edit) => {
        setFragment(edit)
    }
    
    const reportBtnRef = useRef();
    const studentBtnRef = useRef();

    useEffect(() => {
        Axios.post('http://localhost:3001/student', {
            authID: currentUser.uid,
        }).then((response) => {
            console.log(response);
            if (response.data.length > 0){
                setStudentInfo(response.data[0])
                setFragment(<AccountView getFragment={getFragment} studentInfo={response.data[0]} parent={'incidentReport'}/>)
            }
        })
    }, [currentUser])


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
                    <Tab eventKey="info" key="info" title="Student Information">
                        <Card className='p-3'>
                            {fragment}
                        </Card>
                    </Tab>
                    <Tab key={'report'} eventKey="report" title="Report an Incident">
                        <Card className='p-3 mb-5'>
                            <IncidentReport studentInfo={studentInfo}/>
                        </Card>
                    </Tab>
                </Tabs>
            </Col>
        </Container>
      </>
  )
}
