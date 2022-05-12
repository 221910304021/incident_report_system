import React, { useRef, useState } from 'react'
import {getDownloadURL, ref, uploadBytesResumable, getStorage} from 'firebase/storage';
import { getApp } from 'firebase/app';
import { Button, ProgressBar } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import Swal from 'sweetalert2';
import  Axios  from 'axios';


export default function UploadImage() {
    const image = useRef();

    const {currentUser} = useAuth()

    const firebaseApp = getApp();
    const storage = getStorage(firebaseApp, "gs://ojt-incident-report-system-dev.appspot.com");

    const [progress, setProgress] = useState(0)
    const [error, setError] = useState(true);
    const [danger, setDanger] = useState(''); 
    const [preview, setPreview] = useState(''); 
    const [hasImage, setHasImage] = useState(true);
    const [typeError, setTypeError] = useState(true);
    const [loading, setLoading] = useState(false)

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
                title: 'Display picture has been changed',
              }).then(() => {
                  window.location.href = '/profile'
                  setLoading(false)
              })
        )
      }

    const handleChange = () => {
        if (!image.current.files[0].type.includes('image')) {
            setError(false)
            setTypeError(true)
            setDanger('border-danger')
        } else {
            setError(true)
            setTypeError(false)
            setDanger('')
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setHasImage(false)
                    setPreview(reader.result)
                }
            }

            reader.readAsDataURL(image.current.files[0])
        }
    }

    const handleSubmit = () => {
        if(!image.current.files[0]){
            setError(false)
            setTypeError(false)
            setDanger('border-danger')
            return;
        }

        const storageRef = ref(storage, `/display-picture/${currentUser.uid}`)
        const uploadTask = uploadBytesResumable(storageRef, image.current.files[0]);
        setLoading(true)
        uploadTask.on('state_changed', 
            (snapshot) => {
                const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes)* 100)
                setProgress(prog)
            }, 
            (error) => {console.log(error);},
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                .then(
                    (url)=>{
                        Axios.put('http://localhost:3001/update-dp', {
                            authID: currentUser.uid,
                            photoUrl: url,
                        }).then((response) => {fire()})
                    }
                    )
            }
        )
    }

  return (
    <>
      <p id='medyo-bold' className='fs-2 m-0'>Change Display Picture</p>
      <hr className='mt-3 mb-3'/>
      <div className='ms-2 d-flex row col-lg-6'>
        <input type='file' accept="image/*" className={`fs-5 form-control ${danger}`} ref={image} onChange={handleChange}/>
        <p className='text-danger' hidden={error}>{typeError ?'Invalid file type. Image type only' : 'You must choose a file'}</p>
      </div>
      <div className='ms-2 mt-3 d-flex row col-lg-6' hidden={hasImage}>
        <p className='fw-bold fs-5' hidden={hasImage}>Preview: </p>
        <img src={preview} hidden={hasImage}/>
        
      </div>
      <div className='ms-2 mt-3 d-flex row col-lg-6 p-0' hidden={hasImage}>
        <ProgressBar label={`Uploading ${progress}%`} hidden={!loading} animated now={progress}/>
      </div>
      
      <div className='d-flex flex-row justify-content-end'>
        <Button variant='outline-secondary' className='w-30 mt-4 me-3 fw-bold' type='button' onClick={()=>window.location.reload()}>Cancel</Button>
        <Button variant='success' disabled={loading} className='w-30 mt-4 fw-bold' type='button' onClick={handleSubmit}>Save</Button>
      </div>
    </>
  )
}
