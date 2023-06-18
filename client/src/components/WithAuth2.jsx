
import React, {useState, useEffect} from 'react'
import Cookies from 'js-cookie'
import { useNavigate, useParams } from 'react-router-dom'
import jwtdecode from 'jwt-decode'
import axios from 'axios'

const WithAuth2 = (Component) => {
    const WithAuthComponent = (props) => {
        const [oneUser, setOneUser] = useState({})
        const { id } = useParams()
        const navigate = useNavigate()
        const cookieValue = Cookies.get('userToken')

        useEffect(() => {
            axios.get(`http://localhost:8000/api/users/${id}`)
                .then(res => {
                    setOneUser(res.data.user)
                })
                .catch(err => console.log(err))
            // eslint-disable-next-line
        }, [])

        let isAuthenticated
        if (jwtdecode(cookieValue)._id === oneUser._id) {
            isAuthenticated = true
        } else {
            isAuthenticated = false
        }
        if (isAuthenticated) {
            return <Component {...props} />
        } else {
            navigate(`/users/${id}`)
        }
    }

    return WithAuthComponent
}

export default WithAuth2
