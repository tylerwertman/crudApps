import React, { useState, useEffect } from 'react'
import axios from 'axios'
import io from 'socket.io-client';
import { Link } from 'react-router-dom'
// import jwtdecode from 'jwt-decode'
import withAuth from './WithAuth'
import { toast } from 'react-toastify';


const BookClub = (props) => {
    const { count, setCount, user, welcome, darkMode } = props
    const [socket] = useState(() => io(':8000'));
    const [bookList, setBookList] = useState([])
    const [oneBook, setOneBook] = useState({ title: "", author: "" })
    const [errors, setErrors] = useState({})
    const [sortColumn, setSortColumn] = useState('')
    const [sortDirection, setSortDirection] = useState('asc')
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const toastAdded = () => toast.success(`➕ You added ${oneBook.title}`, {
        position: "bottom-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: darkMode ? "dark" : "light"
    });
    const toastFav = (id) => toast.success(`👍 You favorited ${id}`, {
        position: "bottom-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: darkMode ? "dark" : "light"
    });
    const toastUnfav = (id) => toast.error(`👎 You unfavorited ${id}`, {
        position: "bottom-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: darkMode ? "dark" : "light"
    });
    const toastDelete = (id) => toast.error(`🗑 You deleted ${id}`, {
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
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        axios.get(`http://localhost:8000/api/books`)
            .then(res => {
                setBookList(res.data.book)
            })
            .catch(err => console.log(err))
    }, [count]);

    useEffect(() => {
        // Event handler for 'bookAdded' event
        const handleBookAdded = (newBook) => {
            setBookList((sortedBooks) => [newBook, ...sortedBooks]);
        };

        //Event handler for 'bookDeleted' event
        const handleBookDeleted = (deletedBook) => {
            setBookList((bookList) => bookList.filter((book) => book._id !== deletedBook._id));
        }

        // Subscribe to 'bookAdded' event
        socket.on('bookAdded', handleBookAdded);
        socket.on('bookDeleted', handleBookDeleted);

        // Clean up the event listener on component unmount
        return () => {
            socket.off('bookAdded', handleBookAdded);
            socket.off('bookDeleted', handleBookDeleted);
        };
    }, [socket]);

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
                toastAdded()
                setOneBook({
                    title: "",
                    author: ""
                })
                setErrors({
                    title: "",
                    author: ""
                })
                socket.emit('bookAdded', res.data.book);
                setCount(count + 1)
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
                toastFav(book.title)
            })
            .catch(err => console.log(`FAV error`, err))
    }

    const unfavoriteBook = (book) => {
        axios.post(`http://localhost:8000/api/books/${book._id}/unfavorite`, {}, { withCredentials: true })
            .then(res => {
                setCount(count + 1)
                toastUnfav(book.title)
            })
            .catch(err => console.log(`UNfav error`, err))
    }

    const removeBook = (book) => {
        axios.delete(`http://localhost:8000/api/books/${book._id}`)
            .then(res => {
                setCount(count + 1)
                toastDelete(book.title)
                socket.emit('bookDeleted', book);

            })
            .catch(err => console.log(err))
    }

    const handleSort = (column) => {
        if (column === sortColumn) {
            // If the same column is clicked again, toggle the sort direction
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            // If a different column is clicked, set it as the new sort column and reset the sort direction
            setSortColumn(column);
            setSortDirection('asc');
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
            const addedByA = a.addedBy.firstName.toLowerCase()
            const addedByB = b.addedBy.firstName.toLowerCase()
            return sortDirection === 'asc' ? addedByA.localeCompare(addedByB) : addedByB.localeCompare(addedByA)
        } else if (sortColumn === 'createdAt') {
            return sortDirection === 'asc' ? new Date(a.createdAt) - new Date(b.createdAt) : new Date(b.createdAt) - new Date(a.createdAt);
        }
        return 0;
    })

    return (
        <div>
            <br />
            <h1 className='mt-5'>Welcome to the Book Club</h1>
            <div className={darkMode ? "mainDivDark" : "mainDivLight"}>
                <div>
                    <h3>Add a new book</h3>
                    <form className={darkMode ? "col-md-4 bg-dark offset-1 mx-auto text-light" : "col-md-4 offset-1 mx-auto"} onSubmit={submitHandler}>
                        {oneBook.title && oneBook.title?.length < 2 ? <p className="text-danger">Title must be at least 2 characters</p> : null}
                        {errors.title ? <p className="text-danger">{errors.title.message}</p> : null}
                        <div className="form-group col-10 mx-auto">
                            <label className='form-label'>Title</label>
                            <input type="text" className="form-control" name="title" value={oneBook.title} onChange={changeHandler} />
                        </div>
                        {oneBook.author && oneBook.author?.length < 2 ? <p className="text-danger">Author must be at least 2 characters</p> : null}
                        {errors.author ? <p className="text-danger">{errors.author.message}</p> : null}
                        <div className="form-group col-10 mx-auto">
                            <label className='form-label'>Author</label>
                            <input type="text" className="form-control" name="author" value={oneBook.author} onChange={changeHandler} />
                        </div>
                        <div className="form-group">
                            <button type="submit" className='btn btn-success col-10 mt-3 mb-3'>Add Book</button>
                        </div>
                    </form>
                </div>
                <div>
                    <h3>All Books</h3>
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
                            {sortedBooks.map((book, index) => {
                                return (
                                    <tr className="mt-4" key={book._id}>
                                        <td className={darkMode ? "lightText" : null}><><Link to={`/books/${book?._id}`}>{book?.title}</Link></></td>
                                        <td className={darkMode ? "lightText" : null}>{book.author}</td>
                                        <td className={darkMode ? "lightText" : null}>{book?.addedBy?._id ? <p className='mb-1'><Link to={`/users/${book?.addedBy?._id}`}>@{book?.addedBy?.displayName}</Link></p> : <p>(added by Deleted User)</p>}</td>
                                        <td className={darkMode ? "lightText" : null}>{new Date(book.updatedAt).toLocaleString()}</td>
                                        {windowWidth > "420" ? <td className={darkMode ? "lightText" : null}>
                                            { // fav/unfav
                                                sortedBooks[index]?.favoritedBy?.some(bookObj => bookObj._id === user?._id)
                                                    ? <><button className="btn btn-outline-danger" onClick={() => unfavoriteBook(book)}>✩</button></>
                                                    : <><button className="btn btn-outline-success" onClick={() => favoriteBook(book)}>★</button></>
                                            }
                                            { // delete if logged in user or 'admin' email user
                                                (welcome === (oneBook?.addedBy?.firstName + " " + oneBook?.addedBy?.lastName) || user?.email === "t@w.com") ? <><button className={darkMode ? "btn btn-outline-danger" : "btn btn-outline-dark"} onClick={() => removeBook(book)}>🚮</button></> : null
                                            }
                                        </td> : null}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    <br /><br />
                </div>
            </div>
        </div >
    )
}

export default withAuth(BookClub)