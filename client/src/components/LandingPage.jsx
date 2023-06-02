import React from 'react'
import { Link } from 'react-router-dom'

const LandingPage = (props) => {
    const { darkMode } = props
    return (
        <div className='mt-5'>
            <br />
            <br />
            <br />
            <h1>Welcome to an assortment of TWD CRUD apps!</h1>
            <div className={darkMode ? "section projectsDark" : "section projects"} id="projects">
                <div className={darkMode ? "contentDark mb-3" : "content mb-3"}>
                    <Link to={"/bookClub"}><h3>Book Club</h3></Link>
                    <p>Built with: Mongoose, Express, React, Node, Bootstrap</p>
                    <p>Features: CRUD, reg/login, protected routes, dark mode, table sorting by column, many to many relationships</p>
                </div>
                <div className={darkMode ? "contentDark mb-3" : "content mb-3"}>
                    <Link to={"/brightIdeas"}><h3>Bright Ideas</h3></Link>
                    <p>Built with: Mongoose, Express, React, Node, Bootstrap</p>
                    <p>Features: CRUD, reg/login, protected routes, dark mode, auto-sort, many to many relationships</p>
                </div>
            </div>
            <br />
            <br />
            <br />
        </div>
    )
}

export default LandingPage