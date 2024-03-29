import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { useParams, useNavigate, Link } from 'react-router-dom'
import withAuth from '../WithAuth'
// import jwtdecode from 'jwt-decode'
import { crudAppsContext } from '../../App'



const UserDetail = () => {
    const { AxiosURL, darkMode, user, setUser, count } = useContext(crudAppsContext)
    const { id } = useParams()
    const navigate = useNavigate()
    const [showDeletePopup, setShowDeletePopup] = useState(false)
    const [oneUser, setOneUser] = useState({})
    const [currentTab, setCurrentTab] = useState(0)
    const allTabs = [
        { tab: "Books Added", active: false },
        { tab: "Books Favorited", active: false },
        { tab: "Ideas Added", active: false },
        { tab: "Ideas Favorited", active: false }
    ]

    const selectedTab = (idx) => {
        setCurrentTab(idx)

        if ((allTabs[currentTab].active === false)) {
            allTabs[currentTab].active = true
        } else {
            allTabs[currentTab].active = false
        }
    }
    useEffect(() => {
        axios.get(`${AxiosURL}/users/${id}`)
            .then(res => {
                setOneUser(res.data.user)
            })
            .catch(err => console.log(err))
        // eslint-disable-next-line
    }, [count])

    const deleteAccount = () => {
        axios.delete(`${AxiosURL}/users/${id}`)
            .then(res => {
                navigate("/")
                setUser(null)
                axios.post(`${AxiosURL}/users/logout`, {}, { withCredentials: true })
                    .then(res => {
                        console.log("deleted account")
                        setUser(null)
                    })
                    .catch(err => console.log(err))
                console.log("Deleting account & logging out")
            })
            .catch(err => console.log(err))
    }

    const editAccount = () => {
        navigate(`/users/${user._id}/edit`)
    }
    return (
        <div style={{ marginTop: "100px", marginBottom: "100px" }} className={darkMode ? "mainDivDark" : "mainDivLight"}>
            <div className={'popup mx-auto'} style={{ display: showDeletePopup ? "block" : "none", color: "white", top: "25%" }}>
                <h2>Are you sure you want to delete your account?</h2>
                <button className='btn btn-success' onClick={deleteAccount}>Yes</button>&nbsp;&nbsp;
                <button className='btn btn-danger' onClick={() => setShowDeletePopup(false)}>No</button>
            </div>
            <h2>User Details for: <img className="profilePicture" src={`${oneUser?.profilePicture}`} alt="" style={{ width: "50px", height: "50px" }} /> {oneUser?.name} (@{oneUser?.displayName})</h2>
            <h6>Joined on: {new Date(oneUser?.createdAt).toLocaleString()}</h6>
            <h6>Last updated: {new Date(oneUser?.updatedAt).toLocaleString()}</h6>
            {id === user?._id || user?.email === "t@w.com" ? <h6>Email: {oneUser.email} <strong>(only you can see this)</strong></h6> : null}
            <table className={darkMode ? 'tableDark mx-auto mt-5 mb-5' : 'mx-auto mt-5 mb-5'}>
                <thead>
                    <tr className={darkMode ? 'flex tableDark' : 'flex'}>
                        {allTabs.map((tabs, i) =>
                            <th className={currentTab === i && darkMode ? "tab clicked tableDark" : currentTab === i ? "tab clicked" : "tab"} key={i} onClick={() => selectedTab(i)}>
                                <h5>{tabs.tab}</h5>
                            </th>
                        )}
                    </tr>
                </thead>
            </table>
            <div className='flex mx-auto mb-3'>
                {
                    currentTab === 0 ?
                        <div className='col-md-6 mx-auto px-2'>
                            <h4>Added Books:</h4>
                            {oneUser?.booksAdded?.map((usersAddedBooks) => {
                                return <h6 key={usersAddedBooks._id}><Link to={`/books/${usersAddedBooks?._id}`}>{usersAddedBooks?.title}</Link></h6>
                            })}
                        </div>
                        : currentTab === 1 ?
                            <div className='col-md-6 mx-auto px-2'>
                                <h4>Favorite Books:</h4>
                                {oneUser?.booksFavorited?.map((usersFavBooks) => {
                                    return <h6 key={usersFavBooks._id}><Link to={`/books/${usersFavBooks?._id}`}>{usersFavBooks?.title}</Link></h6>
                                })}
                            </div>
                            : currentTab === 2 ?
                                <div className='col-md-6 mx-auto px-2'>
                                    <h4>Added Ideas:</h4>
                                    {oneUser?.ideasAdded?.map((usersAddedIdeas) => {
                                        return <h6 key={usersAddedIdeas._id}><Link to={`/ideas/${usersAddedIdeas?._id}`}>{usersAddedIdeas?.idea}</Link></h6>
                                    })}
                                </div>
                                : currentTab === 3 ?
                                    <div className='col-md-6 mx-auto px-2'>
                                        <h4>Favorite Ideas:</h4>
                                        {oneUser?.ideasFavorited?.map((usersFavIdeas) => {
                                            return <h6 key={usersFavIdeas._id}><Link to={`/ideas/${usersFavIdeas?._id}`}>{usersFavIdeas?.idea}</Link></h6>
                                        })}
                                    </div>
                                    : null
                }
            </div>
            {id === user?._id ? <button style={{ marginBottom: "60px" }} className={darkMode ? "btn btn-danger" : "btn btn-dark"} onClick={() => setShowDeletePopup(true)}>Delete Account</button> : null}
            &nbsp;&nbsp;{id === user?._id ? <button style={{ marginBottom: "60px" }} className={"btn btn-info"} onClick={() => { editAccount() }}>Edit Account</button> : null}
        </div>
    )
}

export default withAuth(UserDetail)