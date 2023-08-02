import React, { useEffect, useContext } from 'react'
import Cookies from 'js-cookie'
import sunDSG from './images/FontAwesome-Icons/sun-regular-DSG.svg'
import moonLG from './images/FontAwesome-Icons/moon-regular-LG.svg'
import { crudAppsContext } from '../App'

const DarkMode = (props) => {
    const { darkMode } = useContext(crudAppsContext)
    const { setDarkMode } = props

    useEffect(() => {
        if (Cookies.get('darkMode') === undefined) Cookies.set('darkMode', false.toString(), { expires: 7 })

        const darkModeCookie = Cookies.get('darkMode');
        // console.log(darkModeCookie, darkMode)
        setDarkMode(darkModeCookie === "true");

        if (darkModeCookie === "false") document.body.classList.add('change')
        else document.body.classList.remove('change')

        // if (darkModeCookie === "true") document.body.style.background = 'rgb(33, 37, 41)';
        // else document.body.style.background = 'white';
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Cookies.get('userToken')])

    const colorToggle = () => {
        const updatedDarkMode = !darkMode;
        setDarkMode(updatedDarkMode);
        Cookies.set('darkMode', updatedDarkMode.toString(), { expires: 7 });

        if (!updatedDarkMode) document.body.classList.add('change')
        else document.body.classList.remove('change')

        // if (updatedDarkMode) document.body.style.background = 'rgb(33, 37, 41)';
        // else document.body.style.background = 'white';

    }
    return (
        <button data-tooltip-id="darkmode" data-tooltip-content={darkMode ? "Light Mode" : "Dark Mode"} className={darkMode ? "darkmodeL" : "darkmodeD"} onClick={colorToggle}>{darkMode ? <img src={sunDSG} alt="sun" width={"20px"} /> : <img src={moonLG} alt="moon" width={"20px"} />}</button>
    )
}

export default DarkMode