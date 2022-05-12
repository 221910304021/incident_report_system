import React from 'react'
import { Navbar, Nav, Button } from 'react-bootstrap'
import { FaBars } from 'react-icons/fa'
 
export default function NavBar({getCollapsed, collapsed}) {

  return (
    <Navbar bg="light" variant="light" sticky='top' className='ps-2 my-navbar'>
        <Button variant='outlined-light' onClick={()=>{getCollapsed(!collapsed)}}> <FaBars size={22}/> </Button>
        <Navbar.Brand className='fs-4'>CICT Incident Report</Navbar.Brand>
    </Navbar>
  )
}
