import './App.css'
import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ToastContainer, Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Cookies from 'js-cookie'
import jwtdecode from 'jwt-decode'
// import axios from 'axios'
import Nav from './components/Nav'
import Footer from './components/Footer'
import RegLog from './components/User/RegLog'
import LandingPage from './components/LandingPage'
import NotFound from './components/NotFound'
import BookClub from './components/BookClub/BookClub'
import BrightIdeas from './components/BrightIdeas/BrightIdeas'
import UserDetail from './components/User/UserDetail'
import BookDetail from './components/BookClub/BookDetail'
import IdeaDetail from './components/BrightIdeas/IdeaDetail'
import EditUser from './components/User/EditUser'
import EditBook from './components/BookClub/EditBook'
// import EditIdea from './components/EditIdea'
import PizzaTime from './components/PizzaTime/PizzaTime'
import PizzaCreate from './components/PizzaTime/PizzaCreate'
import PizzaCart from './components/PizzaTime/PizzaCart'

function App() {
  const [count, setCount] = useState(0)
  const [user, setUser] = useState()
  const [darkMode, setDarkMode] = useState(false)
  const [cookieValue, setCookieValue] = useState(Cookies.get('userToken'))
  const [order, setOrder] = useState(Cookies.get('order'))
  useEffect(() => {
    setCookieValue(Cookies.get('userToken'))
    setCount(count + 1)
    if (Cookies.get('darkMode') === undefined) Cookies.set('darkMode', false.toString(), { expires: 7 })
    if (cookieValue) setUser(jwtdecode(cookieValue))
    // eslint-disable-next-line
  }, [])



  return (
    <div className={darkMode ? "AppDark" : "AppLight"}>
      <Nav cookieValue={cookieValue} user={user} setUser={setUser} count={count} setCount={setCount} darkMode={darkMode} setDarkMode={setDarkMode} />
      <ToastContainer transition={Slide} />
      <Routes>
        <Route path="/" element={<RegLog count={count} setCount={setCount} darkMode={darkMode} />} />
        <Route path="/landing" element={<LandingPage count={count} setCount={setCount} user={user} darkMode={darkMode} />} />
        <Route path="/bookClub" element={<BookClub count={count} setCount={setCount} user={user} darkMode={darkMode} />} />
        <Route path="/brightIdeas" element={<BrightIdeas count={count} setCount={setCount} user={user} darkMode={darkMode} />} />
        <Route path="/pizzaTime" element={<PizzaTime count={count} setCount={setCount} user={user} darkMode={darkMode} />} />
        <Route path="/users/:id" element={<UserDetail user={user} count={count} darkMode={darkMode} cookieValue={cookieValue} />} />
        <Route path="/books/:id" element={<BookDetail user={user} darkMode={darkMode} />} />
        <Route path="/ideas/:id" element={<IdeaDetail user={user} darkMode={darkMode} />} />
        <Route path="/pizzaTime/create" element={<PizzaCreate darkMode={darkMode} setOrder={setOrder} />} />
        <Route path="/pizzaTime/cart" element={<PizzaCart darkMode={darkMode} order={order} />} />
        <Route path="/users/:id/edit" element={<EditUser cookieValue={cookieValue} setCookieValue={setCookieValue} setCount={setCount} />} />
        <Route path="/books/:id/edit" element={<EditBook />} />
        {/* <Route path="/ideas/:id/edit" element={<EditIdea />} /> */}
        <Route path="*" element={<NotFound darkMode={darkMode} />} />
      </Routes>
      <Footer darkMode={darkMode} />
    </div>
  )
}

export default App
