import React, { createContext, useContext, useState } from "react";

const Context = createContext();

const AdminProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(null); 
  const [communityDraft, setCommunityDraft] = useState(null);

  const startCommunityPlacement = (district) =>{
    console.log("clicked addCommunity for", selectedDistrict);
    setCommunityDraft({ district, lat: null, lng: null });
  }

  const setCommunityCoords = (lat, lng) =>
  setCommunityDraft((d) => ({ ...d, lat, lng }));

  const cancelCommunityPlacement = () => setCommunityDraft(null);

  return (
    <Context.Provider
      value={{
        loggedIn,
        setLoggedIn,
        selectedDistrict, 
        setSelectedDistrict,
        communityDraft,
        startCommunityPlacement,
        setCommunityCoords,
        cancelCommunityPlacement,
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