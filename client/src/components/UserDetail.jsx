import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useNavigate, Link } from 'react-router-dom'
import withAuth from './WithAuth'

const UserDetail = (props) => {
    const { id } = useParams()
    const { welcome, setWelcome, count, user, setLoggedIn, darkMode } = props
    const navigate = useNavigate();
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [oneUser, setOneUser] = useState({})
    const [currentTab, setCurrentTab] = useState(0)
    const allTabs = [
        { tab: "Books Added", active: false },
        { tab: "Books Favorited", active: false },
        { tab: "Ideas Added", active: false },
        { tab: "Ideas Favorited", active: false }
    ]

    const selectedTab = (idx) => {
        setCurrentTab(idx);

        if ((allTabs[currentTab].active === false)) {
            allTabs[currentTab].active = true
        } else {
            allTabs[currentTab].active = false
        }
    }
    useEffect(() => {
        axios.get(`http://localhost:8000/api/users/${id}`)
            .then(res => {
                setOneUser(res.data.user)
                // console.log(res.data.user)
            })
            .catch(err => console.log(err))
        // eslint-disable-next-line
    }, [count]);

    const deleteAccount = () => {
        axios.delete(`http://localhost:8000/api/users/${id}`)
            .then(res => {
                navigate("/")
                setWelcome("Guest")
                axios.post('http://localhost:8000/api/users/logout', {}, { withCredentials: true })
                    .then(res => {
                        setLoggedIn(false)
                    })
                    .catch(err => console.log(err))
                console.log("Deleting account & logging out")
            })
            .catch(err => console.log(err))

    }
    return (
        <div className={darkMode ? "mainDivDark mt-5" : "mainDivLight mt-5"}>
            <br />
            <br />
            <div className={'popup mx-auto'} style={{ display: showDeletePopup ? "block" : "none", color: "white" }}>
                <h2>Are you sure you want to delete your account?</h2>
                <button className='btn btn-success' onClick={deleteAccount}>Yes</button>&nbsp;&nbsp;
                <button className='btn btn-danger' onClick={() => setShowDeletePopup(false)}>No</button>
            </div>
            <h2>User Details for: {oneUser?.name} (@{oneUser?.displayName})</h2>
            <h6>Joined on: {new Date(oneUser?.createdAt).toLocaleString()}</h6>
            <h6>Last updated: {new Date(oneUser?.updatedAt).toLocaleString()}</h6>
            <br />
            <table className={darkMode ? 'mx-auto tableDark' : 'mx-auto'}>
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
            <br />
            <div className='flex mx-auto'>
                {
                    currentTab === 0 ?
                        <div className='col-md-6 mx-auto'>
                            <h4>Added Books:</h4>
                            {oneUser?.booksAdded?.map((usersAddedBooks) => {
                                return <h6 key={usersAddedBooks._id}><Link to={`/books/${usersAddedBooks?._id}`}>{usersAddedBooks?.title}</Link></h6>
                            })}
                        </div>
                        : currentTab === 1 ?
                            <div className='col-md-6 mx-auto'>
                                <h4>Favorite Books:</h4>
                                {oneUser?.booksFavorited?.map((usersFavBooks) => {
                                    return <h6 key={usersFavBooks._id}><Link to={`/books/${usersFavBooks?._id}`}>{usersFavBooks?.title}</Link></h6>
                                })}
                            </div>
                            : currentTab === 2 ?
                                <div className='col-md-6 mx-auto'>
                                    <h4>Added Ideas:</h4>
                                    {oneUser?.ideasAdded?.map((usersAddedIdeas) => {
                                        return <h6 key={usersAddedIdeas._id}><Link to={`/ideas/${usersAddedIdeas?._id}`}>{usersAddedIdeas?.idea}</Link></h6>
                                    })}
                                </div>
                                : currentTab === 3 ?
                                    <div className='col-md-6 mx-auto'>
                                        <h4>Favorite Ideas:</h4>
                                        {oneUser?.ideasFavorited?.map((usersFavIdeas) => {
                                            return <h6 key={usersFavIdeas._id}><Link to={`/ideas/${usersFavIdeas?._id}`}>{usersFavIdeas?.idea}</Link></h6>
                                        })}
                                    </div>
                                    : null
                }
            </div>
            {welcome === (user?.name + " (@" + user?.displayName + ")") ? <button className={darkMode ? "btn btn-danger" : "btn btn-dark"} onClick={() => setShowDeletePopup(true)}>Delete Account</button> : null}
            <br /><br /><br />
        </div>
    )
}

export default withAuth(UserDetail)