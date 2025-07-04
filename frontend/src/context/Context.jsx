//React hooks #1 lets you make a global data container, #2 lets components read from container
//#3 stores state variables, #4 runs logic on component load like grbabing form local storage

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from 'axios'

//global data container
const Context = createContext();

//gives all children access to shared data
const AdminProvider = ({ children }) => {
  //gives default state to state variables
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(null); 
  const [communityDraft, setCommunityDraft] = useState(null);
  const [communities, setCommunities] = useState([]);
  const [user, setUser] = useState();
  const [showShelters, setShowShelters] = useState(false)
  const [globalCommunity, setGlobalCommunity] = useState(null);


   useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
  }, []);

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
    const { data } = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/addCom/fetch?district=${district}`);
    setCommunities(data);
  } catch (err) {
    console.error(err);
    setCommunities([]);
  }
};

//now any component can read and update the selected district, communities, and logged-in user
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
        user,
        setUser,
        showShelters, 
        setShowShelters,
        globalCommunity, 
        setGlobalCommunity
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