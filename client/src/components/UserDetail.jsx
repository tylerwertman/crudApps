import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useNavigate, Link } from 'react-router-dom'
import withAuth from './WithAuth'

const UserDetail = (props) => {
    const { id } = useParams()
    const { welcome, setWelcome, count, user, setLoggedIn, darkMode } = props
    // const [booksFavorited, setBooksFavorited] = useState([])
    const navigate = useNavigate();
    const [oneUser, setOneUser] = useState({})
    // const [favs, setFavs] = useState([])
    useEffect(() => {
        axios.get(`http://localhost:8000/api/users/${id}`)
            .then(res => {
                setOneUser(res.data.user)
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
                        navigate('/')
                        setWelcome("Guest")
                        setLoggedIn(false)
                    })
                    .catch(err => console.log(err))
                console.log("logging out")
            })
            .catch(err => console.log(err))

    }
    return (
        <div className={darkMode ? "mainDivDark mt-5" : "mainDivLight mt-5"}>
            <h2>User Details for: {oneUser?.firstName} {oneUser?.lastName}</h2>
            <div className='flex'>
                <div className='col-md-3 offset-3'>
                    <h4>Favorite Books:</h4>
                    {oneUser?.booksFavorited?.map((usersFavBooks) => {
                        return <h6 key={usersFavBooks._id}><Link to={`/books/${usersFavBooks?._id}`}>{usersFavBooks?.title}</Link></h6>
                    })}
                </div>
                <div className='col-md-3'>
                    <h4>Added Books:</h4>
                    {oneUser?.booksAdded?.map((usersAddedBooks) => {
                        return <h6 key={usersAddedBooks._id}><Link to={`/books/${usersAddedBooks?._id}`}>{usersAddedBooks?.title}</Link></h6>
                    })}
                </div>
            </div>
            <h6>Joined on: {new Date(oneUser?.createdAt).toLocaleString()}</h6>
            <h6>Last updated: {new Date(oneUser?.updatedAt).toLocaleString()}</h6>
            {welcome === (user?.firstName + " " + user?.lastName) ? <button className={darkMode ? "btn btn-danger" : "btn btn-dark"} onClick={deleteAccount}>Delete Account</button> : null}
            <br /><br /><br /><br />
        </div>
    )
}

export default withAuth(UserDetail)