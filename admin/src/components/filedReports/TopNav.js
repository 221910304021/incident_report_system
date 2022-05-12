import React, { useRef, useEffect, useState } from 'react'
import { Form, FormControl, Button, InputGroup, DropdownButton, Dropdown, Accordion, ListGroup} from 'react-bootstrap'
import {FaSearch, FaBars, FaTimes, FaTrash, FaTrashAlt} from 'react-icons/fa'

export default function TopNav({getSearchInput, getFiltered}) {

  const searchInput = useRef();

  const [selectIncidType, setSelectIncidType] = useState('');
  const [selectSection, setSelectSection] = useState('');
  const [selectYrLvl, setSelectYrLvl] = useState('');

  useEffect(() => {
     if (getFiltered !== undefined) {
        getFiltered(selectIncidType, selectSection, selectYrLvl)
     }

 }, [selectIncidType, selectSection, selectYrLvl])

  const drpdwnItemList = ['Incident Type', 'Year Level', 'Section']
  const sectionItem = String.fromCharCode(...Array(123).keys()).slice(97).toUpperCase().split('');
  const yrlvlItem = [1, 2, 3, 4]
  const incidentTypeItem = [
            'Remaining Balance', 
            'Failed Subject',
            'Adding / Changing',
            'Subjects with INC',
            'Subjects from lower year level not yet taken',
            'Subjects that are not available on the current semester not yet taken',
            'Others'
        ]


  const sectionAccordionItem = sectionItem.map((item, index) => {
    return (
        <ListGroup.Item action key={index} className='d-flex justify-content-center' onClick={()=>{setSelectSection(item)}}>{item}</ListGroup.Item>
    )
  })

  const yrlvlAccordionItem = yrlvlItem.map((item, index) => {
      return(
        <ListGroup.Item action key={item.toString()} className='d-flex justify-content-center' onClick={()=>{setSelectYrLvl(item.toString())}}>{item}</ListGroup.Item>
      )
  })

  const incdnTypeAccordionItem = incidentTypeItem.map((item, index) => {
    return(
      <ListGroup.Item action key={index} className='d-flex justify-content-center' onClick={()=>{setSelectIncidType(item)}}>{item}</ListGroup.Item>
    )
})

  const dropdownItem = drpdwnItemList.map((item, index) => {
      if (item === 'Section'){
        return(
            <Accordion.Item key={index} eventKey={index} className='m-2'>
                <Accordion.Header>{selectSection.length > 0 ?  `${item}: ${selectSection} `: item}</Accordion.Header>
                    <Accordion.Body className='my-dropdown p-0'>
                        <ListGroup>
                            {selectSection.length > 0 ?  (<ListGroup.Item action key='clear' variant="danger" className='d-flex justify-content-center align-items-center' onClick={()=>{setSelectSection('')}}>Clear selection &nbsp; <FaTrashAlt/> </ListGroup.Item>): '' }
                            
                            {sectionAccordionItem}
                           
                        </ListGroup>
                </Accordion.Body>
            </Accordion.Item>
        )
      } else if (item === 'Year Level'){
        return(
            <Accordion.Item key={index} eventKey={index} className='m-2'>
                <Accordion.Header>{selectYrLvl.length > 0 ?  `${item}: ${selectYrLvl} ` : item}</Accordion.Header>
                    <Accordion.Body className='my-dropdown p-0'>
                        <ListGroup activeKey={selectYrLvl}>
                            {selectYrLvl.length > 0 ?  ( <ListGroup.Item action key='clear' variant='danger' className='d-flex justify-content-center align-items-center' onClick={()=>{setSelectYrLvl('')}}>Clear selection &nbsp; <FaTrashAlt/> </ListGroup.Item>): '' }
                           
                            {yrlvlAccordionItem}
                        </ListGroup>
                </Accordion.Body>
            </Accordion.Item>
        )
      } else{
        return(
            <Accordion.Item key={index} eventKey={index} className='m-2'>
                <Accordion.Header>{selectIncidType.length > 0 ? `${item}: ${selectIncidType} ` : item}</Accordion.Header>
                    <Accordion.Body className='my-dropdown p-0'>
                        <ListGroup>
                            {selectIncidType.length > 0 ?  ( <ListGroup.Item action key='clear' variant='danger' className='d-flex justify-content-center align-items-center' onClick={()=>{setSelectIncidType('')}}>Clear selection &nbsp; <FaTrashAlt/> </ListGroup.Item>): '' }
                            {incdnTypeAccordionItem}
                        </ListGroup>
                </Accordion.Body>
            </Accordion.Item>
        )
      }
    
  })


  const handleOnchange = () => {
      getSearchInput(searchInput.current.value)
  }


  return (
        <>
        <div className=' d-flex justify-content-end container-fluid mt-xl-5 mt-3'>
              <Form className="d-flex col-lg-4 col-10">
                <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon"><FaSearch/></InputGroup.Text>
                    <FormControl
                        type="search"
                        placeholder="Search..."
                        className="me-2"
                        aria-label="Search"
                        ref={searchInput}
                        onChange={handleOnchange}
                    />
                </InputGroup>
                </Form>

                <DropdownButton title='Filters'>
                  <Accordion>
                      {dropdownItem}
                  </Accordion>
                </DropdownButton>
            </div>
        </>
    )
}
