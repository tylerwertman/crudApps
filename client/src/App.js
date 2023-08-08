import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect, createContext } from 'react'
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
import DarkMode from './components/DarkMode'

export const crudAppsContext = createContext()

function App() {
  const AxiosURL = "http://localhost:8000/api"
  const [count, setCount] = useState(0)
  const [user, setUser] = useState(null)
  const [previousLocation, setPreviousLocation] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [order, setOrder] = useState(Cookies.get('order'))

  useEffect(() => {
    if (Cookies.get('userToken')) setUser(jwtdecode(Cookies.get('userToken')))
    if (Cookies.get('darkMode') === undefined) Cookies.set('darkMode', false.toString(), { expires: 7 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])



  return (
    <crudAppsContext.Provider value={{ AxiosURL, darkMode, user, setUser, count, setCount, setPreviousLocation }}>
      <div className={darkMode ? "AppDark" : "AppLight"}>
        <BrowserRouter>
          <Nav />
          <ToastContainer transition={Slide} position={"bottom-right"} autoClose={2500} hideProgressBar={false} closeOnClick={true} pauseOnHover={true} draggable={true} progress={undefined} theme={darkMode ? "dark" : "light"} />
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/landing" element={<LandingPage previousLocation={previousLocation} />} />
            <Route path="/users/:id" element={<UserDetail />} />
            <Route path="/users/:id/edit" element={<EditUser />} />
            <Route path="/bookClub" element={<BookClub />} />
            <Route path="/books/:id" element={<BookDetail />} />
            <Route path="/books/:id/edit" element={<EditBook />} />
            <Route path="/brightIdeas" element={<BrightIdeas />} />
            <Route path="/ideas/:id" element={<IdeaDetail />} />
            {/* <Route path="/ideas/:id/edit" element={<EditIdea />} /> */}
            <Route path="/pizzaTime" element={<PizzaTime />} />
            <Route path="/pizzaTime/create" element={<PizzaCreate order={order} setOrder={setOrder} />} />
            <Route path="/pizzaTime/cart" element={<PizzaCart order={order} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
          <DarkMode setDarkMode={setDarkMode} />

        </BrowserRouter>
      </div>
    </crudAppsContext.Provider>
  )
}

export default App
