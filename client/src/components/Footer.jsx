import React, { useContext } from 'react'
import { crudAppsContext } from '../App'

const Footer = () => {
    const { darkMode } = useContext(crudAppsContext)

    return (
        <footer className={darkMode ? "footerDark" : "footerLight"}>
            <a href="https://tylerw.xyz">© 2023 Tyler Wertman Developments</a>
        </footer>
    )
}

export default Footer