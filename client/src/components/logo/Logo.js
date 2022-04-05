import React, { Component, useState } from "react";
import './Logo.css';
import { Button } from "react-bootstrap";
import { useAuth } from '../../contexts/AuthContext';


const Logo = () => {

    const { currentUser, logout} = useAuth();
    const [hide, setHide] = useState(currentUser===null ? 'my-hidden' : '');

    async function handleLogout() {
        try {
            logout()
            window.location.replace('/login');
        } catch (error) {
            console.log(error);
        }
    }

    return(
        <div className="d-flex flex-row mt-2 ms-3">
            <h1 className="col-11">College of Information Communications Technology</h1>
            <div id={hide} className='col-1'>
                <Button variant='danger' className='w-30 fw-bold' type='button' onClick={handleLogout}>Log Out</Button>
            </div>
        </div>
    )
}

export default Logo;