import React, {useState, useRef, useEffect} from 'react'
import { Card, Form, Button } from 'react-bootstrap'
import {FaImage, FaCheck, FaTimesCircle} from 'react-icons/fa'
import Axios from 'axios';
import { getApp } from 'firebase/app';
import {getDownloadURL, ref, uploadBytesResumable, getStorage} from 'firebase/storage';
import { formatAMPM, formatZeros } from "../commons/Common";
import app from "../../firebase/firebase";
import { useAuth } from '../../context/AuthContext';

export default function SendReply(props) {
    const {currentUser} = useAuth()
    const replyRef = useRef()
    const imageRef = useRef()
    const [row, setRow] = useState(1)
    const [imgHide, setImgHide] = useState(true)
    const [hide, setHide] = useState(true)
    const [sent, setSent] = useState(true)

    const [loading, setLoading] = useState(!props.report.isActive ? true : props.isEvaluated ? false : props.report.replies.length > 0 ? false : JSON.stringify(props.report.evaluation).includes(currentUser.uid)  ? false: true)

    const [error, setError] = useState('')

    const today = new Date();
    const [links, setLinks] = useState([]);

    const [arrayFile, setArrayFile] = useState([])

    const firebaseApp = getApp();
    const storage = getStorage(firebaseApp, "gs://admin-incident-report-dev.appspot.com");

    useEffect(() => {
        if(props.show === false){
          setImgHide(true)
          setArrayFile([])
          setRow(1)
          links.splice(0, links.length)
          imageRef.current !== undefined && imageRef.current!== null ? imageRef.current.value = '' : console.log();
        }
      }, [props.show])


      const autoResize = () => {
        if(replyRef.current.value.match(/\n/g)!==null){
          if(row < 4 && (replyRef.current.value.match(/\n/g)||[]).length === row){
            setRow(row+1)
          } else if((replyRef.current.value.match(/\n/g)||[]).length < 4){
            setRow(row-1)
          }
        } 
        if (replyRef.current.value.length === 0) {
          setRow(1)
        }
      }
  
      const handleIconClick = () => {
        if(!loading) {
          imageRef.current.click();
        }
      }
  
      const handleChange = () => {
  
        const imageUpload = new Promise((resolve, reject) => {
          for (let i = 0; i < imageRef.current.files.length; i++) {
            const storageRef = ref(storage, `/incident-report/${props.report._id}/${today.getFullYear()}${today.getDate()}${today.getMonth()+1}/${imageRef.current.files[i].name}`)
            const uploadTask = uploadBytesResumable(storageRef, imageRef.current.files[i]);
            console.log(imageRef.current.files.length > 0);
            uploadTask.on('state_changed', 
                (snapshot) => {
                }, 
                (error) => {console.log(error);}, 
                () => {
                    getDownloadURL(uploadTask.snapshot.ref)
                    .then(
                        (url)=>{
                            setLinks((links) =>  {return [...links, url]})
                            resolve();
                          }
                        )
                }
            )
          }
         
        });
  
        imageUpload.then((result) => {
          console.log(result);
          setImgHide(false)
          for (let i = 0; i < imageRef.current.files.length; i++) {
            const element = imageRef.current.files[i];
    
            const reader = new FileReader();
    
            reader.onload = () => {
              setArrayFile( arrayFile => [...arrayFile, <img src={reader.result} height={100} className='m-1' key={arrayFile.length}/>])
    
          }
          reader.readAsDataURL(element)
    
          }
        }).catch((error) => {
          console.log(error);
        })
  
        
          
      }
  
      const handleClose = () => {
        setImgHide(true)
        setArrayFile([])
        links.splice(0, links.length)
        imageRef.current.value = null
        replyRef.current.value = ''
        console.log(links);
      }
  
      const preview = arrayFile.map((file) => {
        return file
      })
  
  
      const handleSubmit = () => {
        setLoading(true)
        if(replyRef.current.value.length === 0 && arrayFile.length === 0){
            setHide(false)
            setLoading(false)

            return setError('border-danger')
        } else {
            setHide(true)
            setLoading(false)
            setError('')
        }        

        setLoading(true)

          Axios.post('http://localhost:3001/send-reply', {
            report_id: props.report._id,
            reply: {
              sender: props.report.evaluation.evaluator_info,
              text: replyRef.current.value,
              imageLinks: links,
              date: formatZeros(today),
              time: formatAMPM(today),
            }
          }).then((res) => {
              setLoading(false)
              handleClose()
              setLoading(false)
              setSent(false)

              props.socket.emit('addNotifactionReply', {
                sender: props.report.evaluation.evaluator_info,
                reciever: props.report.student_info.authID,
                title: 'Added new reply',
                report_type: props.report.incident_type,
                report_id: props.report._id,
                date: formatZeros(today),
                time: formatAMPM(today),
              })

              setTimeout(() => {
                setSent(true)
              }, 2000);
          })
      }    


  return (
      <>
        <div className="mb-2">
          <hr className='mt-3 mb-3'/>
          <Card className="m-3 p-2 modal-editor">
            <header className="imageContainer" hidden={imgHide}>
              <div className="images">
                {preview}
              </div>
              <FaTimesCircle size={20} className='ms-2' title='close' role={'button'} onClick={handleClose}/>
            </header>
            <div className={`my-reply d-flex row mx-1 justify-content-between align-items-center ${error}`}>
              <div className="col-11 m-0 p-0">
              <Form>
                <Form.Control autoFocus={props.showreply} disabled={loading} as="textarea" placeholder="Write a Reply..." ref={replyRef} rows={row} onChange={autoResize}/>
              </Form>
              </div>
              <div className="col-1 m-0 p-0 d-flex justify-content-center">
                <input type='file' onChange={handleChange} ref={imageRef} multiple='multiple' accept="image/*" hidden={true}/>
                <FaImage size={25} role='button' color={'grey'} title={'Attach Image'} onClick={handleIconClick}/>
              </div>
            </div>
            <p className='text-danger m-1' hidden={hide}> You must add a reply. Attach photo or write a reply </p>
            <div className="d-flex mt-2 mb-1 justify-content-between">
              <Button variant="outline-secondary" onClick={props.onHide}>Cancel</Button>
              <Button variant="success" disabled={loading} onClick={handleSubmit}>Send</Button>
          </div>
          </Card>
          </div>

          <div className='rounded-pill bg-secondary text-white py-2 px-3 position-sent' hidden={sent}>
              <p className='p-0 m-0'> Reply Sent <FaCheck/> </p>
          </div>
      </>
  )
}
