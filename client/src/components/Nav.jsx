import React, { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import jwtdecode from 'jwt-decode'
import Cookies from 'js-cookie'

const Nav = (props) => {
    const { cookieValue, user, setUser, welcome, setWelcome, loggedIn, setLoggedIn, setCount, count, darkMode, setDarkMode } = props
    const navigate = useNavigate()

    useEffect(() => {
        if (cookieValue) {
            // console.log(jwtdecode(cookieValue))
            setWelcome(jwtdecode(cookieValue).name + " (@" + jwtdecode(cookieValue).displayName + ")")
        }
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        const darkModeCookie = Cookies.get('darkMode')
        setDarkMode(darkModeCookie === "true")

        //fade background

        if (darkModeCookie === "false") document.body.classList.add('change')
        else document.body.classList.remove('change')

        //instant-change background

        // if (darkModeCookie === "true") document.body.style.backgroundImage = "radial-gradient( circle farthest-corner at -4% -12.9%, rgb(74, 110, 88) 0.3%, rgba(30, 33, 48, 1) 90.2%)"
        // else if(darkModeCookie === "purple") document.body.style.backgroundImage = "radial-gradient( circle 922px at 98.1% 95%,  rgba(141,102,155,1) 0%, rgba(92,41,143,1) 100.2% )"
        // else document.body.style.backgroundImage = "radial-gradient(circle 2759px at -6.7% 50%, rgba(80, 131, 73, 1) 0%, rgba(140, 209, 131, 1) 26.2%, rgba(178, 231, 170, 1) 50.6%, rgba(144, 213, 135, 1) 74.1%, rgba(75, 118, 69, 1) 100.3%)"
        
        //https://gradienthunt.com/gradient/3877

        // eslint-disable-next-line
    }, [])

    const colorToggle = () => {
        const updatedDarkMode = !darkMode
        setDarkMode(updatedDarkMode)
        Cookies.set('darkMode', updatedDarkMode.toString(), { expires: 7 })

        //fade background

        if (!updatedDarkMode) document.body.classList.add('change')
        else document.body.classList.remove('change')

        //instant-change background

        // if (updatedDarkMode) document.body.style.backgroundImage = "radial-gradient( circle farthest-corner at -4% -12.9%, rgb(74, 110, 88) 0.3%, rgba(30, 33, 48, 1) 90.2%)"
        // else document.body.style.backgroundImage = "radial-gradient(circle 2759px at -6.7% 50%, rgba(80, 131, 73, 1) 0%, rgba(140, 209, 131, 1) 26.2%, rgba(178, 231, 170, 1) 50.6%, rgba(144, 213, 135, 1) 74.1%, rgba(75, 118, 69, 1) 100.3%)"
    }

    const logout = () => {
        axios.post('http://localhost:8000/api/users/logout', {}, { withCredentials: true })
            .then(res => {
                // console.log(res.data)
                navigate('/')
                setWelcome("Guest")
                setLoggedIn(false)
                setUser()
            })
            .catch(err => console.log(err))
        console.log("logging out")
    }

    const navHome = () => {
        if (loggedIn) {
            navigate("/landing")
            // console.log("logged in so nav to dash")
        } else {
            navigate("/")
            // console.log("logged out so nav to /")
        }
    }

    const navToUser = () => {
        navigate(`/users/${user?._id}`)
        setCount(count + 1)
    }

    return (
        <nav className={darkMode ? "navDark" : "navLight"}>
            <div>
                <h1 style={{ display: 'inline' }} onClick={(navHome)}>CRUD Apps</h1>
                <br className='MQHide' />
                {
                    welcome !== "Guest" ?
                        <span onClick={() => navToUser()}><h4 style={{ display: 'inline' }}>Welcome, {welcome}</h4></span> :
                        <h4 style={{ display: 'inline' }}>Welcome, Guest</h4>
                }
            </div>
            <div>
                {/* <button className={darkMode?"btn btn-danger":"btn btn-dark"} onClick={clearIdeas}>Clear Ideas</button>&nbsp;&nbsp; */}

                {
                    (welcome !== "Guest") ?
                        // (loggedIn) ?
                        <><button className='btn btn-danger' onClick={logout}>Logout</button>&nbsp;&nbsp;</>
                        :
                        null
                }
                <button className={darkMode ? "btn btn-success darkModeButton" : "btn btn-dark darkModeButton"} onClick={colorToggle}>{darkMode ? "☀️" : "🌙"}</button>
            </div>
        </nav>
    )
}
export default Nav