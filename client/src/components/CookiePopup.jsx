import React, { useState, useEffect } from 'react'

const CookiePopup = () => {
    const [showCookiePopup, setShowCookiePopup] = useState(false)

    useEffect(()=> {
        setTimeout(() => setShowCookiePopup(true), 3500)
    }, [])

    return (
        <div className='content mt-5 popup mx-auto' style={{ bottom: "15%", color: "white", display: showCookiePopup ? "block" : "none" }}>
            <p>This website requires the use of cookies to store login info and dark mode preference!</p>
            <button className="btn btn-success" onClick={() => setShowCookiePopup(false)}>OK</button>&nbsp;&nbsp;
        </div>
    )
}

export default CookiePopup