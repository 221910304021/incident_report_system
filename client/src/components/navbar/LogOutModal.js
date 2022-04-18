import React from 'react'
import { Modal, Button } from "react-bootstrap";
import { useAuth } from '../../contexts/AuthContext';

export default function LogOutModal(props) {
    const {logout} = useAuth();

    if (props === undefined) {
        return null
    }

    async function handleLogout() {
        try {
            logout()
            window.location.replace('/login');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Modal
          {...props}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
                Logging out
            </Modal.Title>
          </Modal.Header>
          <Modal.Body >
                Are you sure you want to logout?
          </Modal.Body>
           
          <Modal.Footer>
            <Button variant='outline-danger' onClick={handleLogout}>Logout</Button>
            <Button variant='secondary' onClick={props.onHide}>Cancel</Button>
          </Modal.Footer>
        </Modal>
      );
}
