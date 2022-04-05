import React from 'react'
import { Dropdown, DropdownButton } from 'react-bootstrap'

export default function IncidentReport() {

    const incident_types = [
        {
            id: 'rem_balance', 
            title: 'Remaining Balance',
        },
        {
            id: 'failed_sub', 
            title: 'Failed Subject',
        },
        {
            id: 'add_chng', 
            title: 'Adding / Changing',
        },
        {
            id: 'subj_inc', 
            title: 'Subject with INC',
        },
        {
            id: 'subj_not_taken', 
            title: 'Subject from lower year level not yet taken',
        },
        {
            id: 'subj_not_avail', 
            title: 'Subjects that are not available on the current semester not yet taken',
        },
        {
            id: 'other', 
            title: 'Others (Please indicate your concern)',
        },

    ]

  return (
      <>
        <p id='medyo-bold' className='display-2'>Incident Report</p>
        <hr className='mt-2 mb-3'/>
        <DropdownButton id='dropdown-basic-button' title='Incident Type'>
            {
                incident_types.map( type => {
                    return(
                        <Dropdown.Item eventKey={type.title}>{type.title}</Dropdown.Item>
                    )
                } )
            }
        </DropdownButton>
      </>
  )
}
