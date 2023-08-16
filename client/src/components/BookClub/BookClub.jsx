import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import io from 'socket.io-client'
import { Link } from 'react-router-dom'
import withAuth from '../WithAuth'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { crudAppsContext } from '../../App'


const BookClub = () => {
    const { AxiosURL, darkMode, user, count, setCount } = useContext(crudAppsContext)
    const [socket] = useState(() => io(':8000'))
    const [bookList, setBookList] = useState([])
    const [oneBook, setOneBook] = useState({ title: "", author: "" })
    const [errors, setErrors] = useState({})
    const [sortColumn, setSortColumn] = useState('')
    const [sortDirection, setSortDirection] = useState('asc')
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState('')
    const [search, setSearch] = useState(false)
    const toastAdded = () => toast.success(`➕ You added ${oneBook.title}`, { toastId: 1 })
    const toastFav = (book) => toast.success(`👍 You favorited ${book.title}`, { toastId: 1 })
    const toastUnfav = (book) => toast.error(`👎 You unfavorited ${book.title}`, { toastId: 1 })
    const toastDelete = (book) => toast.error(`🗑 You deleted ${book.title}`, { toastId: 1 })

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth)
        }
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    useEffect(() => {
        axios.get(`${AxiosURL}/books`)
            .then(res => {
                setBookList(res.data.book)
            })
            .catch(err => console.log(err))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [count])

    useEffect(() => {
        // Event handler for 'bookAdded' event
        const handleBookAdded = (newBook) => {
            setBookList((bookList) => [newBook, ...bookList])
        }

        //Event handler for 'bookDeleted' event
        const handleBookDeleted = (deletedBook) => {
            setBookList((bookList) => bookList.filter((book) => book._id !== deletedBook._id))
        }

        // Subscribe to 'bookAdded' event
        socket.on('bookAdded', handleBookAdded)
        socket.on('bookDeleted', handleBookDeleted)

        // Clean up the event listener on component unmount
        return () => {
            socket.off('bookAdded', handleBookAdded)
            socket.off('bookDeleted', handleBookDeleted)
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
        axios.post(`${AxiosURL}/books`, oneBook, { withCredentials: true })
            .then(res => {
                setBookList([...bookList, res.data.book])
                toastAdded()
                setOneBook({
                    title: "",
                    author: ""
                })
                setErrors({
                    title: "",
                    author: ""
                })
                socket.emit('bookAdded', res.data.book)
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
        axios.post(`${AxiosURL}/books/${book._id}/favorite`, {}, { withCredentials: true })
            .then(res => {
                setCount(count + 1)
                toastFav(book)
            })
            .catch(err => console.log(`FAV error`, err))
    }

    const unfavoriteBook = (book) => {
        axios.post(`${AxiosURL}/books/${book._id}/unfavorite`, {}, { withCredentials: true })
            .then(res => {
                setCount(count + 1)
                toastUnfav(book)
            })
            .catch(err => console.log(`UNfav error`, err))
    }

    const removeBook = (book) => {
        axios.delete(`${AxiosURL}/books/${book._id}`)
            .then(res => {
                setBookList(bookList.filter(item => item._id !== book._id))
                toastDelete(book)
                socket.emit('bookDeleted', book)
                if ((bookList.length - 1) % 5 === 0) setCurrentPage(currentPage - 1)

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

    // SEARCH
    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value)
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        axios.get(`${AxiosURL}/books`, { params: { search: searchQuery } })
            .then((res) => {
                const searchedResults = res.data.book.filter((book) => book.title.toLowerCase().includes(searchQuery.toLowerCase()) || book.author.toLowerCase().includes(searchQuery.toLowerCase()))
                setBookList(searchedResults)
                const sortedSearchedBooks = searchedResults.sort((a, b) => b.favoritedBy.length - a.favoritedBy.length)
                setBookList(sortedSearchedBooks)
                // setSearchResults(sortedBooks)
                setCurrentPage(1)
                setSearchQuery("")
            })
            .catch((err) => console.log(err))
    }

    const returnToAllBooks = () => {
        setSearchQuery('')
        setSearch(!search)
        axios.get(`${AxiosURL}/books`, { params: { search: "" } })
            .then((res) => {
                const sortedBooks = res.data.book.sort((a, b) => b.favoritedBy.length - a.favoritedBy.length)
                setBookList(sortedBooks)
                setCurrentPage(1)
            })
            .catch((err) => console.log(err))
    }
    return (
        <div style={{ marginTop: "0px", marginBottom: "30px" }}>
            <h1>Welcome to the Book Club</h1>
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
                <h3 className='mt-3' onClick={returnToAllBooks}>{search ? "Search Books" : <>All Books <FontAwesomeIcon icon={faMagnifyingGlass} /></>}</h3>
                {/* SEARCH */}
                {search ? <div className='col-sm-8 mx-auto px-4'>
                    <form onSubmit={handleSearchSubmit}>
                        <div className="input-group col-10">
                            <div className="form-floating">
                                <input type="text" className="form-control custom-input" name="book" value={searchQuery} onChange={handleSearchInputChange} placeholder='Search books!' />
                                <label className="darkText" htmlFor="book">Search books!</label>
                            </div>
                            <button type="submit" className="input-group-text btn btn-success" onSubmit={handleSearchSubmit}>Search!</button>
                        </div>
                    </form>
                </div> : null}
                <div>
                    <h4>All Books</h4>
                    <table className='mx-auto mb-3' style={windowWidth < 500 ? { width: "280px" } : null}>
                        <thead>
                            <tr>
                                <th className={darkMode ? "lightText" : null} onClick={() => handleSort('title')}>Title {sortDirection === 'asc' && sortColumn === "title" ? "🔼" : sortDirection === 'desc' && sortColumn === "title" ? "🔽" : null}</th>
                                <th className={darkMode ? "lightText" : null} onClick={() => handleSort('author')}>Author {sortDirection === 'asc' && sortColumn === "author" ? "🔼" : sortDirection === 'desc' && sortColumn === "author" ? "🔽" : null}</th>
                                <th className={darkMode ? "lightText" : null} onClick={() => handleSort('addedBy')}>Added By {sortDirection === 'asc' && sortColumn === "addedBy" ? "🔼" : sortDirection === 'desc' && sortColumn === "addedBy" ? "🔽" : null}</th>
                                {windowWidth > 420 ? <th className={darkMode ? "lightText" : null} onClick={() => handleSort('createdAt')}>Date Added {sortDirection === 'asc' && sortColumn === "createdAt" ? "🔼" : sortDirection === 'desc' && sortColumn === "createdAt" ? "🔽" : null}</th> : <></>}
                                {windowWidth > 420 ? <th className={darkMode ? "lightText" : null}>Actions</th> : <></>}
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((book, index) => {
                                return (
                                    <tr className="mt-4" key={book._id}>
                                        <td className={darkMode ? "lightText" : null}><><Link to={`/books/${book?._id}`}>{book?.title}</Link></></td>
                                        <td className={darkMode ? "lightText" : null}>{book.author}</td>
                                        <td className={darkMode ? "lightText" : null}>{book?.addedBy?._id ? <p className='mb-1'><img className="profilePicture" src={book.addedBy.profilePicture} alt="" style={{ width: "40px", height: "40px" }} /> <Link to={`/users/${book?.addedBy?._id}`}>@{book?.addedBy?.displayName}</Link></p> : <p>(Deleted User @{book?.addedByString})</p>}</td>
                                        {windowWidth > 420 ? <td className={darkMode ? "lightText" : null}>{new Date(book.createdAt).toLocaleString()}</td> : <></>}
                                        {windowWidth > 420 ? <td className={darkMode ? "lightText" : null}>
                                            { // fav/unfav
                                                currentItems[index]?.favoritedBy?.some(bookObj => bookObj._id === user?._id)
                                                    ? <><button className="btn btn-outline-danger" onClick={() => unfavoriteBook(book)}>✩</button></>
                                                    : <><button className="btn btn-outline-success" onClick={() => favoriteBook(book)}>★</button></>
                                            }
                                            { // delete if logged in user or 'admin' email user
                                                (user?.displayName === currentItems[index]?.addedBy?.displayName || user?.email === "t@w.com") ? <><button className={darkMode ? "btn btn-outline-danger" : "btn btn-outline-dark"} onClick={() => removeBook(book)}>🚮</button></> : null
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