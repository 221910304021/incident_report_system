import React, { useState, useRef, useEffect } from 'react'
import { Dropdown, DropdownButton, Card, Button, Accordion, Form, ListGroup } from 'react-bootstrap'
import { useAuth } from '../../contexts/AuthContext';
import TextEditor from './TextEditor'
import draftToHtml from 'draftjs-to-html';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Axios  from 'axios';
import Swal from 'sweetalert2';
import { formatAMPM, formatZeros } from '../commons/Common';

export default function IncidentReport({studentInfo}) {

    const {currentUser} = useAuth();

    const today = new Date();

    const [selected, setSelected] = useState('Select Incident Type');
    const [subjectSelect, setSubjectSelect] = useState([])
    const [content, setContent] = useState();
    const [variant, setVariant] = useState('outline-dark')
    const otherInputRef = useRef();
    const balanceRef = useRef();
    // const [othersChecked, setOthersChecked] = useState(false);

    const [show, setShow] = useState('my-hidden');
    const [showReq, setShowReq] = useState('my-hidden');
    const [showDescrip, setShowDescrip] = useState('my-hidden');
    const [incidErrMsg, setIncidErrMsg] = useState('');
    const [instruction, setInstruction] = useState([])
    const [subject, setSubject] = useState([])
    const [toSend, setToSend] = useState({})
    const [subjectBody, setSubjectBody] = useState()

    const [loading, setLoading] = useState(false);

    const [contentErrBorder, setContentErrBorder] = useState('')

    const getContent = (param) => {
        setContent(param)
    }

    useEffect(() => {
        Axios.post('http://localhost:3001/get-subjects')
        .then((response) => {
            setSubject(response.data)
        })
    }, [])

    const subjectContent = (content, text) => {
        return (  
            <Accordion.Item eventKey={content} key={content}>
                <Accordion.Header>{content}{text} Year Subjects</Accordion.Header>
                <Accordion.Body className='p-0'>
                <Form>
                    <ListGroup>
                    {
                        subject.filter((object) => {
                        return JSON.stringify(object.subject_year).includes(content)})
                        .sort((a, b) => a.subject_code.localeCompare( b.subject_code, undefined, {numberic: true, sensitivity: 'base'}))
                        .map((filtered, index) => {
                            return ( 
                                <ListGroup.Item key={filtered.subject_code}>
                                    <Form.Check key={filtered.subject_code} label={` ${filtered.subject_code} - ${filtered.subject_title}`} value={`${filtered.subject_year}${text} year - ${filtered.subject_code} - ${filtered.subject_title}`} onChange={handleChange}/>
                                </ListGroup.Item>
                            )
                        })
                    }
                    </ListGroup>
                </Form> 

                </Accordion.Body>
            </Accordion.Item>
        )
    } 

    useEffect(() => {
        if(selected === 'Failed Subject' || selected === 'Subjects with INC'){
            console.log(year_level.filter((item) => {return Number(item.number) <= Number(studentInfo.year_level)})
            .map((object) => {return subjectContent(object.number, object.text)}));
            setSubjectBody(
            <Accordion className={variant} key={selected}>
                {
                    year_level.filter((item) => {return Number(item.number) <= Number(studentInfo.year_level)})
                    .map((object) => {return subjectContent(object.number, object.text)})
                }
            </Accordion>
            )
        } else if (selected === 'Adding / Changing'){
            setSubjectBody(
                <Accordion key={selected}>
                    {
                        year_level.filter((item) => {return Number(item.number) === Number(studentInfo.year_level)})
                        .map((object) => {return subjectContent(object.number, object.text)})
                    }
                </Accordion>
                )
        }  else if (selected === 'Subjects from lower year level not yet taken'){
            setSubjectBody(
                <Accordion className={variant} key={selected}>
                    {
                        year_level.filter((item) => {return Number(item.number) < Number(studentInfo.year_level)})
                        .map((object) => {return subjectContent(object.number, object.text)})
                    }
                </Accordion>
                )
        }  else if (selected === 'Subjects that are not available on the current semester not yet taken'){
            setSubjectBody(
                <Accordion className={variant} key={selected}>
                    {
                        year_level.map((object) => {return subjectContent(object.number, object.text)})
                    }
                </Accordion>
                )
        } else if (selected === 'Remaining Balance'){
            setSubjectBody(
                <div>
                    ₱<input min={1} type={'number'} ref={balanceRef}/>
                </div>
                )
        } else {
            setSubjectBody(<input type={'text'} ref={otherInputRef}/>)
        }
        
    }, [selected])

    useEffect(() => {
        if(instruction[0] !== undefined){
         if (instruction[0].title.includes('Others')){
            if (otherInputRef.current !== undefined && otherInputRef.current !== null ) {
                setToSend({'header' : `${instruction[0].description} ${otherInputRef.current.value}`})

             }
 
         } else if (instruction[0].title.includes('Remaining')){
             if (balanceRef.current !== undefined && balanceRef.current !== null) {
                setToSend({
                    'header' : `${instruction[0].description} ₱${balanceRef.current.value}`
                })
             }
            
 
 
         } else{
 
             setToSend({
                 'header' : instruction[0].description,
                 'body' : subjectSelect.sort((a,b) => a.localeCompare( b, undefined, {numberic: true, sensitivity: 'base'}))
             })
 
         }  
        }
 
     }, [subjectSelect, otherInputRef, balanceRef])
    
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
                title: 'Report submited'
              }).then(() => {
                  window.location.href = '/'
                  setLoading(false)
              })
        )
      }

    const handleChange = (event) => {

        const { checked, value } = event.currentTarget;

        setSubjectSelect(
        subjectSelect => checked
            ? [...subjectSelect, value]
            : subjectSelect.filter(val => val !== value)
        );
    }

    
    
    const year_level = [
        {
            number: '1',
            text: 'st'
        },
        {
            number: '2',
            text: 'nd'
        },
        {
            number: '3',
            text: 'rd'
        },
        {
            number: '4',
            text: 'th'
        },
    ]

    const incident_types = [
        {
            id: 'rem_balance', 
            title: 'Remaining Balance',
            instruction: 'Please include the remaining balance.*',
            description: 'Remaining Balance:',

        },
        {
            id: 'failed_sub', 
            title: 'Failed Subject',
            instruction: 'Please select the subject/s with failed remarks.*',
            description: 'Subject/s with failed remarks:',
        },
        {
            id: 'add_chng', 
            title: 'Adding / Changing',
            instruction: 'Please select the subject/s that you wish to add or change.*',
            description: 'Subject/s that wish to add or change:',
        },
        {
            id: 'subj_inc', 
            title: 'Subjects with INC',
            instruction: 'Please select the subject/s with INC remarks.*',
            description: 'Subject/s with INC remarks:',
        },
        {
            id: 'subj_not_taken', 
            title: 'Subjects from lower year level not yet taken',
            instruction: 'Please select the subject/s that are not yet taken and from lower year level.*',
            description: 'Subject/s that are not yet taken and from lower year level:',
        },
        {
            id: 'subj_not_avail', 
            title: 'Subjects that are not available on the current semester not yet taken',
            instruction: 'Please select the subject/s that are not yet taken and not available for this semester.*',
            description: 'Subject/s that are not yet taken and not available for this semester:',
        },
        {
            id: 'other', 
            title: 'Others (Please indicate your concern)',
            instruction: 'Describe your concern.',
            description: 'Other concern: ',
        },
    ]

    const handleSelect = (event) => {
        setSelected(event)
        setVariant('outline-dark')
        setShowReq('my-hidden')
        setSubjectSelect([])
        if (event){
            setShow('')
        } 

        setInstruction(incident_types.filter(item => item.title === event))
        
    }

    const handleSubmit = () => {
        console.log(content.blocks[0].text);

        // if (!othersChecked && selected.length < 1) {
        //     setVariant('error-border')
        //     setIncidErrMsg('Incident type is required')
        //     return setShowReq('')
        // } else {
        //     setVariant('')
        //     setShowReq('my-hidden')
        // }

        // if (othersChecked && otherInputRef.current.value.length < 1){
        //     setVariant('error-border')
        //     setIncidErrMsg('You selected others. Specify your concern')
        //     return setShowReq('')
        // } else {
        //     setVariant('')
        //     setShowReq('my-hidden')
        // }
        

        if (selected.includes('Select')) {
            setVariant('outline-danger')
            setIncidErrMsg('Incident type is required')
            return setShowReq('')
        } else {
            setVariant('outline-dark')
            setShowReq('my-hidden')
        }

        if (selected.includes('Others') && otherInputRef.current.value.length < 1) {
            setVariant('outline-danger')
            setIncidErrMsg('Please pecify your concern')
            return setShowReq('')
        } else {
            setVariant('outline-dark')
            setShowReq('my-hidden')
        }

        if (selected.includes('Remaining') && balanceRef.current.value.length < 1) {
            setVariant('outline-danger')
            setIncidErrMsg('Please include the remaining balance')
            return setShowReq('')
        } else {
            setVariant('outline-dark')
            setShowReq('my-hidden')
        }

        if (!selected.includes('Others') && !selected.includes('Remaining') && subjectSelect.length < 1) {
            setVariant('outline-danger')
            setIncidErrMsg('Please select atleast one (1) subject')
            return setShowReq('')
        } else {
            setVariant('outline-dark')
            setShowReq('my-hidden')
        }

        if(content === undefined){
            setShowDescrip('')
            return setContentErrBorder('error-border');
        } else if (content.blocks.length === 1 && content.blocks[0].text === ''){
            setShowDescrip('')
            return setContentErrBorder('error-border');
        } else {
            setShowDescrip('my-hidden')
            setContentErrBorder('');
        }

        console.log(selected);
        setLoading(true)
        Axios.post('http://localhost:3001/file-report', {
            student_id: currentUser.uid,
            student_info: studentInfo,
            date: formatZeros(today),
            time: formatAMPM(today),
            incident_type: selected.includes('Others') ? `Others` : selected,
            description: draftToHtml(content),
            primary_description: toSend,
            isActive: true,
        }).then(() => {
            fire()
        }).catch(()=>{
            setLoading(false)
        })
        console.log(selected);
    }

    const handlePrev = () => {
        window.location.href = '/';
    }

  return (
      <>
        <p id='medyo-bold' className='fs-1 m-0'>Incident Report</p>
        <p className='m-0'>Please include all the neccessary information.</p>
        <p className='m-0'>Field with asterisk " * " is required.</p>
        <hr className='mt-2 mb-3'/>
        
            {/* <Form>
                <Form.Group>
                    <Form.Label>Incident Type*</Form.Label>
                    <Card id={variant} className='p-2 shadow-sm'>
                    {
                        incident_types.map( type => {
                            return(
                                <Form.Check key={type.id} label={type.title} onChange={handleChange} value={type.title} />
                            )
                        })
                    }
                    <div className='other-input mt-2 ms-3 mb-2' id={show}>
                        <input ref={otherInputRef} placeholder='Specify your concern*'/>   
                    </div>
                    </Card>
                </Form.Group>
            </Form> */}
        
        <label className='mb-1'>Incident Type*</label>
        <DropdownButton id='dropdown-basic-button'
         variant={variant} title={selected} onSelect={handleSelect}>
            {
                incident_types.map( type => {
                    return(
                        <Dropdown.Item key={type.id} eventKey={type.title}>{type.title}</Dropdown.Item>
                    )
                } )
            }
        </DropdownButton>
        <div className='other-input mt-3 ms-3 mb-2' id={show}>
            <label className='mb-1'>{instruction[0] === undefined ? '' : instruction[0].instruction}</label> <br/>
            {subjectBody}
            {
                subjectSelect.length > 0 ?
                <>
                <label className='mb-1 mt-3 fs-5 fw-bold'>{ subjectSelect.length > 1 ? 'Selected subjects:' : 'Selected subject:'}</label>
                <ListGroup as={'ol'} numbered>
                 {subjectSelect.sort((a,b) => a.localeCompare( b, undefined, {numberic: true, sensitivity: 'base'}))
                 .map((object, index) => {
                    return (
                            <ListGroup.Item as={'li'} key={index}>
                                {object}
                            </ListGroup.Item>
                    )
                })}
                </ListGroup> 
                </>:
                ''
            }
        </div>
        <div className='text-danger fs-6' id={showReq}>
            {incidErrMsg}
        </div>
        <label className='mt-4'>Describe your concern. You may add screenshots for more detailed description. *</label>
        <Card className='editor-height p-2 shadow-sm' id={contentErrBorder}> 
            <TextEditor getContent={getContent} holder={'Start writing your concern...'}/>   
         </Card>
         <div className='text-danger fs-6' id={showDescrip}>
            Description is required
        </div>
        <div className='d-flex flex-row justify-content-between'>
                <Button variant='outline-secondary' className='w-30 mt-4 fw-bold' type='button' onClick={handlePrev}>Cancel</Button>
                <Button variant='success' disabled={loading} className='w-30 mt-4 fw-bold' type='button' onClick={handleSubmit}>Submit</Button>
            </div>
        {/* <div dangerouslySetInnerHTML={{__html: draftToHtml(content)}}/> */}
      </>
  )
}
