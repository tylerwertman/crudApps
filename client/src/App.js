import './App.css';
import {Routes, Route} from 'react-router-dom'
import {useState, useEffect} from 'react'
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import jwtdecode from 'jwt-decode'
import Nav from './components/Nav';
import Footer from './components/Footer';
import RegLog from './components/RegLog';
import LandingPage from './components/LandingPage';
import NotFound from './components/NotFound';
import BookClub from './components/BookClub';
import BrightIdeas from './components/BrightIdeas';
import UserDetail from './components/UserDetail';
import BookDetail from './components/BookDetail';
import IdeaDetail from './components/IdeaDetail'
import EditBook from './components/EditBook';
import EditIdea from './components/EditIdea';

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [welcome, setWelcome] = useState()
  const [count, setCount] = useState(0)
  const [user, setUser] = useState()
  const [darkMode, setDarkMode] = useState(false)

  const cookieValue = Cookies.get('userToken');
  
  useEffect(() => {
    setCount(count+1)
    if(Cookies.get('darkMode')===undefined) Cookies.set('darkMode', false.toString(), { expires: 7 })
    if(cookieValue){
      setWelcome(jwtdecode(cookieValue).name + " (@" + jwtdecode(cookieValue).displayName + ")")
      setUser(jwtdecode(cookieValue))
      setLoggedIn(true)
    }else{
      setWelcome("Guest")
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className={darkMode?"AppDark":"AppLight"}>
      <Nav cookieValue={cookieValue} user={user} setUser={setUser} welcome={welcome} setWelcome={setWelcome} loggedIn={loggedIn} setLoggedIn={setLoggedIn} count={count} setCount={setCount} darkMode={darkMode} setDarkMode={setDarkMode}/>
      <ToastContainer transition={Slide}/>
      <Routes>
        <Route path="/" element={<RegLog setLoggedIn={setLoggedIn} count={count} setCount={setCount} setWelcome={setWelcome} cookieValue={cookieValue} />}/>
        <Route path="/landing" element={<LandingPage count={count} setCount={setCount} user={user} darkMode={darkMode} welcome={welcome}/>}/>
        <Route path="/bookClub" element={<BookClub count={count} setCount={setCount} user={user} darkMode={darkMode} welcome={welcome}/>}/>
        <Route path="/brightIdeas" element={<BrightIdeas count={count} setCount={setCount} user={user} darkMode={darkMode} welcome={welcome}/>}/>
        <Route path="/users/:id" element={<UserDetail welcome={welcome} setWelcome={setWelcome} user={user} count={count} setLoggedIn={setLoggedIn} darkMode={darkMode}/>}/>
        <Route path="/books/:id" element={<BookDetail welcome={welcome} user={user} darkMode={darkMode}/>}/>
        <Route path="/ideas/:id" element={<IdeaDetail welcome={welcome} user={user} darkMode={darkMode}/>}/>
        <Route path="/books/:id/edit" element={<EditBook/>}/>
        <Route path="/ideas/:id/edit" element={<EditIdea/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
      <Footer darkMode={darkMode}/>
    </div>
  );
}

export default App;
