import "./App.css";
// import axios from 'axios'
import Footer from "./components/Footer";
import { ToastConfig } from "./components/ToastConfig";
import { AppRoutes } from "./routes/Routes";
import { useAppContext } from "./context/main";

function App() {
  const { mode } = useAppContext();
  // useEffect(() => {
  //   setCookieValue(Cookies.get("userToken"));
  //   setCount(count + 1);
  //   if (Cookies.get("darkMode") === undefined)
  //     Cookies.set("darkMode", false.toString(), { expires: 7 });
  //   if (cookieValue) {
  //     setWelcome(
  //       jwtdecode(cookieValue).name +
  //         " (@" +
  //         jwtdecode(cookieValue).displayName +
  //         ")"
  //     );
  //     setUser(jwtdecode(cookieValue));
  //     setLoggedIn(true);
  //   } else {
  //     setWelcome("Guest");
  //   }
  //   // eslint-disable-next-line
  // }, []);

  if (!mode) return null;
  // or add a loading/holding page instead of not rendering anything

  return (
    <div className={mode === "dark" ? "AppDark" : "AppLight"}>
      <ToastConfig darkMode={mode} />
      <AppRoutes />
      <Footer darkMode={mode} />
    </div>
  );
}

export default App;
