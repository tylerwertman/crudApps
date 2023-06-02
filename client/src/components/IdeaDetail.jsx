import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useNavigate, Link } from 'react-router-dom'
import withAuth from './WithAuth'
import { toast } from 'react-toastify';


const IdeaDetail = (props) => {
    const { welcome, user, darkMode } = props
    const { id } = useParams()
    const navigate = useNavigate();
    const [oneIdea, setOneIdea] = useState({})
    const ideaFavByContainsLoggedInUser = oneIdea.favoritedBy ? oneIdea.favoritedBy.some(ideaObj => ideaObj._id === user._id) : false;
    const toastFav = () => toast.success(`💚 You favorited an idea`, {
        position: "bottom-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: darkMode ? "dark" : "light"
    });
    const toastUnfav = () => toast.error(`🚫 You unfavorited an idea`, {
        position: "bottom-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: darkMode ? "dark" : "light"
    });
    const toastDelete = () => toast.error(`🗑 You deleted an idea`, {
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
                setOneIdea(res.data.idea)
                console.log(res.data.idea)
            })
            .catch(err => console.log(err))

        // eslint-disable-next-line
    }, []);

    const removeIdea = () => {
        axios.delete(`http://localhost:8000/api/ideas/${id}`)
            .then(res => {
                navigate("/dashboard")
                toastDelete()
            })
            .catch(err => console.log(err))

    }

    const editIdea = (e) => {
        navigate(`/ideas/${id}/edit`)
    }

    const favoriteIdea = () => {
        axios.post(`http://localhost:8000/api/ideas/${id}/favorite`, {}, { withCredentials: true })
            .then(res => {
                setOneIdea(res.data.idea)
                toastFav()
            })
            .catch(err => console.log(`FAV error`, err))
    }

    const unfavoriteIdea = () => {
        if (!ideaFavByContainsLoggedInUser) return
        axios.post(`http://localhost:8000/api/ideas/${id}/unfavorite`, {}, { withCredentials: true })
            .then(res => {
                setOneIdea(res.data.idea)
                toastUnfav()
            })
            .catch(err => console.log(`UNfav error`, err))
    }

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    };

    return (
        <div className='text-start col-8 offset-2'>
            <br />
            <h1 className='text-start mt-5'>Idea Details</h1>

            <button className="btn btn-primary" onClick={() => (navigate('/dashboard'))}>Home</button>&nbsp;&nbsp;
            { // fav/unfav
                ideaFavByContainsLoggedInUser
                    ? <><button className="btn btn-danger" onClick={unfavoriteIdea}>Unfavorite Idea</button>&nbsp;&nbsp;</>
                    : <><button className="btn btn-success" onClick={favoriteIdea}>Favorite Idea</button>&nbsp;&nbsp;</>
            }
            { // edit
                (welcome === (oneIdea.addedBy?.name + " (@" + oneIdea.addedBy?.displayName) + ")") ? <><button className='btn btn-warning' onClick={editIdea}>Edit Idea</button>&nbsp;&nbsp;</> : null
            }
            { // delete
                (welcome === (oneIdea.addedBy?.name + " (@" + oneIdea.addedBy?.displayName + ")") || user?.email === "t@w.com") ? <><button className={darkMode ? "btn btn-danger" : "btn btn-dark"} onClick={removeIdea}>Delete Idea</button>&nbsp;&nbsp;</> : null
            }
            <div className='col-6'>

                <br />
                {
                    oneIdea?.addedBy ?
                    <><span>On {new Date(oneIdea.createdAt).toLocaleString("en-US", options)} at {new Date(oneIdea.createdAt).toLocaleString([], { timeStyle: 'short' })}, </span><Link to={`/users/${oneIdea.addedBy._id}`}>@{oneIdea?.addedBy.displayName}</Link><span> said:</span>&nbsp;</> :
                    <span>Deleted User said: </span>
                }
                <p className="idea" style={{ border: "1px solid", padding: "5px 10px" }}>{oneIdea.idea}</p>
                {/* <p>at {new Date(oneIdea?.createdAt).toLocaleString()}</p> */}
                {/* <h6>Last Updated on: {new Date(oneIdea?.updatedAt).toLocaleString()}</h6> */}
                {
                    oneIdea.favoritedBy?.length !== 0 ?
                        <>
                            <h4>Users who liked this idea:</h4>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Display Name</th>
                                        <th>Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {oneIdea.favoritedBy?.map((ideasFavedBy, i) => {
                                        return (
                                            <tr key={ideasFavedBy._id}>
                                                <td className={darkMode ? "lightText" : null}><Link to={`/users/${ideasFavedBy?._id}`}>@{ideasFavedBy.displayName}</Link></td>
                                                <td className={darkMode ? "lightText" : null}>{ideasFavedBy.name}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table><br /><br /><br /></>
                        : null
                }
            </div>
        </div>
    )
}

export default withAuth(IdeaDetail)