import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import CookiePopup from '../CookiePopup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons'

const Reglog = (props) => {
    const { setLoggedIn, count, setCount, darkMode } = props
    const navigate = useNavigate()
    const [errors, setErrors] = useState({})
    const [passwordIsVisible, setPasswordIsVisible] = useState({
        reg: false,
        log: false,
        confirm: false
    })
    const [userInfoReg, setUserInfoReg] = useState({
        name: "",
        displayName: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [userInfoLog, setUserInfoLog] = useState({
        email: "",
        password: ""
    })
    const regChange = (e) => {
        setUserInfoReg({
            ...userInfoReg,
            [e.target.name]: e.target.value
        })
    }
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

    const regSubmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:8000/api/users/register', userInfoReg, { withCredentials: true })
            .then(res => {
                // console.log(res)
                setCount(count + 1) //update nav username & logout button
                navigate('/landing')
                setLoggedIn(true)
                window.location.reload()

            })
            .catch(err => {
                console.log(`reg errer`, err)
                setErrors({
                    regErr: err.response?.data
                })
            })
    }

    const logSubmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:8000/api/users/login', userInfoLog, { withCredentials: true })
            .then(res => {
                setCount(count + 1) //update nav username & logout button
                navigate('/landing')
                setLoggedIn(true)
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
        <div className='row col-lg-6 mx-auto mt-5'>
            <br />
            <CookiePopup darkMode={darkMode} />

            <div className='col'>
                <form className="regLog" onSubmit={regSubmit}>
                    <h3>Register</h3>
                    <div className="form-group">
                        <label className='form-label'>Name</label>
                        {errors?.regErr?.errors?.name ? <p className="text-danger">{errors?.regErr.errors.name.message}</p> : null}
                        <input type="text" className="form-control" name="name" value={userInfoReg.name} onChange={regChange} />
                    </div>
                    <div className="form-group">
                        <label className='form-label'>Display Name</label>
                        {errors?.regErr ? <p className="text-danger">{errors?.regErr.displayNameMsg}</p> : null}
                        {errors?.regErr?.errors?.displayName ? <p className="text-danger">{errors?.regErr.errors.displayName.message}</p> : null}
                        <input type="text" className="form-control" name="displayName" value={userInfoReg.displayName} onChange={regChange} />
                    </div>
                    <div className="form-group">
                        <label className='form-label'>Email</label>
                        {errors?.regErr ? <p className="text-danger">{errors?.regErr.emailMsg}</p> : null}
                        {errors?.regErr?.errors?.email ? <p className="text-danger">{errors?.regErr.errors.email.message}</p> : null}
                        <input type="email" className="form-control" name="email" value={userInfoReg.email} onChange={regChange} />
                    </div>
                    <div>
                        <label className='form-label'>Password</label>
                        {errors?.regErr?.errors?.password ? <p className="text-danger">{errors?.regErr.errors.password.message}</p> : null}
                        <div className="input-group mb-3">
                            <input type={passwordIsVisible.reg ? "text" : "password"} className="form-control" name="password" value={userInfoReg.password} onChange={regChange} />
                            <span className="input-group-text">
                                {
                                    passwordIsVisible.reg ?
                                        <FontAwesomeIcon icon={faEye} style={{ color: "lightgrey" }} name="reg" onClick={() => passwordToggle("reg")} />
                                        :
                                        <FontAwesomeIcon icon={faEyeSlash} style={{ color: "lightgrey" }} name="reg" onClick={() => passwordToggle("reg")} />
                                }
                            </span>
                        </div>
                    </div>
                    <div>
                        <label className='form-label'>Confirm Password</label>
                        {errors?.regErr?.errors?.confirmPassword ? <p className="text-danger">{errors?.regErr.errors.confirmPassword.message}</p> : null}
                        <div className="input-group mb-3">
                            <input type={passwordIsVisible.confirm ? "text" : "password"} className="form-control" name="confirmPassword" value={userInfoReg.confirmPassword} onChange={regChange} />
                            <span className="input-group-text">
                                {
                                    passwordIsVisible.confirm ?
                                        <FontAwesomeIcon icon={faEye} style={{ color: "lightgrey" }} name="confirm" onClick={() => passwordToggle("confirm")} />
                                        :
                                        <FontAwesomeIcon icon={faEyeSlash} style={{ color: "lightgrey" }} name="confirm" onClick={() => passwordToggle("confirm")} />
                                }
                            </span>
                        </div>
                    </div>
                    <div className="form-group">
                        <button type="submit" className='btn btn-success mt-3'>Register</button>
                    </div>
                </form>
            </div>
            <div className='col'>
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
                        <button type="submit" className='btn btn-success mt-3'>Login</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Reglog