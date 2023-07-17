import React, { useState, useEffect } from 'react'
import axios from 'axios'
import io from 'socket.io-client'
import { Link } from 'react-router-dom'
import withAuth from './WithAuth'
import { toast } from 'react-toastify'
import jwtdecode from 'jwt-decode'


const BookClub = (props) => {
    const { count, setCount, user, welcome, darkMode, cookieValue } = props
    const [socket] = useState(() => io(':8000'))
    const [bookList, setBookList] = useState([])
    const [oneBook, setOneBook] = useState({ title: "", author: "" })
    const [errors, setErrors] = useState({})
    const [sortColumn, setSortColumn] = useState('')
    const [sortDirection, setSortDirection] = useState('asc')
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const [currentPage, setCurrentPage] = useState(1)
    const toastBookAdded = (book, cookieName) => toast.success(cookieName !== undefined ? `➕ You added ${book.title}`: `➕ ${book.addedByString} added ${book.title}`)
    const toastBookDeleted = (book, cookieName) => toast.error(cookieName !== undefined ? `🗑 You deleted ${book.title}`: `🗑 ${book.addedByString} deleted ${book.title}`)
    const toastBookFav = (book, cookieName) => toast.success(cookieName !== undefined ? `👍 You favorited ${book.title}` : `👍 A user favorited ${book.title}`)
    const toastBookUnfav = (book, cookieName) => toast.error(cookieName !== undefined ? `👎 You unfavorited ${book.title}` : `👍 A user favorited ${book.title}`)

    useEffect(() => {
        // console.log(welcome)
        const handleResize = () => {
            setWindowWidth(window.innerWidth)
        }
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    useEffect(() => {
        axios.get(`http://localhost:8000/api/books`)
            .then(res => {
                setBookList(res.data.book)
            })
            .catch(err => console.log(err))
    }, [count])

    useEffect(() => {
        // Event handler for 'bookAdded' event
        const handleBookAdded = (newBook) => {
            setBookList((bookList) => [newBook, ...bookList])
            toastBookAdded(newBook)
        }

        //Event handler for 'bookDeleted' event
        const handleBookDeleted = (deletedBook) => {
            setBookList((bookList) => bookList.filter((book) => book._id !== deletedBook._id))
            toastBookDeleted(deletedBook)
        }
        //Event handler for 'bookFavorited' event
        const handleBookFavorited = (favoritedBook) => {
            toastBookFav(favoritedBook)
        }
        //Event handler for 'bookUnfavorited' event
        const handleBookUnfavorited = (unfavoritedBook) => {
            toastBookUnfav(unfavoritedBook)
        }

        // Subscribe to events
        socket.on('bookAdded', handleBookAdded)
        socket.on('bookDeleted', handleBookDeleted)
        socket.on('bookFavorited', handleBookFavorited)
        socket.on('bookUnfavorited', handleBookUnfavorited)

        // Clean up the event listener on component unmount
        return () => {
            socket.off('bookAdded', handleBookAdded)
            socket.off('bookDeleted', handleBookDeleted)
            socket.off('bookFavorited', handleBookFavorited)
            socket.off('bookUnfavorited', handleBookUnfavorited)
        }
    }, [socket])

    const changeHandler = (e) => {
        setOneBook({
            ...oneBook,
            [e.target.name]: e.target.value
        })
    }

    const submitHandler = (e) => {
        e.preventDefault()
        axios.post('http://localhost:8000/api/books', oneBook, { withCredentials: true })
            .then(res => {
                setBookList([...bookList, res.data.book])
                toastBookAdded(res.data.book, jwtdecode(cookieValue).name)
                setOneBook({
                    title: "",
                    author: ""
                })
                setErrors({
                    title: "",
                    author: ""
                })
                socket.emit('bookAdded', res.data.book)
                setCount(count + 1)
                setSortColumn('createdAt')
            })
            .catch(err => {
                console.log(`submit errer`, err)
                if (err === 'AxiosError') {
                    setErrors({
                        title: err.response.data.error.errors.title,
                        author: err.response.data.error.errors.author
                    })
                }
                console.log(errors)
            })
    }

    const favoriteBook = (book) => {
        axios.post(`http://localhost:8000/api/books/${book._id}/favorite`, {}, { withCredentials: true })
            .then(res => {
                setCount(count + 1)
                toastBookFav(book, jwtdecode(cookieValue).name)
                socket.emit('bookFavorited', book)

            })
            .catch(err => console.log(`FAV error`, err))
    }

    const unfavoriteBook = (book) => {
        axios.post(`http://localhost:8000/api/books/${book._id}/unfavorite`, {}, { withCredentials: true })
            .then(res => {
                setCount(count + 1)
                toastBookUnfav(book, jwtdecode(cookieValue).name)
                socket.emit('bookUnfavorited', book)

            })
            .catch(err => console.log(`UNfav error`, err))
    }

    const removeBook = (book) => {
        axios.delete(`http://localhost:8000/api/books/${book._id}`)
            .then(res => {
                setCount(count + 1)
                toastBookDeleted(book, jwtdecode(cookieValue).name)
                socket.emit('bookDeleted', book)

            })
            .catch(err => console.log(err))
    }

    const handleSort = (column) => {
        if (column === sortColumn) {
            // If the same column is clicked again, toggle the sort direction
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            // If a different column is clicked, set it as the new sort column and reset the sort direction
            setSortColumn(column)
            setSortDirection('asc')
        }
    }

    const sortedBooks = [...bookList].sort((a, b) => {
        if (sortColumn === 'title') {
            const titleA = a.title.toLowerCase()
            const titleB = b.title.toLowerCase()
            return sortDirection === 'asc' ? titleA.localeCompare(titleB) : titleB.localeCompare(titleA)
        } else if (sortColumn === 'author') {
            const authorA = a.author.toLowerCase()
            const authorB = b.author.toLowerCase()
            return sortDirection === 'asc' ? authorA.localeCompare(authorB) : authorB.localeCompare(authorA)
        } else if (sortColumn === 'addedBy') {
            const addedByStringA = a.addedByString?.toLowerCase()
            const addedByStringB = b.addedByString?.toLowerCase()
            return sortDirection === 'asc' ? addedByStringA?.localeCompare(addedByStringB) : addedByStringB?.localeCompare(addedByStringA)
        } else if (sortColumn === 'createdAt') {
            return sortDirection === 'asc' ? new Date(a.createdAt) - new Date(b.createdAt) : new Date(b.createdAt) - new Date(a.createdAt)
        }
        return 0
    })

    // Pagination
    const itemsPerPage = 5
    const totalPages = Math.ceil(bookList.length / itemsPerPage)
    const pageNumbers = []

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
    }

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = sortedBooks.slice(indexOfFirstItem, indexOfLastItem)

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    return (
        <div>
            <br />
            <h1 className='mt-5'>Welcome to the Book Club</h1>
            <div className={darkMode ? "mainDivDark" : "mainDivLight"}>
                <div>
                    <h4>Add a new book</h4>
                    <form className={darkMode ? "col-md-4 offset-1 mx-auto text-light" : "col-md-4 offset-1 mx-auto"} onSubmit={submitHandler}>
                        {oneBook.title && oneBook.title?.length < 2 ? <p className="text-danger">Title must be at least 2 characters</p> : null}
                        {errors.title ? <p className="text-danger">{errors.title.message}</p> : null}
                        <div className="form-floating col-10 mx-auto mb-3">
                            <input type="text" className="form-control custom-input" name="title" value={oneBook.title} onChange={changeHandler} placeholder='Title' />
                            <label className='form-label'>Title</label>
                        </div>
                        {oneBook.author && oneBook.author?.length < 2 ? <p className="text-danger">Author must be at least 2 characters</p> : null}
                        {errors.author ? <p className="text-danger">{errors.author.message}</p> : null}
                        <div className="form-floating col-10 mx-auto mb-3">
                            <input type="text" className="form-control custom-input" name="author" value={oneBook.author} onChange={changeHandler} placeholder='Author' />
                            <label className='form-label'>Author</label>
                        </div>
                        <div className="form-group">
                            <button type="submit" className='btn btn-success col-10 mb-3'>Add Book</button>
                        </div>
                    </form>
                </div>
                <div>
                    <h4>All Books</h4>
                    <table className='mx-auto mb-3' style={windowWidth < "500px" ? { width: "100%" } : null}>
                        <thead>
                            <tr>
                                <th className={darkMode ? "lightText" : null} onClick={() => handleSort('title')}>Title {sortDirection === 'asc' && sortColumn === "title" ? "🔼" : sortDirection === 'desc' && sortColumn === "title" ? "🔽" : null}</th>
                                <th className={darkMode ? "lightText" : null} onClick={() => handleSort('author')}>Author {sortDirection === 'asc' && sortColumn === "author" ? "🔼" : sortDirection === 'desc' && sortColumn === "author" ? "🔽" : null}</th>
                                <th className={darkMode ? "lightText" : null} onClick={() => handleSort('addedBy')}>Added By {sortDirection === 'asc' && sortColumn === "addedBy" ? "🔼" : sortDirection === 'desc' && sortColumn === "addedBy" ? "🔽" : null}</th>
                                <th className={darkMode ? "lightText" : null} onClick={() => handleSort('createdAt')}>Date Added {sortDirection === 'asc' && sortColumn === "createdAt" ? "🔼" : sortDirection === 'desc' && sortColumn === "createdAt" ? "🔽" : null}</th>
                                {windowWidth > "420" ? <th className={darkMode ? "lightText" : null}>Actions</th> : null}
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((book, index) => {
                                return (
                                    <tr className="mt-4" key={book._id}>
                                        <td className={darkMode ? "lightText" : null}><><Link to={`/books/${book?._id}`}>{book?.title}</Link></></td>
                                        <td className={darkMode ? "lightText" : null}>{book.author}</td>
                                        <td className={darkMode ? "lightText" : null}>{book?.addedBy?._id ? <p className='mb-1'><img className="profilePicture" src={book.addedBy.profilePicture} alt="" style={{ width: "40px", height: "40px" }} /> <Link to={`/users/${book?.addedBy?._id}`}>@{book?.addedBy?.displayName}</Link></p> : <p>(Deleted User @{book?.addedByString})</p>}</td>
                                        <td className={darkMode ? "lightText" : null}>{new Date(book.createdAt).toLocaleString()}</td>
                                        {windowWidth > "420" ? <td className={darkMode ? "lightText" : null}>
                                            { // fav/unfav
                                                currentItems[index]?.favoritedBy?.some(bookObj => bookObj._id === user?._id)
                                                    ? <><button className="btn btn-outline-danger" onClick={() => unfavoriteBook(book)}>✩</button></>
                                                    : <><button className="btn btn-outline-success" onClick={() => favoriteBook(book)}>★</button></>
                                            }
                                            { // delete if logged in user or 'admin' email user
                                                (welcome === (currentItems[index]?.addedBy?.name + " (@" + currentItems[index]?.addedBy?.displayName + ")") || user?.email === "t@w.com") ? <><button className={darkMode ? "btn btn-outline-danger" : "btn btn-outline-dark"} onClick={() => removeBook(book)}>🚮</button></> : null
                                            }
                                        </td> : null}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    <div className="custom-pagination">
                        <div className="pagination justify-content-center">
                            {pageNumbers.map((number) => (
                                <div key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => paginate(number)}>
                                        {number}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <br /><br />
                </div>
            </div>
        </div >
    )
}

export default withAuth(BookClub)