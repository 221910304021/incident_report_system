import React, {useEffect, useState} from 'react'
import { Card, Button, ButtonGroup, Col, Container, Row } from 'react-bootstrap'
import { useAuth } from '../../contexts/AuthContext'
import NavBar from '../navbar/NavBar'
import Axios from 'axios'
import './Dashboard.css'
import MyModal from './MyModal'
import {GoPlus} from 'react-icons/go'
import SetUpAccount from './SetUpAccount'

export default function Dashboard() {

    const {currentUser} = useAuth();
    const [hasReports, setHasReports] = useState(false)
    const [modalShow, setModalShow] = useState(false);
    const [showReply, setShowReply] = useState(false)
    const [accountShow, setAccountShow] = useState(false);

    const [reports, setReports] = useState([])
    const [oneReport, setOneReport] = useState()

    useEffect(() => {
        Axios.post('http://localhost:3001/student', {
            authID: currentUser.uid,
            }).then((response) => {
                if (response.data.length > 0){
                    Axios.post('http://localhost:3001/get-reports', {
                        student_id: currentUser.uid,
                    }).then((response) => {
                        if (response.data.length > 0){
                            setHasReports(true)
                            setReports(response.data)
                        }
                    })
                } else {
                    console.log( 'else');
                    setAccountShow(true)
                }
            })
        
    }, [currentUser])

    if(currentUser===null){
        return window.location.replace('/login')
    }

    const viewReport = (report_id) => {
        Axios.post('http://localhost:3001/get-report', {
            report_id: report_id,
            }).then((response) => {
                setOneReport(response.data[0])
                setShowReply(false)
                setModalShow(true)
            })
    }

    const closeReport = (report_id) => {
        Axios.post('http://localhost:3001/close-report', {
            report_id: report_id,
            }).then((response) => {
                Axios.post('http://localhost:3001/get-reports', {
                student_id: currentUser.uid,
                }).then((response) => {
                    console.log(response);
                    if (response.data.length > 0){
                        setHasReports(true)
                        setReports(response.data)
                    }
                })
        })

    
    }

    const reply = (report_id) => {
        Axios.post('http://localhost:3001/get-report', {
            report_id: report_id,
            }).then((response) => {
                setOneReport(response.data[0])
                setShowReply(true)
                setModalShow(true)
            })
        
    }
    const addCards = reports.map((report, index) => {
       return(
        <Col lg={4} md={6} key={index}>
            <Card className='m-2 shadow-sm my-card' >
                <Card.Body>
                    <Card.Title className='text-truncate'>
                        {report.incident_type}
                    </Card.Title>
                    <Card.Text className='h6'>
                        {report.date} | {report.time}<br/>

                    </Card.Text>
                    {report.isActive ?  <div className='my-descrip active-report'/> :
                         <div className='my-descrip closed-report'/> }
                   
                </Card.Body>
                <ButtonGroup aria-label="">
                    <Button variant="light" onClick={()=>{
                        closeReport(report._id)
                    }}>Close</Button>
                    <Button variant="light" onClick={()=>{
                        viewReport(report._id)
                    }}>View</Button>
                    <Button variant="light" onClick={()=>{reply(report._id)}}>Reply</Button>
                </ButtonGroup>
            </Card> 
        </Col>
       )
    }).reverse()

    const fileReport = () => {
        window.location.href = '/file-report';
    }
  return (
    <>
    <NavBar/>
        <Container>
            <Col className='mt-5 mb-5'>
                    <Col lg={3} md={4} xs={7}>
                            <Card className='m-2 shadow-sm' role='button' onClick={fileReport}>
                                <Card.Body>
                                    <Card.Title>
                                        File new report <GoPlus/>
                                    </Card.Title>
                                </Card.Body>
                            </Card> 
                    </Col>
                    <div className='d-flex row'>
                    <p className='ps-3 mt-4 me-0 h5'>Filed Report </p>
                        {
                            addCards.length === 0 ?
                            <Col lg={4} md={6}>
                                <Card className='m-2 shadow-sm' >
                                    <Card.Body>
                                        <Card.Title className='text-truncate'>
                                            No reports available :(
                                        </Card.Title>
                                        <Card.Text className='h6'>

                                        </Card.Text>
                    
                                    </Card.Body>
                                </Card> 
                            </Col> :
                            addCards
                        }
                    </div>
            </Col>        
        </Container>
        <SetUpAccount 
            show={accountShow}
            onHide={() => setAccountShow(false)}
            currentUser={currentUser}/>

        <MyModal
            show={modalShow}
            showReply={showReply}
            onHide={() => {setModalShow(false)}}
            report={oneReport}
        />
       
    </>
  )
}
