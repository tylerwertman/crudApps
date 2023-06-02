import React from 'react';
import RegLog from './RegLog';
import Cookies from 'js-cookie';


const withAuth = (Component) => {

    const cookieValue = Cookies.get('userToken');

    let isAuthenticated

    if (cookieValue) {
        isAuthenticated = true
    } else {
        isAuthenticated = false
    }

    return class extends React.Component {
        render() {
            if (isAuthenticated) {
                return <Component {...this.props} />;
            } else {
                return <RegLog />;
            }
        }
    };
};

export default withAuth;
