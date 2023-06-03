import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useNavigate, Link } from 'react-router-dom'
import withAuth from './WithAuth'
import { toast } from 'react-toastify';


const BookDetail = (props) => {
    const { welcome, user, darkMode } = props
    const { id } = useParams()
    const navigate = useNavigate();
    const [oneBook, setOneBook] = useState({})
    const bookFavByContainsLoggedInUser = oneBook.favoritedBy ? oneBook.favoritedBy.some(bookObj => bookObj._id === user._id) : false;
    const toastFav = () => toast.success(`💚 You favorited ${oneBook.title}`, {
        position: "bottom-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: darkMode ? "dark" : "light"
    });
    const toastUnfav = () => toast.error(`🚫 You unfavorited ${oneBook.title}`, {
        position: "bottom-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: darkMode ? "dark" : "light"
    });
    const toastDelete = () => toast.error(`🗑 You deleted ${oneBook.title}`, {
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
        axios.get(`http://localhost:8000/api/books/${id}`)
            .then(res => {
                setOneBook(res.data.book)
                console.log(res.data.book._id)
            })
            .catch(err => console.log(err))

        // eslint-disable-next-line
    }, []);

    const removeBook = () => {
        axios.delete(`http://localhost:8000/api/books/${id}`)
            .then(res => {
                navigate("/bookClub")
                toastDelete()
            })
            .catch(err => console.log(err))

    }

    const editBook = (e) => {
        navigate(`/books/${id}/edit`)
    }

    const favoriteBook = () => {
        axios.post(`http://localhost:8000/api/books/${id}/favorite`, {}, { withCredentials: true })
            .then(res => {
                setOneBook(res.data.book)
                toastFav()
            })
            .catch(err => console.log(`FAV error`, err))
    }

    const unfavoriteBook = () => {
        if (!bookFavByContainsLoggedInUser) return
        axios.post(`http://localhost:8000/api/books/${id}/unfavorite`, {}, { withCredentials: true })
            .then(res => {
                setOneBook(res.data.book)
                toastUnfav()
            })
            .catch(err => console.log(`UNfav error`, err))

    }

    return (
        <div className='mt-5'>
            <h1>Book Details</h1>

            <button className="btn btn-primary" onClick={() => (navigate('/bookClub'))}>Book Club</button>&nbsp;&nbsp;
            { // fav/unfav
                bookFavByContainsLoggedInUser
                    ? <><button className="btn btn-danger" onClick={unfavoriteBook}>Unfavorite Book</button>&nbsp;&nbsp;</>
                    : <><button className="btn btn-success" onClick={favoriteBook}>Favorite Book</button>&nbsp;&nbsp;</>
            }
            { // edit
                (welcome === (oneBook?.addedBy?.name + " (@" + oneBook?.addedBy?.displayName + ")")) ? <><button className='btn btn-warning' onClick={editBook}>Edit Book</button>&nbsp;&nbsp;</> : null
            }
            { // delete
                (welcome === (oneBook?.addedBy?.name + " (@" + oneBook?.addedBy?.displayName + ")") || user?.email === "t@w.com") ? <><button className={darkMode ? "btn btn-danger" : "btn btn-dark"} onClick={removeBook}>Delete Book</button>&nbsp;&nbsp;</> : null
            }

            <br />
            <h2>Book Title: {oneBook?.title}</h2>
            <h3>Book Author: {oneBook?.author}</h3>
            <h4><a href={`https://www.google.com/search?q=${oneBook?.title} by ${oneBook?.author}`} target='_blank' rel="noreferrer">Find this book online</a></h4>
            <h4 style={{ display: "inline" }}>Added by: </h4> {oneBook?.addedBy?.name ? <h4 style={{ display: "inline" }}><Link to={`/users/${oneBook?.addedBy?._id}`}>{oneBook?.addedBy?.name} (@{oneBook?.addedBy?.displayName})</Link></h4> : <h4 style={{ display: "inline" }}>Deleted User</h4>}
            <h6>Added on: {new Date(oneBook?.createdAt).toLocaleString()}</h6>
            <h6>Last Updated on: {new Date(oneBook?.updatedAt).toLocaleString()}</h6>
            <h4>Favorited By:</h4>
            {
                oneBook.favoritedBy?.map((booksFavedBy, i) => {
                    return <h5 key={i}><Link to={`/users/${booksFavedBy?._id}`}>{booksFavedBy.name} (@{booksFavedBy.displayName})</Link></h5>
                })
            }
        </div>
    )
}

export default withAuth(BookDetail)