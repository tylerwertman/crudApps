import React, { useContext } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { crudAppsContext } from '../App'

const Nav = () => {
    const { darkMode, user, setUser } = useContext(crudAppsContext)
    const navigate = useNavigate()
    const toastLogOut = () => toast.error(`Goodbye, ${user.name}`)


    const logout = () => {
        axios.post('http://localhost:8000/api/users/logout', {}, { withCredentials: true })
            .then(res => {
                // console.log(res.data)
                navigate('/')
                setUser(null)
                toastLogOut()
            })
            .catch(err => console.log(err))
        console.log("logging out")
    }

    const navHome = () => {
        if (user) {
            navigate("/landing")
            // console.log("logged in so nav to dash")
        } else {
            navigate("/")
            // console.log("logged out so nav to /")
        }
    }

    const navToUser = () => {
        console.log(user)
        if (user) navigate(`/users/${user?._id}`)
        // setCount(count + 1)
    }

    return (
        <nav className={darkMode ? "navDark" : "navLight"}>
            <div>
                <h1 style={{ display: 'inline' }} onClick={(navHome)}>CRUD Apps</h1>
                <br className='MQHide' />
                <h4 style={{ display: 'inline' }} onClick={() => navToUser()}>Welcome,
                    {
                        user ?
                            ` ${user.name} (@${user.displayName})` :
                            " Guest"
                    }
                </h4>
            </div>
            <div>
                {/* <button className={darkMode?"btn btn-danger":"btn btn-dark"} onClick={clearIdeas}>Clear Ideas</button>&nbsp;&nbsp; */}
                {
                    (user) ?
                        <><button className='btn btn-danger' onClick={logout}>Logout</button><span className='MQHide2'>&nbsp;&nbsp;</span></>
                        :
                        null
                }
                {/* <br className='MQHide' /> */}
                {/* <button className={darkMode ? "btn btn-success darkModeButton" : "btn btn-dark darkModeButton"} onClick={colorToggle}>{darkMode ? "☀️" : "🌙"}</button> */}
            </div>
        </nav>
    )
}
export default Nav