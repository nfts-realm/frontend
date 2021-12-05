import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "utils/firebase.js";
import Routes from "routes";
import { useFetchPublicData } from "store/hooks";
import "./App.css";

const App = () => {
  useFetchPublicData();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      user ? setAuthenticated(true) : setAuthenticated(false);
    });
  });

  return (
    <div className="App">
      <Routes authenticated={authenticated} />
      <ToastContainer autoClose={5000} hideProgressBar />
    </div>
  );
};

export default App;
