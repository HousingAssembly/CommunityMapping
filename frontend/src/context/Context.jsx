import React, { createContext, useContext, useState } from "react";

const Context = createContext();

const AdminProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <Context.Provider
      value={{
        loggedIn,
        setLoggedIn,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const AdminState = () => {
  return useContext(Context);
};

export default AdminProvider;