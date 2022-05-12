import React from 'react'
import { ListGroup } from 'react-bootstrap'

export default function Displaybody(props) {

    console.log(props);

  return (
    <>
        <div className='my-descrip-lg shadow-sm'>
            <div>
                <p className="fs-5 fw-bold m-0 my-2">{props.primary_description.header}</p>
                {
                props.primary_description.body  ? (
                    <ListGroup className="mb-4 mx-3" as={'ol'} numbered>
                    {
                        props.primary_description.body.map((object, index) => {
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
            <div dangerouslySetInnerHTML={{ __html: props.description }} />
        </div>
    </>
  )
}
