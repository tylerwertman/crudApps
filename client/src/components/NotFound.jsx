import React, { useContext } from 'react'
import missing from './images/404.png'
import missingDark from './images/404Dark.png'
import { crudAppsContext } from '../App'

const NotFound = () => {
    const { darkMode } = useContext(crudAppsContext)
    return (
        <div style={{ marginTop: "60px" }}>
            <img alt="404 Not Found" src={darkMode ? missingDark : missing} />
        </div>
    )
}

export default NotFound