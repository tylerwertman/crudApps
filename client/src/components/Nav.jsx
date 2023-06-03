import React, { useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import jwtdecode from 'jwt-decode'
import Cookies from 'js-cookie'

const Nav = (props) => {
    const { cookieValue, user, setUser, welcome, setWelcome, loggedIn, setLoggedIn, count, darkMode, setDarkMode } = props
    const navigate = useNavigate()

    useEffect(() => {
        if (cookieValue) {
            setWelcome(jwtdecode(cookieValue).name + " (@" + jwtdecode(cookieValue).displayName + ")")
        }
        // eslint-disable-next-line
    }, [count])

    useEffect(() => {
        const darkModeCookie = Cookies.get('darkMode');
        setDarkMode(darkModeCookie === "true");
        if (darkModeCookie === "true") document.body.style.background = 'rgb(33, 37, 41)';
        else document.body.style.background = 'white';

        // eslint-disable-next-line
    }, [])

    const colorToggle = () => {
        const updatedDarkMode = !darkMode;
        setDarkMode(updatedDarkMode);
        Cookies.set('darkMode', updatedDarkMode.toString(), { expires: 7 });

        if (updatedDarkMode) document.body.style.background = 'rgb(33, 37, 41)';
        else document.body.style.background = 'white';

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


    return (
        <nav className={darkMode ? "navDark" : "navLight"}>
            <div>
                <h1 style={{ display: 'inline' }} onClick={(navHome)}>CRUD Apps</h1>
                <br className='MQHide' />
                {
                    welcome !== "Guest" ?
                        <span><h4 style={{ display: 'inline' }}>Welcome, </h4><Link to={`/users/${user?._id}`}>{welcome}</Link></span> :
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
                <button className={darkMode ? "btn btn-success" : "btn btn-dark"} onClick={colorToggle}>{darkMode ? "☀️" : "🌙"}</button>
            </div>
        </nav>
    )
}
export default Nav