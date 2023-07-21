import React, { useEffect } from "react";

const AppContext = React.createContext();

export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [mode, setMode] = React.useState(undefined);
  const [user, setUser] = React.useState();

  const toggleMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("mode", newMode);
  };

  const handleLogin = async () => {
    const user = await fakeLogin();
    setUser(user);
  };

  const handleLogout = async () => {
    setUser(undefined);
  };

  const fakeLogin = () =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          name: "John Doe",
          email: "john@doe.com",
        });
      }, 1000);
    });

  useEffect(() => {
    const modeFromStorage = localStorage.getItem("mode");
    if (modeFromStorage) {
      setMode(modeFromStorage);
    } else {
      setMode("light");
    }
  }, []);

  console.log(mode);

  return (
    <AppContext.Provider
      value={{ mode, toggleMode, user, handleLogin, handleLogout }}
    >
      {children}
    </AppContext.Provider>
  );
};
