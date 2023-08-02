import React, { useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import withAuth from './WithAuth'
import { toast } from 'react-toastify'
import { crudAppsContext } from '../App'

const LandingPage = (props) => {
    const { darkMode, user } = useContext(crudAppsContext)
    const { previousLocation, setPreviousLocation } = props
    const toastReg = () => toast.success(`Thank you for registering, ${user?.name}!`, { toastId: 1 })
    const toastLogin = () => toast.success(`Welcome back, ${user?.name}`, { toastId: 1 })

    useEffect(() => {
        if (previousLocation?.pathname === "/login") {
            toastLogin()
            setPreviousLocation(null)
        } else if (previousLocation?.pathname === "/") {
            toastReg()
            setPreviousLocation(null)
        } else {
            return
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className='mt-5'>

            <h1 style={{ padding: "0px 30px 10px 30px" }}>Welcome to an assortment of TWD CRUD apps!</h1>
            <div className={darkMode ? "contentDark landingPage mb-3" : "content landingPage mb-3"}>
                <h3>What is CRUD?</h3>
                <h5>CRUD stands for create, read, upate, delete. </h5>
                <h6>Users will be able to create, read, update and delete objects from a database.</h6>
                <p><strong>Built with:</strong> Mongoose, Express, React, Node, RESTful API, Bootstrap, React-Router, Axios, Socket.IO, Multer</p>
                <p><strong>Universal features:</strong> Registration, login, and protected routes with JWT/BCrypt/Cookie authentication. Real-time CRUD. Many to many relationships. Dark mode. Profile pictures.</p>
            </div>
            <div className=" flex mx-auto">
                <div className="row mx-auto" style={{ gap: "12px" }}>
                    <div className={darkMode ? "contentDark mb-3" : "content mb-3"}>
                        <Link to={"/bookClub"}><h3>Book Club</h3></Link>
                        <p><strong>Unique features:</strong> column sorting, pagination</p>
                    </div>
                    <div className={darkMode ? "contentDark mb-3" : "content mb-3"}>
                        <Link to={"/brightIdeas"}><h3>Bright Ideas</h3></Link>
                        <p><strong>Unique features:</strong> auto-sort, pagination, search</p>
                    </div>
                    <div className={darkMode ? "contentDark mb-3" : "content mb-3"}>
                        <h3>Coming Soon...</h3>
                    </div>
                    {/* <div className={darkMode ? "contentDark mb-3" : "content mb-3"}>
                        <Link to={"/pizzaTime"}><h3>Pizza Time</h3></Link>
                        <p><strong>Unique features:</strong> e-Commerce Checkout</p>
                    </div> */}
                </div>
                {/* <div className="row">
                    <div className={darkMode ? "contentDark mb-3" : "content mb-3"}>
                        <Link to={"/bookClub"}><h3>Book Club</h3></Link>
                        <p>Built with: Mongoose, Express, React, Node, Socket.IO, RESTful API, Bootstrap</p>
                        <p>Features: real-time CRUD, many to many relationships, registration, login, and protected routes with JWT/Cookie authentication, dark mode, column sorting, pagination</p>
                    </div>
                    <div className={darkMode ? "contentDark mb-3" : "content mb-3"}>
                        <Link to={"/brightIdeas"}><h3>Bright Ideas</h3></Link>
                        <p>Built with: Mongoose, Express, React, Node, Socket.IO, RESTful API, Bootstrap</p>
                        <p>Features: real-time CRUD, many to many relationships, registration, login, and protected routes with JWT/Cookie authentication, dark mode, auto-sort, pagination, search</p>
                    </div>
                    <div className={darkMode ? "contentDark mb-3" : "content mb-3"}>
                        <Link to={"/brightIdeas"}><h3>Bright Ideas</h3></Link>
                        <p>Built with: Mongoose, Express, React, Node, Socket.IO, RESTful API, Bootstrap</p>
                        <p>Features: real-time CRUD, many to many relationships, registration, login, and protected routes with JWT/Cookie authentication, dark mode, auto-sort, pagination, search</p>
                    </div>
                </div>
                <div className="row">
                    <div className={darkMode ? "contentDark mb-3" : "content mb-3"}>
                        <Link to={"/bookClub"}><h3>Book Club</h3></Link>
                        <p>Built with: Mongoose, Express, React, Node, Socket.IO, RESTful API, Bootstrap</p>
                        <p>Features: real-time CRUD, many to many relationships, registration, login, and protected routes with JWT/Cookie authentication, dark mode, column sorting, pagination</p>
                    </div>
                    <div className={darkMode ? "contentDark mb-3" : "content mb-3"}>
                        <Link to={"/brightIdeas"}><h3>Bright Ideas</h3></Link>
                        <p>Built with: Mongoose, Express, React, Node, Socket.IO, RESTful API, Bootstrap</p>
                        <p>Features: real-time CRUD, many to many relationships, registration, login, and protected routes with JWT/Cookie authentication, dark mode, auto-sort, pagination, search</p>
                    </div>
                    <div className={darkMode ? "contentDark mb-3" : "content mb-3"}>
                        <Link to={"/brightIdeas"}><h3>Bright Ideas</h3></Link>
                        <p>Built with: Mongoose, Express, React, Node, Socket.IO, RESTful API, Bootstrap</p>
                        <p>Features: real-time CRUD, many to many relationships, registration, login, and protected routes with JWT/Cookie authentication, dark mode, auto-sort, pagination, search</p>
                    </div>
                </div> */}
            </div>
            <br />
            <br />
        </div>
    )
}

export default withAuth(LandingPage)
