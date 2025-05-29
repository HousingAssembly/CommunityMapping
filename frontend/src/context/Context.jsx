import React, { createContext, useContext, useState } from "react";

const Context = createContext();

const AdminProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(null); 

  return (
    <Context.Provider
      value={{
        loggedIn,
        setLoggedIn,
        selectedDistrict, 
        setSelectedDistrict
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