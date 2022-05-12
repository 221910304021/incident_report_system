import React, {useRef, useEffect, useState} from 'react'
import { Card } from 'react-bootstrap';
import { FaArrowAltCircleDown } from 'react-icons/fa';

export default function DisplayReply(props) {
    const divScrollable = useRef(null);
    const firstRender = useRef(false);
    const [replies, setReplies] = useState(props.replies)
    const [replyCount, setReplyCount] = useState(0)

    useEffect(() => {
       if (props.showreply) {
           scrollToBtm()
       }
    }, [])
    
    useEffect(() => {
       if (!firstRender.current){
           firstRender.current = true
       } else{
           setReplyCount(replyCount+1)
       }
    }, [replies.length])

    useEffect(() => {
        setReplies(props.replies)
    },[props.replies])

    const scrollToBtm = () => {
        setReplyCount(0)
        
        divScrollable.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const handleClick = () => {
        scrollToBtm()
    }
    
    if (props.replies.length === 0) {
        return 
    }

   

  return (
    <>
    <hr className='my-2'/>        
    <p className="fs-5 fw-bold mb-0 mt-2">Replies</p>
        {
            replies.map((reply, index) => {
                return ( 
                    <Card key={index} className='mt-2 shadow-sm'>
                        <div className='ps-2 pt-2 d-flex align-items-start'>
                            <img src={reply.sender.photoUrl} width = {50} className='img-thumbnail rounded-circle me-1'/>
                            <div>
                                <p className="fs-6 fw-bold mb-0">{reply.sender.first_name} {reply.sender.last_name}</p>
                                <p className='fs-6'> {reply.date} | {reply.time}</p>
                                
                            </div>
                        </div>
                        <div className='container-fluid'>
                            <p className='m-2 fs-6'>{reply.text}</p>
                            <div className={`d-flex row`}>
                                {reply.imageLinks.map((link)=>{return (<img src={link} key={link} className='col-xl-4 my-2'/>)})}
                            </div>
                        </div>
                    </Card>
                )
            })
        }
       <div ref={divScrollable}/>
        <div className='rounded-pill bg-secondary text-white py-2 px-3 position-my' hidden={replyCount === 0}>
            <p className='p-0 m-0' onClick={handleClick}>{replyCount} new reply <FaArrowAltCircleDown/> </p>
        </div>
    </>
  )
}
