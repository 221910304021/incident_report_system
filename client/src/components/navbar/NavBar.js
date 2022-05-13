import React, { useState, useEffect } from "react";
import './NavBar.css';
import { Button, ButtonGroup, Nav, Container, Navbar, Offcanvas, NavDropdown, Row, Col, Badge } from "react-bootstrap";
import { useAuth } from '../../contexts/AuthContext';
import {FaSchool, FaUserCircle, FaGem, FaTimes, FaBars} from 'react-icons/fa'
import {CgLogOut} from 'react-icons/cg'
import { ProSidebar, Menu, MenuItem, SidebarContent, SidebarHeader, SidebarFooter } from 'react-pro-sidebar';
import LogOutModal from "./LogOutModal";
import Swal from 'sweetalert2'

const NavBar = (props) => {

    const { currentUser, logout} = useAuth();
    const [modalShow, setModalShow] = useState(false);
    const [menuCollapsed, setMenuCollapsed] = useState(false)
    const [notifCount, setNotifCount] = useState(0)

    useEffect(() => {
        console.log(2);
        props.socket?.on(currentUser.uid, ({res}) => {
            console.log(res);
            setNotifCount(notifCount+1)
        })
      },[props.socket])

    if (currentUser === null) {
        return window.location.replace('/login')
    }

    return(
        <>
            {/* <ProSidebar collapsed={menuCollapsed} toggled={false} breakPoint="lg md">
            <SidebarHeader>
            <Menu iconShape="circle" className="p-0">
                {
                    menuCollapsed ?  <MenuItem className='toggle-btn ps-1 d-flex' onClick={()=>{setMenuCollapsed(false)}}><FaBars/></MenuItem>
                        : <MenuItem className='toggle-btn d-flex justify-content-end' onClick={()=>{setMenuCollapsed(true)}}><FaTimes/></MenuItem>
                }
                
                <MenuItem icon={<FaSchool />}><h6 className="text-truncate m-0" role='button' onClick={()=>{window.location.href = '/'}}> CICT Incident Report</h6></MenuItem>
            </Menu>
            <hr className='mt-3 mb-1'/>
            </SidebarHeader>
            <SidebarContent>
            <Menu iconShape="circle">
                <MenuItem  icon={<FaGem />} onClick={()=>{window.location.href='/file-report'}}>File a Report</MenuItem>
                <MenuItem icon={<FaUserCircle/>} onClick={()=>{window.location.href = '/profile'}}>My Profile</MenuItem>
                <MenuItem icon={<CgLogOut/>} onClick={()=>{setModalShow(true)}}>Logout</MenuItem>
            </Menu>
            </SidebarContent>
            <SidebarFooter>
            <hr className='mt-1 mb-3'/>

                <div className="p-3">
                    <h5 className="text-truncate">THIS IS FOOTER</h5>
                </div>
            </SidebarFooter>
            </ProSidebar> */}
            <Navbar bg="light" expand='lg' sticky="top">
                <Container fluid>
                    <Col xl='2' lg='2' xs='12'> 
                        <div className="d-flex justify-content-between">
                             <Navbar.Brand href="/" className="fs-2"> CICT Incident Report</Navbar.Brand>
                            <Navbar.Toggle className='float-right align-top' hidden={false} aria-controls="offcanvasNavbar" /> 
                        </div>
                    </Col>
                    <Col className="force-nav">
                        <Navbar.Collapse hidden={true} id="collapse" className="justify-content-between fs-5">
                            <Nav>
                                <Nav.Link href="/">Home</Nav.Link>
                                <Nav.Link href="/file-report">File A Report</Nav.Link>
                                <Nav.Link href="#">Announcements</Nav.Link>
                                <Nav.Link href="#">Notifications <Badge pill bg="danger" hidden={notifCount === 0}>{notifCount}</Badge> </Nav.Link>
                            </Nav>
                            <Nav> 
                                <Nav.Link href="/profile">My Profile</Nav.Link>
                                <Nav.Link onClick={()=>{setModalShow(true)}}>Logout</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Col>
                    <Navbar.Offcanvas
                    id="offcanvasNavbar"
                    aria-labelledby="offcanvasNavbarLabel"
                    placement="end"
                    >
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title id="offcanvasNavbarLabel">CICT Incident Report</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Nav>
                            <Nav.Link href="/">Home</Nav.Link>
                            <Nav.Link href="/file-report">File A Report</Nav.Link>
                            <Nav.Link href="#">Announcements</Nav.Link>
                            <Nav.Link href="#">Notifications</Nav.Link>
                            <hr className='mt-1 mb-3'/>
                            <Nav.Link href="/profile">My Profile</Nav.Link>
                            <Nav.Link onClick={()=>{setModalShow(true)}}>Logout</Nav.Link>
                        </Nav>
                    </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>
            <LogOutModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </>
        
    )
}

export default NavBar;