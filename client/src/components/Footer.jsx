import React from 'react'
const Footer = (props) => {
    const { darkMode } = props

    return (
        <footer className={darkMode ? "footerDark" : "footerLight"}>
            <a href="https://tylerw.xyz">© 2023 Tyler Wertman Developments</a>
        </footer>
    )
}

export default Footer