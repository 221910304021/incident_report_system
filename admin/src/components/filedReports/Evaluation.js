import React, {useState, useEffect} from 'react'
import { Row, Col, Container, Card, Button, ListGroup } from 'react-bootstrap'
import { useParams } from 'react-router-dom';
import SideBar from '../navs/SideBar'
import Form from './Form';
import Axios from 'axios'
import draftToHtml from 'draftjs-to-html';
import { useAuth } from '../../context/AuthContext';
import NavBar from '../navs/Navbar';
import Swal from 'sweetalert2';

export default function Evaluation() {
  const [key, setKey] = useState('report');
  const [report, setReport] = useState()
  const [fragment, setFragment] = useState()
  const [content, setContent] = useState()
  const [collapsed, setCollapsed] = useState(false)
  const [hidden, setHidden] = useState(true)
  const [border, setBorder] = useState('')
  const [loading, setLoading] = useState(false)


  let {report_id} = useParams()
  const {currentUser} = useAuth();

  const getContent = (param) => {
    setContent(param)
  }

  const getCollapsed = (param) => {
    setCollapsed(param)
  }

  useEffect(() => {
    Axios.post('http://localhost:3001/get-report', {
        report_id: report_id,
        }).then((response) => {
            if (response.status === 200) {
                  setReport(response.data[0])
                  setFragment(
                  <Container fluid className='mt-3'>
                  <p className='fs-2 fw-bold m-0 mb-1'>{response.data[0].incident_type}</p>
                  <Card className='p-3'>
                    <Card.Title>
                      <div className='d-flex col'>
                        <img src={response.data[0].student_info.photoUrl} width={60} className='img-thumbnail rounded-circle me-3' />
                      <div>
                      <div className='fs-5'>  
                        {response.data[0].student_info.first_name} {response.data[0].student_info.mid_name} {response.data[0].student_info.last_name} 
                      </div>
                      <div className='fs-6'>Year Level: {response.data[0].student_info.year_level} | Section: {response.data[0].student_info.section}</div>
                      </div>
                    </div>
                    <div className='fs-6'>  {response.data[0].date} | {response.data[0].time}</div>
                    </Card.Title>
                  <div className='my-descrip-lg my-report mt-3'>
                  <div>
                    <p className="fs-5 fw-bold m-0 my-2">{response.data[0].primary_description.header}</p>
                    {
                      response.data[0].primary_description.body  ? (
                        <ListGroup className="mb-4 mx-3" as={'ol'} numbered>
                          {
                            response.data[0].primary_description.body.map((object, index) => {
                              return (
                                <ListGroup.Item as={'li'}  key={index}>
                                {object}
                              </ListGroup.Item>
                              )
                            })
                          }
                        </ListGroup>
                      ) : 
                      ''
                    }
                    </div>
                      <div dangerouslySetInnerHTML={{ __html: response.data[0].description }} />
                    </div>
                  </Card>
                  </Container>
                )
            }
        }).catch((error) => {
          console.log(error);
        })
  }, [])

  useEffect(() => {
    Axios.post('http://localhost:3001/get-evaluator', {
      authID: currentUser.uid,
    }).then((response) => {
      Axios.post('http://localhost:3001/select-report', {
        report_id: report_id,
        evaluator_info: response.data[0],
      })
    })
  }, [])

  if (currentUser === undefined){
    return window.location.replace('/login');
  }

  const handleCancel = () => {
    window.location.href = '/filed-reports';
  }
  console.log(content);
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  const fire = () => {
    return(
        Toast.fire({
            icon: 'success',
            title: 'Resolution submitted'
          }).then(() => {
              window.location.href = '/filed-reports'
              setLoading(false)
          })
    )
  }

  const handleSubmit = () => {
    setLoading(true)
    if(content === undefined){
      setHidden(false)
      setLoading(false)

      return setBorder('border-danger');
    } else if (content.blocks.length === 1 && content.blocks[0].text === ''){
      setHidden(false)
      setLoading(false)
      return setBorder('border-danger');
    } else {
      setHidden(true)
      setBorder('');
    }

    Axios.post('http://localhost:3001/add-resolution', {
        report_id: report_id,
        resolution: draftToHtml(content),
      }).then(() => {
        fire()
      })

    console.log({ report_id: report_id,
          resolution: draftToHtml(content)});
  }
  
  return (
    <>
      <Row className='p-0 m-0'>
            <Col className='p-0'>
              <SideBar collapsed = {collapsed} getCollapsed={getCollapsed}/>
            </Col>
            <Col lg={10} xs={12} className='p-0 my-body'>
              <NavBar collapsed={collapsed.valueOf()} getCollapsed={getCollapsed}/>
              {
                fragment === undefined 
                ? (<p className='d-flex justify-content-center fs-3 fw-bold'>Loading Report...</p> )
                : fragment
              
              }
              <Container fluid className='mt-3'>
                <p className='fs-2 fw-bold m-0 mb-1'>Evaluation</p>
                <Card className={`editor-height p-2 shadow-sm ${border}`}>
                  <Form report={report} getContent={getContent}/>
                </Card>
                <div className='text-danger fs-6' hidden={hidden}>
                  You should write an evaluation
                </div>
                <div className='d-flex flex-row justify-content-between mx-4 mt-3 mb-5'>
                  <Button variant='outline-secondary' className='w-30 fw-bold' type='button' onClick={handleCancel} >Back</Button>
                  <Button disabled={loading} variant='success'className='w-30 fw-bold' type='button' onClick={handleSubmit}>Submit</Button>
                </div>
              </Container>
            </Col>
          </Row>
    </>
  )
}
