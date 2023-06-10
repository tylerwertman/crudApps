import React, { useState, useEffect } from 'react'
import axios from 'axios'
import io from 'socket.io-client'
import { Link } from 'react-router-dom'
import withAuth from './WithAuth'
import { toast } from 'react-toastify'


const BrightIdeas = (props) => {
    const { count, setCount, user, welcome, darkMode, photos } = props
    const [socket] = useState(() => io(':8000'))
    const [ideaList, setIdeaList] = useState([])
    const [oneIdea, setOneIdea] = useState({ idea: "" })
    const [errors, setErrors] = useState({})
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const [currentPage, setCurrentPage] = useState(1)

    const toastAdded = () => toast.success(`➕ You added an idea`, {
        position: "bottom-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: darkMode ? "dark" : "light"
    })
    const toastFav = (id) => toast.success(`👍 You favorited an idea`, {
        position: "bottom-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: darkMode ? "dark" : "light"
    })
    const toastUnfav = (id) => toast.error(`👎 You unfavorited an idea`, {
        position: "bottom-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: darkMode ? "dark" : "light"
    })
    const toastDelete = (id) => toast.error(`🗑 You deleted ${id}`, {
        position: "bottom-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: darkMode ? "dark" : "light"
    })

    // UE for tracking window size
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth)
        }
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    // UE for sorting ideas by favorites. The Fav & Unfav FN update count to trigger this UE
    useEffect(() => {
        axios.get(`http://localhost:8000/api/ideas`)
            .then(res => {
                const sortedIdeas = res.data.idea.sort((a, b) => b.favoritedBy.length - a.favoritedBy.length)
                setIdeaList(sortedIdeas)
            })
            .catch(err => console.log(err))
        // eslint-disable-next-line
    }, [count])

    // UE for socket.io
    useEffect(() => {
        // Event handler for 'ideaAdded' event
        const handleIdeaAdded = (newIdea) => {
            setIdeaList((ideaList) => {
                const socketSortedList = [newIdea, ...ideaList]
                socketSortedList.sort((a, b) => b?.favoritedBy?.length - a?.favoritedBy?.length)
                return socketSortedList
            })
        }
        //Event handler for 'ideaFavorited' event
        const handleIdeaFavorited = (updatedIdea) => {
            setIdeaList((ideaList) => {
                const updatedList = ideaList.map((idea) => {
                    if (idea._id === updatedIdea._id) {
                        return updatedIdea
                    }
                    return idea
                })
                const socketSortedList = updatedList.sort((a, b) => b?.favoritedBy?.length - a?.favoritedBy?.length)
                return socketSortedList
            })
        }
        //Event handler for 'ideaUnfavorited' event
        const handleIdeaUnfavorited = (updatedIdea) => {
            setIdeaList((ideaList) => {
                const updatedList = ideaList.map((idea) => {
                    if (idea._id === updatedIdea._id) {
                        return updatedIdea
                    }
                    return idea
                })
                const socketSortedList = updatedList.sort((a, b) => b?.favoritedBy?.length - a?.favoritedBy?.length)
                return socketSortedList
            })
        }
        //Event handler for 'ideaDeleted' event
        const handleIdeaDeleted = (deletedIdea) => {
            setIdeaList((ideaList) => ideaList.filter((idea) => idea._id !== deletedIdea._id))
        }

        // Subscribe to events
        socket.on('ideaAdded', handleIdeaAdded)
        socket.on('ideaFavorited', handleIdeaFavorited)
        socket.on('ideaUnfavorited', handleIdeaUnfavorited)
        socket.on('ideaDeleted', handleIdeaDeleted)

        // Clean up the event listener on component unmount
        return () => {
            socket.off('ideaAdded', handleIdeaAdded)
            socket.off('ideaFavorited', handleIdeaFavorited)
            socket.off('ideaUnfavorited', handleIdeaUnfavorited)
            socket.off('ideaDeleted', handleIdeaDeleted)
        }
    }, [socket])

    const changeHandler = (e) => {
        setOneIdea({
            ...oneIdea,
            [e.target.name]: e.target.value
        })
    }

    const submitHandler = (e) => {
        e.preventDefault()
        axios.post('http://localhost:8000/api/ideas', oneIdea, { withCredentials: true })
            .then(res => {
                const newIdea = res.data.idea
                const list = [newIdea, ...ideaList]
                const sortedList = list.sort((a, b) => b?.favoritedBy?.length - a?.favoritedBy?.length)
                setIdeaList(sortedList)
                toastAdded()
                setOneIdea({
                    idea: "",
                })
                setErrors({
                    idea: "",
                })
                socket.emit('ideaAdded', newIdea)
            })
            .catch(err => {
                console.log(`submit errer`, err)
                setErrors({
                    idea: err.response.data.error.errors.idea,
                })
                console.log(errors)
            })
    }

    const favoriteIdea = (idea) => {
        axios.post(`http://localhost:8000/api/ideas/${idea._id}/favorite`, {}, { withCredentials: true })
            .then(res => {
                const updatedIdea = res.data.idea
                const updatedIdeaList = ideaList.map(list => {
                    if (list._id === updatedIdea._id) {
                        return updatedIdea
                    }
                    return list
                })
                setIdeaList(updatedIdeaList)
                setCount(count + 1)
                toastFav(idea.idea)
                socket.emit('ideaFavorited', updatedIdea)
            })
            .catch(err => console.log(`FAV error`, err))
    }

    const unfavoriteIdea = (idea) => {
        axios.post(`http://localhost:8000/api/ideas/${idea._id}/unfavorite`, {}, { withCredentials: true })
            .then(res => {
                const updatedIdea = res.data.idea
                const updatedIdeaList = ideaList.map(list => {
                    if (list._id === updatedIdea._id) {
                        return updatedIdea
                    }
                    return list
                })
                setIdeaList(updatedIdeaList)
                setCount(count + 1)
                toastUnfav(idea.idea)
                socket.emit('ideaUnfavorited', updatedIdea)
            })
            .catch(err => console.log(`UNfav error`, err))
    }

    const removeIdea = (idea) => {
        axios.delete(`http://localhost:8000/api/ideas/${idea._id}`)
            .then(res => {
                setCount(count + 1)
                toastDelete(idea.idea)
                socket.emit('ideaDeleted', idea)

            })
            .catch(err => console.log(err))
    }

    // Pagination
    const itemsPerPage = 5
    const totalPages = Math.ceil(ideaList.length / itemsPerPage)
    const pageNumbers = []

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
    }

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = ideaList.slice(indexOfFirstItem, indexOfLastItem)

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    }

    return (
        <div>
            <h1 style={{ marginTop: "75px" }}>Welcome to Bright Ideas</h1>
            <div className={darkMode ? "mainDivDark" : "mainDivLight"}>
                {/* <button className="btn btn-danger" onClick={() => sort()}>Sort</button> */}
                <div className={darkMode ? "col-sm-8 mx-auto bg-dark text-light" : "col-sm-8 mx-auto"}>
                    <form className={darkMode ? "mx-auto bg-dark text-light mt-5" : "mx-auto mt-5"} onSubmit={submitHandler}>
                        {oneIdea.idea && oneIdea.idea?.length < 2 ? <p className="text-danger">Idea must be at least 2 characters</p> : null}
                        {errors.idea ? <p className="text-danger">{errors.idea.message}</p> : null}
                        {windowWidth > 575 ?
                            <div className="input-group col-10">
                                <div className="form-floating">
                                    <input type="text" className="form-control custom-input" name="idea" value={oneIdea.idea} onChange={changeHandler} placeholder='Add a new idea!' />
                                    <label className="darkText" htmlFor="idea">Add a new idea!</label>
                                </div>
                                <button type="submit" className="input-group-text btn btn-success" onSubmit={submitHandler}>Add idea!</button>
                            </div>
                            :
                            <div>
                                <div className="form-floating col-10 mx-auto">
                                    <input type="text" className="form-control custom-input" name="idea" value={oneIdea.idea} onChange={changeHandler} placeholder='Add a new idea!' />
                                    <label className="darkText" htmlFor="idea">Add a new idea!</label>
                                </div>
                                <button type="submit" className="input-group-text btn btn-success mt-3 col-10" onSubmit={submitHandler}>Add idea!</button>
                            </div>
                        }
                    </form>
                </div>
                <h3 className='mt-3'>All Ideas</h3>
                <div className='col-8 mx-auto text-start ideaList'>
                    {currentItems.map((idea, index) => {
                        return (
                            <div className='mt-5' key={idea._id}>
                                {
                                    idea?.addedBy ?
                                        <><span>On {new Date(idea.createdAt).toLocaleString("en-US", options)} at {new Date(idea.createdAt).toLocaleString([], { timeStyle: 'short' })}, </span><img className="profilePicture" src={`${idea.addedBy?.profilePicture}`} alt="" style={{width:"35px", height:"35px"}}/> <Link to={`/users/${idea.addedBy._id}`}>@{idea?.addedBy.displayName}</Link><span> said:</span>&nbsp;</> :
                                        <span>Deleted User says: </span>
                                }
                                <br className="MQHide" />
                                <p className="idea" style={{ border: "1px solid", padding: "5px 10px" }}>{idea.idea}</p>
                                <span className='text-end'>
                                    {
                                        currentItems[index]?.favoritedBy?.length === 0 ?
                                            null :
                                            currentItems[index]?.favoritedBy?.length === 1 ?
                                                <><span>Liked by </span><Link to={`/ideas/${idea._id}`}>{currentItems[index].favoritedBy?.length}</Link><span> user  </span></> :
                                                <><span>Liked by </span><Link to={`/ideas/${idea._id}`}>{currentItems[index].favoritedBy?.length}</Link><span> users  </span></>
                                    }
                                </span>
                                <br className='MQHide' />
                                { // fav/unfav
                                    currentItems[index]?.favoritedBy?.some(ideaObj => ideaObj._id === user?._id) && darkMode ? <><button className="btn btn-outline-danger" onClick={() => unfavoriteIdea(idea)}>✩</button>&nbsp;</> :
                                        currentItems[index]?.favoritedBy?.some(ideaObj => ideaObj._id === user?._id) ? <><button className="btn btn-danger" onClick={() => unfavoriteIdea(idea)}>✩</button>&nbsp;</> :
                                            darkMode ? <><button className="btn btn-outline-success" onClick={() => favoriteIdea(idea)}>★</button>&nbsp;</> :
                                                <><button className="btn btn-success" onClick={() => favoriteIdea(idea)}>★</button>&nbsp;</>
                                }
                                { // delete if logged in user or 'admin' email user
                                    (welcome === (`${idea?.addedBy?.name} (@${idea?.addedBy?.displayName})`) || user?.email === "t@w.com") ? <><button className={darkMode ? "btn btn-outline-danger" : "btn btn-dark"} onClick={() => removeIdea(idea)}>🅧</button>&nbsp;&nbsp;</> : null
                                }
                            </div>
                        )
                    })}
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
                    <br /><br /><br />
                </div>
            </div>
        </div >
    )
}

export default withAuth(BrightIdeas)
