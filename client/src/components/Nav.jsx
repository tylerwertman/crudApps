import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/main";
import { useToast } from "../hooks/useToast";

const Nav = (props) => {
  const { mode, user, toggleMode, handleLogout } = useAppContext();
  const navigate = useNavigate();
  const { createToast } = useToast();

  // useEffect(() => {
  //   if (cookieValue) {
  //     // console.log(jwtdecode(cookieValue))
  //     setWelcome(
  //       jwtdecode(cookieValue).name +
  //         " (@" +
  //         jwtdecode(cookieValue).displayName +
  //         ")"
  //     );
  //   }
  //   // eslint-disable-next-line
  // }, [loggedIn]);

  const logout = async () => {
    await handleLogout();
    createToast({
      variant: "success",
      message: "Logged out",
    });
    navigate("/");
  };

  const navHome = () => {
    if (user) {
      navigate("/landing");
      // console.log("logged in so nav to dash")
    } else {
      navigate("/");
      // console.log("logged out so nav to /")
    }
  };

  const navToUser = () => {
    navigate(`/users/${user?._id}`);
  };

  return (
    <nav className={mode === "dark" ? "navDark" : "navLight"}>
      <div>
        <h1 style={{ display: "inline" }} onClick={navHome}>
          CRUD Apps
        </h1>
        <br className="MQHide" />
        {user ? (
          <span onClick={() => navToUser()}>
            <h4 style={{ display: "inline" }}>Welcome, {user.name}</h4>
          </span>
        ) : (
          <h4 style={{ display: "inline" }}>Welcome, Guest</h4>
        )}
      </div>
      <div>
        {user && (
          // (loggedIn) ?
          <>
            <button className="btn btn-danger" onClick={logout}>
              Logout
            </button>
            &nbsp;&nbsp;
          </>
        )}
        <button
          className={
            mode === "dark"
              ? "btn btn-success darkModeButton"
              : "btn btn-dark darkModeButton"
          }
          onClick={toggleMode}
        >
          {mode === "dark" ? "☀️" : "🌙"}
        </button>
      </div>
    </nav>
  );
};
export default Nav;
