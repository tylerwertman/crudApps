import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import withAuth from '../WithAuth'
import { toast } from 'react-toastify'
import { crudAppsContext } from '../../App'


const EditBook = () => {
    const { AxiosURL } = useContext(crudAppsContext)
    const { id } = useParams()
    const navigate = useNavigate()
    const [oneBook, setOneBook] = useState({})
    const [errors, setErrors] = useState({})

    const toastEdit = () => toast.success(`✏️ You edited ${oneBook.title}`, { toastId: 1 })

    useEffect(() => {
        axios.get(`${AxiosURL}/books/${id}`)
            .then(res => {
                // console.log(res.data.book)
                setOneBook(res.data.book)
            })
            .catch(err => console.log(err))
        // eslint-disable-next-line
    }, [])


    const editBook = (e) => {
        e.preventDefault()
        axios.put(`${AxiosURL}/books/${id}`, oneBook)
            .then(res => {
                navigate(`/books/${id}`)
                toastEdit()
            })
            .catch(err => {
                setErrors({
                    title: err.response.data.error.errors.title,
                    author: err.response.data.error.errors.author
                })
                console.log(errors)
            })

    }

    const handleChange = (e) => {
        setOneBook({
            ...oneBook,
            [e.target.name]: e.target.value
        })
    }



    return (
        <div className='mt-5 mx-auto'>
            <br />
            <h1>Edit Book Details</h1>
            <form action="" className='col-md-6 mx-auto' onSubmit={editBook}>
                {oneBook.title?.length < 2 ? <p className="text-danger">Title must be at least 2 characters</p> : null}
                {errors.title ? <p className="text-danger">{errors.title.message}</p> : null}
                <div className="formgroup">
                    <label htmlFor="name">Book Name: </label>
                    <input type="text" className="form-control" name="title" id="title" value={oneBook.title} onChange={handleChange} />
                </div>
                {oneBook.author?.length < 2 ? <p className="text-danger">Author must be at least 2 characters</p> : null}
                {errors.author ? <p className="text-danger">{errors.author.message}</p> : null}
                <div className="formgroup">
                    <label htmlFor="name">Book Author: </label>
                    <input type="text" className="form-control" name="author" id="author" value={oneBook.author} onChange={handleChange} />
                </div>
                <button className='btn btn-info mt-3'>Edit Book</button>
            </form>
        </div>
    )
}

export default withAuth(EditBook)