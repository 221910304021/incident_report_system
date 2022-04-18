import React, { useState, useRef, useEffect } from 'react'
import { Dropdown, DropdownButton, Card, Button } from 'react-bootstrap'
import { useAuth } from '../../contexts/AuthContext';
import TextEditor from './TextEditor'
import draftToHtml from 'draftjs-to-html';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Axios  from 'axios';
import Swal from 'sweetalert2';
import { formatAMPM, formatZeros } from '../commons/Common';

export default function IncidentReport({getForm}) {

    const {currentUser} = useAuth();

    const today = new Date();

    const [selected, setSelected] = useState('Select Incident Type');
    const [content, setContent] = useState();
    const [variant, setVariant] = useState('outline-dark')
    const otherInputRef = useRef();
    // const [othersChecked, setOthersChecked] = useState(false);

    const [show, setShow] = useState('my-hidden');
    const [showReq, setShowReq] = useState('my-hidden');
    const [showDescrip, setShowDescrip] = useState('my-hidden');
    const [incidErrMsg, setIncidErrMsg] = useState('');
    const [student_info, setStudentInfo] = useState();
    const [instruction, setInstruction] = useState()

    const [loading, setLoading] = useState(false);

    const [contentErrBorder, setContentErrBorder] = useState('')

    const getContent = (param) => {
        setContent(param)

    }

    
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


    useEffect(() => {
        Axios.post('http://localhost:3001/student', {
            authID: currentUser.uid,
        }).then((response) => {
            console.log(response);
            if (response.data.length > 0){
                setStudentInfo(response.data[0])
            }
        })
    }, [currentUser.uid])


    const incident_types = [
        {
            id: 'rem_balance', 
            title: 'Remaining Balance',
            instruction: 'Please include the reason for the remaining balance.'
        },
        {
            id: 'failed_sub', 
            title: 'Failed Subject',
            instruction: 'Please include the subject/s with failed remarks.'
        },
        {
            id: 'add_chng', 
            title: 'Adding / Changing',
            instruction: 'Please include the subject/s that you wish to add or change.'
        },
        {
            id: 'subj_inc', 
            title: 'Subjects with INC',
            instruction: 'Please include the subject/s with INC remarks.'
        },
        {
            id: 'subj_not_taken', 
            title: 'Subject from lower year level not yet taken',
            instruction: 'Please include the subject/s that are not yet taken and from lower year level.'
        },
        {
            id: 'subj_not_avail', 
            title: 'Subjects that are not available on the current semester not yet taken',
            instruction: 'Please include the subject/s that are not yet taken and not available for this semester.'
        },
        {
            id: 'other', 
            title: 'Others (Please indicate your concern)',
            instruction: 'Describe your concern.'
        },
    ]

    const handleSelect = (event) => {
        setSelected(event)
        setVariant('outline-dark')
        setShowReq('my-hidden')
        if (event.includes('Others')){
            setShow('')
        } else {
            setShow('my-hidden')
        }

        setInstruction(incident_types.filter(item => item.title === event))
        console.log(instruction);
        
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
            setIncidErrMsg('You selected others. Specify your concern')
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
            student_info: student_info,
            date: formatZeros(today),
            time: formatAMPM(today),
            incident_type: selected.includes('Others') ? `Others: ${otherInputRef.current.value}` : selected,
            description: draftToHtml(content),
            isActive: true,
        }).then(() => {
            setLoading(false)
            fire()
        }).catch(()=>{
            setLoading(false)
        })
        console.log(selected);
    }

    const handlePrev = () => {
        getForm('report')
    }

    
   
    // const handleChange = (event) => {
    //     if (event.target.value.includes('Others')){
    //         setOthersChecked(event.target.checked)
    //         event.target.checked  ? 
    //             setShow('')
    //             : 
    //             setShow('my-hidden');
    //     } else {
    //         if (event.target.checked) {
    //             setSelected([...selected, event.target.value])
    //         } else {
    //             setSelected(selected.filter(item => item !== event.target.value))
    //         }
    //     }
    // }

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
        <DropdownButton size='lg' id='dropdown-basic-button'
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
                        <input ref={otherInputRef} placeholder='Specify your concern*'/>   
                    </div>
        <div className='text-danger fs-6' id={showReq}>
            {incidErrMsg}
        </div>
        <label className='mt-4'>{instruction === undefined ? 'Describe your concern.' : instruction[0].instruction} You may add screenshots for more detailed description. *</label>
        <Card className='editor-height p-2 shadow-sm' id={contentErrBorder}> 
            <TextEditor getContent={getContent}/>   
         </Card>
         <div className='text-danger fs-6' id={showDescrip}>
            Description is required
        </div>
        <div className='d-flex flex-row justify-content-between'>
                <Button variant='primary' className='w-30 mt-4 fw-bold' type='button' onClick={handlePrev}>Prev</Button>
                <Button variant='success' disabled={loading} className='w-30 mt-4 fw-bold' type='button' onClick={handleSubmit}>Submit</Button>
            </div>
        {/* <div dangerouslySetInnerHTML={{__html: draftToHtml(content)}}/> */}
      </>
  )
}
