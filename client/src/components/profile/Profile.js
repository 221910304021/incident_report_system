import React, { useState, useEffect } from 'react'
import { Card, Col, Container, Button, Row, Tabs, Tab } from 'react-bootstrap'
import NavBar from '../navbar/NavBar'
import './Profile.css'
import ChangePassword from './ChangePassword'
import DeleteAccount from './DeleteAccount'
import AccountView from './AccountView'
import { useAuth } from '../../contexts/AuthContext'
import Axios from 'axios'


export default function Profile() {

    const {currentUser} = useAuth();
    const [fragment, setFragment] = useState();
    const [studentInfo, setStudentInfo] = useState();
    const [key, setKey] = useState('view');

    
    useEffect(() => {
        Axios.post('http://localhost:3001/student', {
            authID: currentUser.uid,
        }).then((response) => {
            console.log(response);
            if (response.data.length > 0){
                setStudentInfo(response.data[0])
                setFragment(<AccountView studentInfo={response.data[0]}  getFragment={getFragment}/>)
            }   
        })
    }, [currentUser])

    const getFragment = (edit) => {
        setFragment(edit)
    }

    if(currentUser===null){
        return window.location.replace('/login')
    }

  return (
        <>
        <NavBar/>
            <Container>
                <Col className='mt-5 mb-5' >
                    <Tabs
                        id="controlled-tab-example"
                        activeKey={key}
                        onSelect={(k) => setKey(k)}
                        className="mb-2 my-tablist"
                        >
                        <Tab eventKey="view" title="Account View">
                            <Card className='p-3'>
                                {fragment}
                            </Card>
                        </Tab>
                        <Tab eventKey="changePass" title="Change Password">
                            <Card className='p-3'>
                                <ChangePassword/>
                            </Card>
                        </Tab>
                        <Tab eventKey="delete" title="Delete Account">
                            <Card className='p-3'>
                                <DeleteAccount/>
                        </Card>
                        </Tab>
                    </Tabs>
                </Col>
            </Container>
        </>
    )
}
