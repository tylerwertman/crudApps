
import React from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom'


const WithAuth = (Component) => {
    const WithAuthComponent = (props) => {
        const navigate = useNavigate();

        // const { darkMode } = props;
        const cookieValue = Cookies.get('userToken');
        console.log(cookieValue)

        let isAuthenticated

        if (cookieValue) {
            isAuthenticated = true
        } else {
            isAuthenticated = false
        }
        if (isAuthenticated) {
            return <Component {...props} />;
        } else {
            navigate("/")
        }
    };

    return WithAuthComponent;
};

export default WithAuth;
