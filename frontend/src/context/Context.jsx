import React, { createContext, useContext, useState } from "react";
import axios from 'axios'

const Context = createContext();

const AdminProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(null); 
  const [communityDraft, setCommunityDraft] = useState(null);
  const [communities, setCommunities] = useState([]);

  const startCommunityPlacement = (district) =>{
    console.log("clicked addCommunity for", selectedDistrict);
    setCommunityDraft({ district, lat: null, lng: null });
  }

  const setCommunityCoords = (lat, lng) =>
  setCommunityDraft((d) => ({ ...d, lat, lng }));

  const cancelCommunityPlacement = () => setCommunityDraft(null);

  const fetchCommunities = async (district) => {
  if (!district) return setCommunities([]);
  try {
    const { data } = await axios.get(`http://localhost:8000/addCom/fetch?district=${district}`);
    setCommunities(data);
  } catch (err) {
    console.error(err);
    setCommunities([]);
  }
};

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
        communities,
        fetchCommunities,
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