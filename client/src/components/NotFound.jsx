import React from 'react'
import missing from './images/404.png'

const NotFound = () => {
    return (
        <div style={{ marginTop: "60px" }}>
            <img alt="404 Not Found" src={missing} />
        </div>
    )
}

export default NotFound