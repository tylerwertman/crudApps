import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import withAuth from './WithAuth'
import { toast } from 'react-toastify';


const EditIdea = (props) => {
    const { darkMode } = props

    const { id } = useParams()
    const navigate = useNavigate()
    const [oneIdea, setOneIdea] = useState({})
    const [errors, setErrors] = useState({})

    const toastEdit = () => toast.success(`✏️ You edited ${oneIdea.idea}`, {
        position: "bottom-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: darkMode ? "dark" : "light"
    });

    useEffect(() => {
        axios.get(`http://localhost:8000/api/ideas/${id}`)
            .then(res => {
                // console.log(res.data.idea)
                setOneIdea(res.data.idea)
            })
            .catch(err => console.log(err))
        // eslint-disable-next-line
    }, []);


    const editIdea = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:8000/api/ideas/${id}`, oneIdea)
            .then(res => {
                navigate(`/ideas/${id}`)
                toastEdit()
            })
            .catch(err => {
                setErrors({
                    idea: err.response.data.error.errors.idea,
                })
                console.log(errors)
            })

    }

    const handleChange = (e) => {
        setOneIdea({
            ...oneIdea,
            [e.target.name]: e.target.value
        })
    }



    return (
        <div className='mt-5'>
            <br />
            <h1>Edit Idea Details</h1>
            <form action="" className='col-md-6 mx-auto' onSubmit={editIdea}>
                {oneIdea.idea?.length < 2 ? <p className="text-danger">FE: Title must be at least 2 characters</p> : null}
                {errors.idea ? <p className="text-danger">{errors.idea.message}</p> : null}
                <div className="formgroup">
                    <label htmlFor="name">Idea Name: </label>
                    <input type="text" className="form-control" name="idea" id="idea" value={oneIdea.idea} onChange={handleChange} />
                </div>
                <button className='btn btn-info mt-3'>Edit Idea</button>
            </form>
        </div>
    )
}

export default withAuth(EditIdea)