import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "../components/user/Register";
import LandingPage from "../components/LandingPage";
import NotFound from "../components/NotFound";
import BookClub from "../components/bookClub/BookClub";
import BrightIdeas from "../components/brightIdeas/BrightIdeas";
import UserDetail from "../components/user/UserDetail";
import BookDetail from "../components/bookClub/BookDetail";
import IdeaDetail from "../components/brightIdeas/IdeaDetail";
import EditUser from "../components/user/EditUser";
import EditBook from "../components/bookClub/EditBook";
import PizzaTime from "../components/pizzaTime/PizzaTime";
import PizzaCreate from "../components/pizzaTime/PizzaCreate";
import PizzaCart from "../components/pizzaTime/PizzaCart";
import Login from "../components/user/Login";
import Nav from "../components/Nav";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
