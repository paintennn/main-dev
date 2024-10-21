import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import { getAuth } from "firebase/auth";
import { app } from "./config/firebase.config";
import { getAllSongs, validateUser } from "./api";
import {
  Dashboard,
  Home,
  Loader,
  Login,
  MusicPlayer,
  UserProfile,
} from "./components";
import { useStateValue } from "./Context/StateProvider";
import { actionType } from "./Context/reducer";
import { motion, AnimatePresence } from "framer-motion";
import Favorites from "./components/Favorites";
import SongDetail from "./components/SongDetail";

const App = () => {
  const firebaseAuth = getAuth(app);
  const navigate = useNavigate();
  const [{ user, allSongs, song, isSongPlaying }, dispatch] = useStateValue();
  const [isLoading, setIsLoading] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(
    window.localStorage.getItem("auth") === "true"
  );

  useEffect(() => {
    setIsLoading(true);
    firebaseAuth.onAuthStateChanged((userCred) => {
      if (userCred) {
        userCred.getIdToken().then((token) => {
          window.localStorage.setItem("auth", "true");
          validateUser(token).then((data) => {
            dispatch({
              type: actionType.SET_USER,
              user: data,
            });
          });
        });
        setIsLoading(false);
      } else {
        setIsAuthenticated(false);
        dispatch({
          type: actionType.SET_USER,
          user: null,
        });
        setIsLoading(false);
        window.localStorage.setItem("auth", "false");
        navigate("/login");
      }
    });
  }, [dispatch, firebaseAuth, navigate]);

  useEffect(() => {
    if (!allSongs && user) {
      getAllSongs().then((data) => {
        dispatch({
          type: actionType.SET_ALL_SONGS,
          allSongs: data.data,
        });
      });
    }
  }, [allSongs, user, dispatch]);

  return (
    <AnimatePresence>
      <div className="h-auto flex items-center justify-center min-w-[680px]">
        {isLoading ||
          (!user && (
            <div className="fixed inset-0 bg-loaderOverlay backdrop-blur-sm ">
              <Loader />
            </div>
          ))}
        <Routes>
          <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} /> {/* Truyền setIsAuthenticated */}
          <Route path="/*" element={<Home />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/userProfile" element={<UserProfile />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/song/:id" element={<SongDetail />} />
        </Routes>

        {isSongPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed min-w-[700px] h-26 inset-x-0 bottom-0 bg-cardOverlay drop-shadow-2xl backdrop-blur-md flex items-center justify-center`}
          >
            <MusicPlayer song={song} />
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
}

export default App;