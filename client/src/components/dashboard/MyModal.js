import React, { useRef, useState, useEffect } from "react";
import { Modal, Button, Card, FormControl } from "react-bootstrap";
import TextEditor from "../reportfFilingForm/TextEditor";

export default function MyModal(props) {
    const replyRef = useRef()
    
    console.log(props.showReply);
    
    if (props.report === undefined) {
        return null
    }

    return (
        <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          className="mb-5"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
                {props.report.incident_type}
                <div className='h6'>
                    {props.report.date} | {props.report.time}<br/>
                </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body >
                <div className='my-descrip-lg'>
                    <div dangerouslySetInnerHTML={{ __html: props.report.description }} />
                </div>
                <hr className='mt-3 mb-3'/>
                <Card>
                  <FormControl as={'textarea'} autoFocus={props.showReply} placeholder='Write a Reply...' ref={replyRef} rows={1}/>
                </Card>
          </Modal.Body>
           
          <Modal.Footer>
            <Button onClick={props.onHide}>Close</Button>
          </Modal.Footer>
        </Modal>
      );

  }