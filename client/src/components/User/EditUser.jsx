import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import WithAuth2 from '../WithAuth2'
import { toast } from 'react-toastify'
import jwtdecode from 'jwt-decode'
import Cookies from 'js-cookie'
import { crudAppsContext } from '../../App'


const EditUser = () => {
    const { setUser, count, setCount } = useContext(crudAppsContext)
    const { id } = useParams()
    const navigate = useNavigate()
    const [oneUser, setOneUser] = useState({})
    const [errors, setErrors] = useState({})
    const [selectedFile, setSelectedFile] = useState(null)
    const cookieValue = Cookies.get('userToken')
    const [userInfoEdit, setUserInfoEdit] = useState({
        name: oneUser.name,
        displayName: oneUser.displayName,
        email: oneUser.email
    })
    const [userPasswordEdit, setUserPasswordEdit] = useState({
        password: "",
        confirmPassword: ""
    })
    const toastEdit = () => toast.success(`✏️ Successfully edited account`, { toastId: 1 })

    useEffect(() => {
        axios.get(`http://localhost:8000/api/users/${id}`)
            .then(res => {
                // console.log(res.data.user)
                setOneUser(res.data.user)
                // window.location.reload()
            })
            .catch(err => console.log(err))
        // eslint-disable-next-line
    }, [count])

    const handleFileSelect = (e) => {
        e.preventDefault()
        const formData = new FormData()
        const filename = jwtdecode(cookieValue).displayName + '-' + Date.now() + '-' + e.target.files[0].name
        formData.append('photo', e.target.files[0], filename)
        setSelectedFile(formData)
    }

    const handleFileUpload = async () => {
        try {
            const uploadResponse = await axios.post('http://localhost:8000/api/save', selectedFile)
            const uploadedPhotoUrl = `http://localhost:8000/uploads/${uploadResponse.data.photo}`
            await axios.patch(`http://localhost:8000/api/users/${id}/addProfilePicture`, { profilePicture: uploadedPhotoUrl }, { headers: { 'Authorization': `${cookieValue}` } })
            navigate(`/users/${id}`)
            setCount(count + 1)
            console.log("Successfully updated profile picture!")
        } catch (error) {
            if (error.response?.status === 403) {
                window.alert("You can not edit another user's profile!")
            } else {
                console.error('Error uploading file:', error)
                window.alert("Error uploading profile picture. Please make sure it is an image type of .PNG, .JPG, or .JPEG and below 3MB.")
            }
        }
    }


    const handleEditChange = (e) => {
        setUserInfoEdit({
            ...userInfoEdit,
            [e.target.name]: e.target.value
        })
        setUserPasswordEdit({
            ...userPasswordEdit,
            [e.target.name]: e.target.value
        })
    }

    const editUserInfo = (e) => {
        e.preventDefault()
        if (userInfoEdit.name || userInfoEdit.displayName || userInfoEdit.email) {
            axios.patch(`http://localhost:8000/api/users/${id}/info`, userInfoEdit, { headers: { 'Authorization': `${cookieValue}` } })
                .then(res => {
                    navigate(`/users/${id}`)
                    toastEdit()
                    setUser(jwtdecode(Cookies.get('userToken')))
                    setCount(count + 1)
                })
                .catch(err => {
                    if (err.response?.status === 403) {
                        window.alert("You can not edit another user's profile!")
                        navigate(`/users/${id}`)
                    }
                    setErrors({
                        name: err.response?.data.error?.errors?.name,
                        displayName: err.response?.data.error?.errors?.displayName,
                        email: err.response?.data.error?.errors?.email,
                        emailMsg: err.response?.data?.emailMsg,
                        displayNameMsg: err.response?.data?.displayNameMsg,
                        validationErrors: err.response?.data?.validationErrors,
                        typErrors: err.response?.data?.typeErrors,
                        duplicate: err.response?.data?.error?.codeName
                    })
                    console.log("editUserInfo", err)
                })
        } else {
            window.alert("Can not submit empty form")
        }
    }

    const editUserPassword = (e) => {
        e.preventDefault()
        if (userPasswordEdit.password === userPasswordEdit.confirmPassword && userPasswordEdit.password.length > 7) {
            axios.patch(`http://localhost:8000/api/users/${id}/password`, userPasswordEdit, { headers: { 'Authorization': `${cookieValue}` } })
                .then((res) => {
                    navigate(`/users/${id}`)
                    setCount(count + 1)
                    toastEdit()
                })
                .catch((err) => {
                    if (err.response?.status === 403) {
                        window.alert("You cannot edit another user's profile!")
                        navigate(`/users/${id}`)
                    }
                    setErrors({
                        password: err.response.data.errors?.password,
                        confirmPassword: err.response.data.errors?.confirmPassword,
                        validationErrors: err.response.data?.validationErrors,
                        typeErrors: err.response.data?.typeErrors
                    })
                    console.log(err)
                })
        } else {
            setErrors({
                password: "Password must be 8 characters",
                confirmPassword: "Confirm password must match password"
            })
        }
    }

    return (
        <div className='mb-5 px-5'>
            <h1>Edit User Details</h1>
            <form className="col-md-6 mx-auto" onSubmit={editUserInfo}>
                <h3>Edit Account Info</h3>
                {errors.validationErrors ? <p className="text-danger">{errors.validationErrors[0]}</p> : null}
                {errors.validationErrors ? <p className="text-danger">{errors.validationErrors[1]}</p> : null}
                {errors.validationErrors ? <p className="text-danger">{errors.validationErrors[2]}</p> : null}
                {errors.validationErrors ? <p className="text-danger">{errors.validationErrors[3]}</p> : null}
                {errors.duplicate ? <p className="text-danger">Email or Display Name already exists. Please choose another one.</p> : null}
                {errors?.name ? <p className="text-danger">{errors?.name.message}</p> : null}
                <div className="form-floating mb-3">
                    <input type="text" className="form-control custom-input" name="name" value={userInfoEdit.name} onChange={handleEditChange} placeholder='Name' />
                    <label className='form-label'>Name</label>
                </div>
                {errors?.displayNameMsg ? <p className="text-danger">{errors?.displayNameMsg}</p> : null}
                {errors?.displayName ? <p className="text-danger">{errors?.displayName.message}</p> : null}
                <div className="form-floating mb-3">
                    <input type="text" className="form-control custom-input" name="displayName" value={userInfoEdit.displayName} onChange={handleEditChange} placeholder='Display Name' />
                    <label className='form-label'>Display Name</label>
                </div>
                {errors?.emailMsg ? <p className="text-danger">{errors?.emailMsg}</p> : null}
                {errors?.email ? <p className="text-danger">{errors?.email.message}</p> : null}
                <div className="form-floating mb-3">
                    <input type="email" className="form-control custom-input" name="email" value={userInfoEdit.email} onChange={handleEditChange} placeholder='Email' />
                    <label className='form-label'>Email</label>
                </div>
                <div className="form-group">
                    <button type="submit" className='btn btn-success mb-5'>Confirm</button>
                </div>
            </form>
            <form className="col-md-6 mx-auto" onSubmit={editUserPassword}>
                <h3>Edit Password</h3>
                {errors.validationErrors ? <p className="text-danger">{errors.validationErrors[0]}</p> : null}
                {errors.validationErrors ? <p className="text-danger">{errors.validationErrors[1]}</p> : null}
                {errors.validationErrors ? <p className="text-danger">{errors.validationErrors[2]}</p> : null}
                {errors.validationErrors ? <p className="text-danger">{errors.validationErrors[3]}</p> : null}
                {errors?.name ? <p className="text-danger">{errors?.name.message}</p> : null}
                {errors?.password ? <p className="text-danger">{errors?.password}</p> : null}
                <div className="form-floating mb-3">
                    <input type="password" className="form-control custom-input" name="password" value={userPasswordEdit.password} onChange={handleEditChange} placeholder='Password' />
                    <label className='form-label'>Password</label>
                </div>
                {errors?.confirmPassword ? <p className="text-danger">{errors?.confirmPassword}</p> : null}
                <div className="form-floating mb-3">
                    <input type="password" className="form-control custom-input" name="confirmPassword" value={userPasswordEdit.confirmPassword} onChange={handleEditChange} placeholder='Confirm Password' />
                    <label className='form-label'>Confirm Password</label>
                </div>
                <div className="form-group">
                    <button type="submit" className='btn btn-success mb-5'>Confirm</button>
                </div>
            </form>
            <div className='col mx-auto'>
                <h3>Upload a profile picture</h3>
                <div className="input-group">
                    <input style={{ marginBottom: "60px" }} type="file" className="form-control custom-input" id="formFile" onChange={handleFileSelect} />
                    <button style={{ marginBottom: "60px" }} type="button" className="btn btn-success" disabled={!selectedFile} onClick={handleFileUpload}>Upload</button>
                </div>
            </div>
        </div>
    )
}

export default WithAuth2(EditUser)