import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import CookiePopup from '../CookiePopup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons'

const Login = (props) => {
    const { count, setCount, darkMode } = props
    const navigate = useNavigate()
    const [errors, setErrors] = useState({})
    const [passwordIsVisible, setPasswordIsVisible] = useState({
        log: false,
    })

    const [userInfoLog, setUserInfoLog] = useState({
        email: "",
        password: ""
    })

    const logChange = (e) => {
        setUserInfoLog({
            ...userInfoLog,
            [e.target.name]: e.target.value
        })
    }

    const passwordToggle = (inputName) => {
        setPasswordIsVisible((prevState) => ({
            ...prevState,
            [inputName]: !prevState[inputName],
        }))
    }

    const logSubmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:8000/api/users/login', userInfoLog, { withCredentials: true })
            .then(res => {
                setCount(count + 1) //update nav username & logout button
                navigate('/landing')
                window.location.reload()
            })
            .catch(err => {
                console.log(`login errer`, err)
                setErrors({
                    logErr: err.response?.data?.logErrMsg
                })
            })
    }

    return (
        <div className='row col-sm-6 mx-auto mt-5 px-2'>
            <br />
            <CookiePopup darkMode={darkMode} />
            <form className="regLog" onSubmit={logSubmit}>
                <h3>Login</h3>
                {errors.logErr ? <p className="text-danger">{errors.logErr}</p> : null}
                <div className="form-group">
                    <label className='form-label'>Email</label>
                    <input type="email" className="form-control" name="email" value={userInfoLog.email} onChange={logChange} />
                </div>
                <div>
                    <label className='form-label'>Password</label>
                    {errors?.logErr?.errors?.password ? <p className="text-danger">{errors?.logErr.errors.password.message}</p> : null}
                    <div className="input-group mb-3">
                        <input type={passwordIsVisible.log ? "text" : "password"} className="form-control" name="password" value={userInfoLog.password} onChange={logChange} />
                        <span className="input-group-text">
                            {
                                passwordIsVisible.log ?
                                    <FontAwesomeIcon icon={faEye} style={{ color: "lightgrey" }} name="log" onClick={() => passwordToggle("log")} />
                                    :
                                    <FontAwesomeIcon icon={faEyeSlash} style={{ color: "lightgrey" }} name="log" onClick={() => passwordToggle("log")} />
                            }
                        </span>
                    </div>
                </div>
                <div className="form-group">
                    <button type="submit" className='btn btn-success mt-3 mb-3'>Login</button>
                </div>
                <Link to="/">Need an account? Register!</Link>
            </form>
        </div>
    ) 
}

export default Login