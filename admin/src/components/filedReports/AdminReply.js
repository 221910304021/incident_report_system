import React, { useEffect, useState } from "react";
import { Modal} from "react-bootstrap";
import DisplayReply from "./DisplayReply";
import Displaybody from "./Displaybody";
import Displayevaluation from "./Displayevaluation";
import SendReply from "./SendReply";


export default function AdminReply(props) {
    

    if (props.report === undefined) {
        return null
    }

    return (
        <Modal
          {...props}
          size="xl"
          aria-labelledby="contained-modal-title-vcenter"
          className="mb-5"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter" className="text-truncate">
                {props.report.incident_type}
                <div className='d-flex col align-items-center'>
                  <img src={props.report.student_info.photoUrl} width={60} className='img-thumbnail rounded-circle me-3' />
                  <div>
                    <div className='fs-5'>  {props.report.student_info.first_name} {props.report.student_info.mid_name} {props.report.student_info.last_name} </div>
                    <div className='fs-6'>Year Level: {props.report.student_info.year_level} | Section: {props.report.student_info.section}</div>
                  </div>
                  </div>
                  <div className='fs-6 mt-1 m-0'>  {props.report.date} | {props.report.time}</div>

            </Modal.Title>
          </Modal.Header>
          <Modal.Body >
              <Displaybody primary_description={props.report.primary_description} description={props.report.description}/>
              <Displayevaluation evaluation= {props.report.evaluation} />
              <DisplayReply socket={props.socket} replies={props.report.replies} showreply={props.showreply}/>
          </Modal.Body>
          
          <SendReply socket={props.socket} show={props.show} showreply={props.showreply} report={props.report} onHide={props.onHide}/>
          
        </Modal>
      );

  }