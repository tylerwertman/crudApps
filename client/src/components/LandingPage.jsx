import React from 'react'
import { Link } from 'react-router-dom'
import withAuth from './WithAuth'

const LandingPage = (props) => {
    const { darkMode } = props
    return (
        <div className='mt-5'>

            <h1 style={{ padding: "30px 30px 10px" }}>Welcome to an assortment of TWD CRUD apps!</h1>
            <div className={darkMode ? "contentDark mb-3" : "content mb-3"}>
                <h3>What is CRUD?</h3>
                <h5>CRUD stands for create, read, upate, delete. </h5>
                <h6>Users will be able to create, read, update and delete objects from a database.</h6>
            </div>
            <div className="landingPage">
                <div className={darkMode ? "projectsDark mx-auto" : "projects mx-auto"}>
                    <div className={darkMode ? "contentDark mb-3" : "content mb-3"}>
                        <Link to={"/bookClub"}><h3>Book Club</h3></Link>
                        <p>Built with: Mongoose, Express, React, Node, Socket.IO, RESTful API, Bootstrap</p>
                        <p>Features: real-time CRUD, many to many relationships, reg/login, protected routes, dark mode, column sorting, pagination</p>
                    </div>
                    <div className={darkMode ? "contentDark mb-3" : "content mb-3"}>
                        <Link to={"/brightIdeas"}><h3>Bright Ideas</h3></Link>
                        <p>Built with: Mongoose, Express, React, Node, Socket.IO, RESTful API, Bootstrap</p>
                        <p>Features: real-time CRUD, many to many relationships, reg/login, protected routes, dark mode, auto-sort, pagination</p>
                    </div>
                </div>
            </div>
            <br />
            <br />
        </div>
    )
}

export default withAuth(LandingPage)
