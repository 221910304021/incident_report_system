import React, {useState, useEffect} from 'react'
import './SideBar.css'
import { ProSidebar, Menu, MenuItem, SidebarContent, SidebarHeader, SidebarFooter } from 'react-pro-sidebar';
import {FaSchool, FaUserPlus, FaFileAlt, FaTimes} from 'react-icons/fa'
import {CgLogOut} from 'react-icons/cg'
import {RiDashboardFill} from 'react-icons/ri'
import {BsMegaphoneFill} from 'react-icons/bs'
import LogoutModal from './LogoutModal';
import  Axios  from 'axios';
import Register from '../register/Register';
import { useAuth } from '../../context/AuthContext';

export default function SideBar({collapsed, getCollapsed}) {
    const [menuCollapsed, setMenuCollapsed] = useState(collapsed)
    const [modalShow, setModalShow] = useState(false)
    const [regsShow, setRegsShow] = useState(false)
    const [hidden, setHidden] = useState(false)

    const { currentUser } = useAuth() 

    useEffect(() => {
        if (getCollapsed) {
            console.log(menuCollapsed);
            getCollapsed(menuCollapsed)
        }

    }, [menuCollapsed])

    useEffect(() => {
        setMenuCollapsed(collapsed)
    },[collapsed])

    useEffect(() => {
        Axios.post('http://localhost:3001/get-evaluator', {
         authID: currentUser.uid,
        }).then((response) => {
            if (response.status === 200) {
                setHidden(!response.data[0].isAdmin)
            }
        })
    }, [])

    if(currentUser === null) {
        return window.location.replace('/login')
    }

    

  return (
    <>
       <ProSidebar className='m-0' collapsed={false} onToggle={(value) => setMenuCollapsed(value)} toggled={menuCollapsed} breakPoint="xxl">
            <SidebarHeader>
            <Menu iconShape="circle">
                <div hidden={!menuCollapsed}>
                    <div className='d-flex justify-content-end pe-3' role='button'>
                        <FaTimes size={20} onClick={()=>{setMenuCollapsed(!menuCollapsed)}}/>
                    </div>
                </div>
                <MenuItem icon={<FaSchool />}><h6 className="text-truncate m-0" role='button' onClick={()=>{window.location.href = '/'}}> CICT Incident Report</h6></MenuItem>
            </Menu>
            </SidebarHeader>
            <SidebarContent>
            <Menu iconShape="circle">
                <MenuItem  icon={<RiDashboardFill />} onClick={()=>{window.location.href='/'}}>Dashboard</MenuItem>
                <MenuItem  icon={<FaFileAlt />} onClick={()=>{window.location.href='/filed-reports'}}>Submitted Report</MenuItem>
                <MenuItem icon={<BsMegaphoneFill/>} >Announcements</MenuItem>
                <MenuItem hidden={hidden} icon={<FaUserPlus/>} onClick={()=>{setRegsShow(true)}}>Add Evaluator</MenuItem>
            </Menu>
            </SidebarContent>
            <SidebarFooter>
                <Menu iconShape='circle'>
                    <MenuItem icon={<CgLogOut/>} onClick={()=>{setModalShow(true)}}>Logout</MenuItem>
                </Menu>
            </SidebarFooter>
            </ProSidebar>

            <LogoutModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
            <Register
                show={regsShow}
                onHide={() => setRegsShow(false)}
            />
    </>
  )
}
