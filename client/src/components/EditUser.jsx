import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import withAuth from './WithAuth'
import { toast } from 'react-toastify'
import jwtdecode from 'jwt-decode'
// import Cookies from 'js-cookie'

const EditUser = (props) => {
    const { darkMode, setWelcome, cookieValue, setCount, count } = props
    const { id } = useParams()
    const navigate = useNavigate()
    const [oneUser, setOneUser] = useState({})
    const [errors, setErrors] = useState({})
    const [selectedFile, setSelectedFile] = useState(null);
    // const [userInfoEdit, setUserInfoEdit] = useState({
    //     name: "",
    //     displayName: "",
    //     email: "",
    //     password: ""
    // })
    const toastEdit = () => toast.success(`✏️ You edited ${oneUser.user}`, {
        position: "bottom-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: darkMode ? "dark" : "light"
    })

    useEffect(() => {
        axios.get(`http://localhost:8000/api/users/${id}`)
            .then(res => {
                // console.log(res.data.user)
                setOneUser(res.data.user)
                // window.location.reload()
            })
            .catch(err => console.log(err))
        // eslint-disable-next-line
    }, [])

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

            await axios.patch(`http://localhost:8000/api/users/${id}/addProfilePicture`, { profilePicture: uploadedPhotoUrl })

            navigate(`/users/${id}`)
            setCount(count + 1)
            console.log("Successfully updated profile picture!")
        } catch (error) {
            console.error('Error uploading file:', error)
            window.alert("Error uploading profile picture. Please make sure it is an image type of .PNG, .JPG, or .JPEG and below 3MB")
        }
    }


    // const handleEdit = (e) => {
    //     setUserInfoEdit({
    //         ...userInfoEdit,
    //         [e.target.name]: e.target.value
    //     })
    // }

    // const editUser = (e) => {
    //     e.preventDefault()
    //     axios.patch(`http://localhost:8000/api/users/${id}`, userInfoEdit)
    //         .then(res => {
    //             navigate(`/users/${id}`)
    //             setWelcome(jwtdecode(cookieValue).name + " (@" + jwtdecode(cookieValue).displayName + ")")
    //             setCount(count + 1)
    //             toastEdit()
    //         })
    //         .catch(err => {
    //             setErrors({
    //                 name: err.response.data.errors?.name,
    //                 displayName: err.response.data.errors?.displayName,
    //                 email: err.response.data.errors?.email,
    //                 password: err.response.data.errors?.password,
    //                 confirmPassword: err.response.data.errors?.confirmPassword,
    //                 emailMsg: err.response.data.emailMsg,
    //                 displayNameMsg: err.response.data.displayNameMsg,
    //                 validationErrors: err.response.data.validationErrors

    //             })
    //             console.log(err)
    //         })
    // }


    return (
        <div className='mt-5'>
            <h1>Edit User Details</h1>
            {/* <form className="col-md-6 mx-auto" onSubmit={editUser}>
                <h3>Edit</h3>
                {errors.validationErrors ? <p className="text-danger">{errors.validationErrors[0]}</p> : null}
                {errors.validationErrors ? <p className="text-danger">{errors.validationErrors[1]}</p> : null}
                {errors.validationErrors ? <p className="text-danger">{errors.validationErrors[2]}</p> : null}
                {errors.validationErrors ? <p className="text-danger">{errors.validationErrors[3]}</p> : null}
                {errors?.name ? <p className="text-danger">{errors?.name.message}</p> : null}
                <div className="form-floating mb-3">
                    <input type="text" className="form-control custom-input" name="name" value={userInfoEdit.name} onChange={handleEdit} placeholder='Name' />
                    <label className='form-label'>Name</label>
                </div>
                {errors?.displayNameMsg ? <p className="text-danger">{errors?.displayNameMsg}</p> : null}
                {errors?.displayName ? <p className="text-danger">{errors?.displayName.message}</p> : null}
                <div className="form-floating mb-3">
                    <input type="text" className="form-control custom-input" name="displayName" value={userInfoEdit.displayName} onChange={handleEdit} placeholder='Display Name' />
                    <label className='form-label'>Display Name</label>
                </div>
                {errors?.emailMsg ? <p className="text-danger">{errors?.emailMsg}</p> : null}
                {errors?.email ? <p className="text-danger">{errors?.email.message}</p> : null}
                <div className="form-floating mb-3">
                    <input type="email" className="form-control custom-input" name="email" value={userInfoEdit.email} onChange={handleEdit} placeholder='Email' />
                    <label className='form-label'>Email</label>
                </div>
                {errors?.password ? <p className="text-danger">{errors?.password.message}</p> : null}
                <div className="form-floating mb-3">
                    <input type="password" className="form-control custom-input" name="password" value={userInfoEdit.password} onChange={handleEdit} placeholder='Password' />
                    <label className='form-label'>Password</label>
                </div>
                {errors?.confirmPassword ? <p className="text-danger">{errors?.confirmPassword.message}</p> : null}
                <div className="form-floating mb-3">
                    <input type="password" className="form-control custom-input" name="confirmPassword" value={userInfoEdit.confirmPassword} onChange={handleEdit} placeholder='Confirm Password' />
                    <label className='form-label'>Confirm Password</label>
                </div>
                <div className="form-group">
                    <button type="submit" className='btn btn-success mb-3'>Confirm</button>
                </div>
            </form> */}
            <div className='col-4 mx-auto'>
                <h2>Upload a profile picture</h2>
                <div className="input-group mb-3">
                    <input className="form-control custom-input" type="file" id="formFile" onChange={handleFileSelect} />
                    <button type="button" className="btn btn-success" disabled={!selectedFile} onClick={handleFileUpload}>Upload</button>
                </div>
            </div>
        </div>
    )
}

export default withAuth(EditUser)