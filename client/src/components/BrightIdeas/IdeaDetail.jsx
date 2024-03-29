import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { useParams, useNavigate, Link } from 'react-router-dom'
import withAuth from '../WithAuth'
import { toast } from 'react-toastify'
import { crudAppsContext } from '../../App'

const IdeaDetail = () => {
    const { AxiosURL, darkMode, user } = useContext(crudAppsContext)
    const { id } = useParams()
    const navigate = useNavigate()
    const [oneIdea, setOneIdea] = useState({})
    const ideaFavByContainsLoggedInUser = oneIdea.favoritedBy ? oneIdea.favoritedBy.some(ideaObj => ideaObj._id === user._id) : false
    const toastFav = () => toast.success(`💚 You favorited an idea`, {toastId: 1})
    const toastUnfav = () => toast.error(`🚫 You unfavorited an idea`, {toastId: 1})
    const toastDelete = () => toast.error(`🗑 You deleted an idea`, {toastId: 1})


    useEffect(() => {
        axios.get(`${AxiosURL}/ideas/${id}`)
            .then(res => {
                setOneIdea(res.data.idea)
                console.log(res.data.idea)
            })
            .catch(err => console.log(err))

        // eslint-disable-next-line
    }, [])

    const removeIdea = () => {
        axios.delete(`${AxiosURL}/ideas/${id}`)
            .then(res => {
                navigate("/brightIdeas")
                toastDelete()
            })
            .catch(err => console.log(err))

    }

    // const editIdea = (e) => {
    //     navigate(`/ideas/${id}/edit`)
    // }

    const favoriteIdea = () => {
        axios.post(`${AxiosURL}/ideas/${id}/favorite`, {}, { withCredentials: true })
            .then(res => {
                setOneIdea(res.data.idea)
                toastFav()
            })
            .catch(err => console.log(`FAV error`, err))
    }

    const unfavoriteIdea = () => {
        if (!ideaFavByContainsLoggedInUser) return
        axios.post(`${AxiosURL}/ideas/${id}/unfavorite`, {}, { withCredentials: true })
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
    }

    return (
        <div className='text-start col-8 offset-2'>
            <br />
            <h1 className='text-start mt-5'>Idea Details</h1>

            <button className="btn btn-primary" onClick={() => (navigate('/brightIdeas'))}>Bright Ideas</button>&nbsp;&nbsp;
            { // fav/unfav
                ideaFavByContainsLoggedInUser
                    ? <><button className="btn btn-danger" onClick={unfavoriteIdea}>Unfavorite Idea</button>&nbsp;&nbsp;</>
                    : <><button className="btn btn-success" onClick={favoriteIdea}>Favorite Idea</button>&nbsp;&nbsp;</>
            }
            { // edit
                // (user.displayName === oneIdea.addedBy?.displayName || user?.email === "t@w.com") ? <><button className='btn btn-warning' onClick={editIdea}>Edit Idea</button>&nbsp;&nbsp;</> : null
            }
            { // delete
                (user.displayName === oneIdea.addedBy?.displayName || user?.email === "t@w.com") ? <><button className={darkMode ? "btn btn-danger" : "btn btn-dark"} onClick={removeIdea}>Delete Idea</button>&nbsp;&nbsp;</> : null
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