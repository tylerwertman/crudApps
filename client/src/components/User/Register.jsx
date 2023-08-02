import React, { useState, useContext } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import axios from 'axios'
import CookiePopup from '../CookiePopup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons'
import Cookies from 'js-cookie'
import jwtdecode from 'jwt-decode'
import { crudAppsContext } from '../../App'

const Register = (props) => {
    const { setUser } = useContext(crudAppsContext)
    const { setPreviousLocation } = props
    const navigate = useNavigate()
    const location = useLocation()
    const [errors, setErrors] = useState({})
    const [passwordIsVisible, setPasswordIsVisible] = useState({
        reg: false,
        confirm: false
    })
    const [userInfoReg, setUserInfoReg] = useState({
        name: "",
        displayName: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const regChange = (e) => {
        setUserInfoReg({
            ...userInfoReg,
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
                navigate('/landing')
                setPreviousLocation(location)
                setUser(jwtdecode(Cookies.get('userToken')))
            })
            .catch(err => {
                console.log(`reg errer`, err)
                setErrors({
                    regErr: err.response?.data
                })
            })
    }

    return (
        <div className='row col-sm-6 mx-auto mt-5 px-2'>
            <br />
            <CookiePopup />
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
                    <button type="submit" className='btn btn-success mt-3 mb-3'>Register</button>
                </div>
                <Link to="/login">Have an account? Login!</Link>
            </form>
        </div>
    )
}

export default Register