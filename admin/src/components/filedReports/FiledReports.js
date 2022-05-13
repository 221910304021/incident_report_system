import React, {useState, useEffect} from 'react'
import Axios from 'axios'
import SideBar from '../navs/SideBar'
import { FaInfoCircle, FaSearch } from 'react-icons/fa'
import { Col, Card, ButtonGroup, Button, Form, FormControl, Row, Pagination, Tab, Tabs } from 'react-bootstrap'
import TopNav from './TopNav'
import './FiledReport.css'
import AdminReply from './AdminReply'
import { useAuth } from '../../context/AuthContext'
import NavBar from '../navs/Navbar'
import { io } from "socket.io-client";


export default function FiledReports() {
  const [reports, setReports] = useState([])
  const [search, setSearch] = useState(' ')
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [postPerPage,  setPostPerPage] = useState(9)
  const [collapsed, setCollapsed] = useState(false)

  const [closeDisable, setClosedDisable] = useState(false)

  const [modalShow, setModalShow] = useState(false);
  const [showReply, setShowReply] = useState(false)
  const [oneReport, setOneReport] = useState()

  const [filterIncident, setFilterIncident] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [filterYearLevel, setFilterYearLevel] = useState('');
  const [filterPending, setFilterPending] = useState('');
  const [filterSelected, setFilterSelected] = useState('')
  const [active, setActive] = useState(1);
  const [socket, setSocket] = useState(null)


  const pageNumbers = []
  const [key, setKey] = useState('all');

  const {currentUser} = useAuth();  

  useEffect(() => {
    Axios.get('http://localhost:3001/get-all-reports', {})
    .then((response)=>{
      setReports(response.data)
    })
  }, [])

  useEffect(() => {
    setSocket(io("http://localhost:3001"))
}, [currentUser.uid])

  
  if (currentUser === undefined){
    return window.location.replace('/login');
  }

  const getSearchInput = (param) => {
    setCurrentPage(1)
    setSearch(param)
  }
  
  const getFilters = (incidentType, section, yearLevel) => {
    setCurrentPage(1)
    setFilterIncident(incidentType)
    setFilterSection(section)
    setFilterYearLevel(yearLevel)
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

  const reply = (report_id) => {
      Axios.post('http://localhost:3001/get-report', {
          report_id: report_id,
          }).then((response) => {
              setOneReport(response.data[0])
              setShowReply(true)
              setModalShow(true)
    })
  }

  const closeReport = (report_id) => {
    Axios.post('http://localhost:3001/close-report', {
        report_id: report_id,
      })

  }

  const disbale_eval_btn = (report) => {
    if (Object.keys(report.evaluation).length === 0) {
        return false
    } 
    if (!report.isActive) {
      return true
    }

    return report.evaluation.evaluator_info.authID !== currentUser.uid
  }

  const disbale_reply_btn = (report) => {
    if (Object.keys(report.evaluation).length === 0) {
        return true
    } 
    if (!report.isActive) {
        return true
    }
    
    return report.evaluation.evaluator_info.authID !== currentUser.uid
  }

  const disbale_close_btn = (report) => {
      if (!report.isEvalueated) {
        return true
      }

      return !report.isActive
  }

  const evaluate = (report_id) => {
    window.location.href = `/filed-reports/evaluate/${report_id}`
  }
  
 const searched = reports.filter((report) => {return JSON.stringify(report).toLowerCase().includes(search.toLowerCase())})
 .filter((report1) => {return JSON.stringify(report1.incident_type).includes(filterIncident)})
 .filter((report2) => {return JSON.stringify(report2.student_info.section).includes(filterSection)})
 .filter((report3) => {return JSON.stringify(report3.student_info.year_level).includes(filterYearLevel)})
 .filter((report4) => {return JSON.stringify(report4.evaluation).includes(filterSelected)})
 .filter((report5) => {return JSON.stringify(report5.evaluation).includes( filterPending)})
 .map((report, index) => 
  {return(
    <Col lg={4} md={6} key={index}>
        <Card className='m-2 shadow-sm my-card'>
            <Card.Body>
                <Card.Title className='text-truncate'>
                {report.incident_type}
                </Card.Title>
                <div className='fs-6 mt-0 mb-1'>  {report.date} | {report.time}</div>
                <div className='d-flex col mb-2 align-items-center'>
                  <img src={report.student_info.photoUrl} width={60} className='img-thumbnail rounded-circle me-3' />
                  <div>
                    <div className='fs-5'>  {report.student_info.first_name} {report.student_info.mid_name} {report.student_info.last_name} </div>
                    <div className='fs-6'>Year Level: {report.student_info.year_level} | Section: {report.student_info.section}</div>
                  </div>
                  </div>
                   {
                        !report.isActive 
                        ?  <div className='my-descrip closed-report' title='Closed'/> 
                        :  report.isEvalueated 
                         ? <div className='my-descrip active-report' title={`Evaluated by ${report.evaluation.evaluator_info.first_name} ${report.evaluation.evaluator_info.last_name}`}/>
                         : Object.keys(report.evaluation).includes('evaluator_info') || Object.keys(report.evaluation).length === 1
                         ? <div className='my-descrip on-process' title={`On Process with ${report.evaluation.evaluator_info.first_name} ${report.evaluation.evaluator_info.last_name}` }/> 
                         : <div className='my-descrip pending-report' title='Pending'/>
                    }
                   
            </Card.Body>
            <ButtonGroup aria-label="">
                <Button variant="light" disabled={disbale_close_btn(report)} onClick={()=>{closeReport(report._id)}}>Close</Button>
                <Button variant="light" onClick={()=>{viewReport(report._id)}}>View</Button>
                <Button variant="light" disabled={disbale_reply_btn(report)} onClick={()=>{reply(report._id)}}>Reply</Button>
                <Button variant="light" disabled={disbale_eval_btn(report)} onClick={()=>{evaluate(report._id)}}>{report.isEvalueated ? 'Re-evaluate' : 'Evaluate'}</Button>
            </ButtonGroup>
        </Card> 
    </Col>
  )}).reverse()

  const indexOfLastPost = currentPage * postPerPage;
  const indexOfFirstPost = indexOfLastPost - postPerPage;
  const currentPost = searched.slice(indexOfFirstPost, indexOfLastPost)

  const next = (number) => {
    if (number < Math.ceil(searched.length / postPerPage)) {
      setCurrentPage(number+1)
    }
  }
  const prev = (number) => {
    if (number > 1) {
      setCurrentPage(number-1)
    }
    
  }

  for (let i = 1; i <= Math.ceil(searched.length / postPerPage); i++) {
    pageNumbers.push( <Pagination.Item key={i} active={i === active} >
      {i}
    </Pagination.Item>)    
  }

  const getCollapsed = (param) => {
    setCollapsed(param)
  }

  const handleTabSelect = (k) => {
    setKey(k)
    setCurrentPage(1)
    if (k === 'all') {
        setFilterPending('')
        setFilterSelected('')
    } else if(k === 'pending'){
      setFilterSelected('')
      setFilterPending('{}')
    } else {
      setFilterSelected(currentUser.uid)
      setFilterPending('')
    }

  }
  return (
    <>
        <Row className='p-0 m-0'>
            <Col className='p-0'>
              <SideBar collapsed = {collapsed} getCollapsed={getCollapsed}/>
            </Col>
            <Col xl={10} className='p-0 my-col'>
              <NavBar collapsed={collapsed.valueOf()} getCollapsed={getCollapsed}/>
              <TopNav getSearchInput={getSearchInput} getFiltered={getFilters}/>
              <div className='container-fluid'>
                <Tabs
                  id="controlled-tab-example"
                  activeKey={key}
                  onSelect={(k) => handleTabSelect(k)}
                  className="mb-2 my-tablist"
                  >
                  <Tab eventKey="all" title={`All Reports (${reports.length})`}>
                    <div className='d-flex row align-content-start my-body-reports'>
                      {
                        currentPost.length === 0 
                        ? <p className='d-flex justify-content-center my-5 fs-3 fw-bold'>No report found :(</p> 
                        : currentPost
                      }
                    </div>
                  </Tab>
                  <Tab eventKey="pending" title={`Pending Reports (${reports.filter((item) =>{return JSON.stringify(item.evaluation).includes('{}')}).length})`}>
                    <div className='d-flex row align-content-start my-body-reports'>
                      {
                        currentPost.length === 0 
                        ? <p className='d-flex justify-content-center my-5 fs-3 fw-bold'>No report found :(</p> 
                        : currentPost
                      }
                    </div>
                  </Tab>
                  <Tab eventKey="selected" title={`Selected Reports (${reports.filter((item) =>{return JSON.stringify(item.evaluation).includes(currentUser.uid)}).length})`}>
                      <div className='d-flex row align-content-start my-body-reports'>
                        {
                          currentPost.length === 0 
                          ? <p className='d-flex justify-content-center my-5 fs-3 fw-bold'>No report found :(</p> 
                          : currentPost
                        }
                      </div>
                  </Tab>
                </Tabs>
                
                {
                  searched.length <= postPerPage ?
                  '' :
                  <Pagination className='justify-content-start mt-3'>
                    <Pagination.Prev onClick={()=>{prev(currentPage)}}/>
                    <Pagination.Item active>Page {currentPage} of {Math.ceil(searched.length / postPerPage)}</Pagination.Item>
                    <Pagination.Next onClick={()=>{next(currentPage)}}/>
                  </Pagination>
                }
            </div>

            </Col>
          </Row>

          <AdminReply 
            show={modalShow}
            showreply={showReply.valueOf()}
            onHide={() => {setModalShow(false)}}
            report={oneReport}
            socket={socket}
            />
    </>
  )
}
