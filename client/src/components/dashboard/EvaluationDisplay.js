import React, { useEffect, useState } from 'react'

export default function EvaluationDisplay(props) {
 const [status, setStatus] = useState('')

 
 useEffect(() => {
   
    if (Object.keys(props.evaluation).length === 1 && Object.keys(props.evaluation).includes('evaluator_info')) {
        setStatus('Your report is now on the process of evaluation. Please wait for the resolution.')
    }
   
 }, [])

 if (Object.keys(props.evaluation).length === 0 ){
    return
}

  
  return (
        <>
        <hr className='my-2'/>
            <p className="fs-5 fw-bold mb-0 mt-2">Evaluation</p>
            <div className='my-descrip-lg shadow-sm'>
                {
                  status === '' ?
                  <div dangerouslySetInnerHTML={{ __html: props.evaluation.resolution }} /> :
                  <p className="fs-5 fw-bold mb-0 mt-2 d-flex justify-content-center">{status}</p>
                }
                  <div className='d-flex justify-content-end mt-5 align-items-center'>
                    <div >
                        <p className="fs-6 mb-0">Evaluator :</p>
                        <div className='ms-2 d-flex align-items-center'>
                            <img src={props.evaluation.evaluator_info.photoUrl} width = {40} className='img-thumbnail rounded-circle me-1'/>
                            <p className="fs-6 fw-bold mb-0 d-flex">{props.evaluation.evaluator_info.first_name} {props.evaluation.evaluator_info.last_name}</p>
                        </div>
                    </div>
                   
                  </div>
            </div>
        </>
    )
}
