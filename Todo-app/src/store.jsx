import { createContext, useState } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;
export const AllFuntion = createContext({
  handleAuth: () => {},
  handleLogout: () => {},
});
const DataProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const handleAuth = () => {
    setAuth(true);
  };

  const handleLogout = () => {
    axios.get("https://todoapp-ho3m.onrender.com/logout").then((res) => {
      localStorage.clear();
      location.reload(true);
    });
  };
  return (
    <AllFuntion.Provider value={{ handleAuth, auth, handleLogout }}>
      {children}
    </AllFuntion.Provider>
  );
};
export default DataProvider;
