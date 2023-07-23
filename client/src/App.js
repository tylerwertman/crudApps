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
import Login from './components/User/Login'
import Register from './components/User/Register'
import LandingPage from './components/LandingPage'
import NotFound from './components/NotFound'
import UserDetail from './components/User/UserDetail'
import EditUser from './components/User/EditUser'
import BookClub from './components/BookClub/BookClub'
import BookDetail from './components/BookClub/BookDetail'
import EditBook from './components/BookClub/EditBook'
import BrightIdeas from './components/BrightIdeas/BrightIdeas'
import IdeaDetail from './components/BrightIdeas/IdeaDetail'
// import EditIdea from './components/EditIdea'
import PizzaTime from './components/PizzaTime/PizzaTime'
import PizzaCreate from './components/PizzaTime/PizzaCreate'
import PizzaCart from './components/PizzaTime/PizzaCart'

function App() {
  const [count, setCount] = useState(0)
  const [user, setUser] = useState(null)
  const [cookieValue, setCookieValue] = useState(Cookies.get('userToken'))
  const [previousLocation, setPreviousLocation] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [order, setOrder] = useState(Cookies.get('order'))

  useEffect(() => {
    setCookieValue(Cookies.get('userToken'))
    setUser(jwtdecode(Cookies.get('userToken')))
    if (Cookies.get('darkMode') === undefined) Cookies.set('darkMode', false.toString(), { expires: 7 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])



  return (
    <div className={darkMode ? "AppDark" : "AppLight"}>
      <Nav cookieValue={cookieValue} user={user} setUser={setUser} count={count} setCount={setCount} darkMode={darkMode} setDarkMode={setDarkMode} />
      <ToastContainer transition={Slide} position={"bottom-right"} autoClose={2500} hideProgressBar={false} closeOnClick= {true} pauseOnHover={true} draggable={true} progress={undefined} theme={darkMode ? "dark" : "light"}/>
      <Routes>
        <Route path="/" element={<Register setUser={setUser} setPreviousLocation={setPreviousLocation} darkMode={darkMode} />} />
        <Route path="/login" element={<Login setUser={setUser} setPreviousLocation={setPreviousLocation} darkMode={darkMode} />} />
        <Route path="/landing" element={<LandingPage count={count} setCount={setCount} user={user} previousLocation={previousLocation} setPreviousLocation={setPreviousLocation} darkMode={darkMode} />} />
        <Route path="/users/:id" element={<UserDetail user={user} setUser={setUser} count={count} darkMode={darkMode} />} />
        <Route path="/users/:id/edit" element={<EditUser cookieValue={cookieValue} setCookieValue={setCookieValue} setCount={setCount} />} />
        <Route path="/bookClub" element={<BookClub count={count} setCount={setCount} user={user} darkMode={darkMode} />} />
        <Route path="/books/:id" element={<BookDetail user={user} darkMode={darkMode} />} />
        <Route path="/books/:id/edit" element={<EditBook />} />
        <Route path="/brightIdeas" element={<BrightIdeas count={count} setCount={setCount} user={user} darkMode={darkMode} />} />
        <Route path="/ideas/:id" element={<IdeaDetail user={user} darkMode={darkMode} />} />
        {/* <Route path="/ideas/:id/edit" element={<EditIdea />} /> */}
        <Route path="/pizzaTime" element={<PizzaTime count={count} setCount={setCount} user={user} darkMode={darkMode} />} />
        <Route path="/pizzaTime/create" element={<PizzaCreate darkMode={darkMode} setOrder={setOrder} />} />
        <Route path="/pizzaTime/cart" element={<PizzaCart darkMode={darkMode} order={order} />} />
        <Route path="*" element={<NotFound darkMode={darkMode} />} />
      </Routes>
      <Footer darkMode={darkMode} />
    </div>
  )
}

export default App
