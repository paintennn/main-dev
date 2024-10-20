import React, { useEffect, useState } from "react";
import { getAllSongs } from "../api";
import { actionType } from "../Context/reducer";
import { useStateValue } from "../Context/StateProvider";
import Filter from "./Filter";
import Header from "./Header";
import SearchBar from "./SearchBar";
import { motion } from "framer-motion";

const Home = () => {
  const [
    {
      searchTerm,
      allSongs,
      artistFilter,
      filterTerm,
      albumFilter,
      languageFilter,
    },
    dispatch,
  ] = useStateValue();

  const [filteredSongs, setFilteredSongs] = useState(null);

  useEffect(() => {
    if (!allSongs) {
      getAllSongs().then((data) => {
        dispatch({
          type: actionType.SET_ALL_SONGS,
          allSongs: data.data,
        });
      });
    }
  }, [allSongs, dispatch]);

  useEffect(() => {
    if (allSongs) {
      let filtered = allSongs;

      // Lọc theo searchTerm
      if (searchTerm.length > 0) {
        filtered = filtered.filter(
          (data) =>
            data.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
            data.language.toLowerCase().includes(searchTerm.toLowerCase()) ||
            data.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Lọc theo artistFilter
      if (artistFilter) {
        filtered = filtered.filter((data) => data.artist === artistFilter);
      }

      // Lọc theo filterTerm
      if (filterTerm) {
        filtered = filtered.filter(
          (data) => data.category.toLowerCase() === filterTerm.toLowerCase()
        );
      }

      // Lọc theo albumFilter
      if (albumFilter) {
        filtered = filtered.filter((data) => data.album === albumFilter);
      }

      // Lọc theo languageFilter
      if (languageFilter) {
        filtered = filtered.filter((data) => data.language === languageFilter);
      }

      setFilteredSongs(filtered.length > 0 ? filtered : null);
    }
  }, [
    searchTerm,
    artistFilter,
    filterTerm,
    albumFilter,
    languageFilter,
    allSongs,
  ]);

  return (
    <div className="w-full h-auto flex flex-col items-center justify-center bg-primary">
      <Header />
      <SearchBar />

      {searchTerm.length > 0 && (
        <p className="my-4 text-base text-textColor">
          Searched for :
          <span className="text-xl text-cartBg font-semibold">
            {searchTerm}
          </span>
        </p>
      )}

      <Filter setFilteredSongs={setFilteredSongs} />

      <div className="w-full h-auto flex justify-center">
        <div className="flex flex-wrap justify-between gap-4 p-4 max-w-[1200px]">
          <HomeSongContainer
            musics={filteredSongs ? filteredSongs : allSongs}
          />
        </div>
      </div>
    </div>
  );
};

export const HomeSongContainer = ({ musics }) => {
  const [{ isSongPlaying, song }, dispatch] = useStateValue();

  const addSongToContext = (selectedSong) => {
    if (!isSongPlaying) {
      dispatch({
        type: actionType.SET_SONG_PLAYING,
        isSongPlaying: true,
      });
    }
    if (selectedSong && song?._id !== selectedSong._id) {
      dispatch({
        type: actionType.SET_SONG,
        song: selectedSong._id,
      });
    }
  };

  return (
    <>
      {musics?.map((data, index) => (
        <motion.div
          key={data._id}
          whileTap={{ scale: 0.8 }}
          initial={{ opacity: 0, translateX: -50 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="relative w-1/6 min-w-[160px] h-64 cursor-pointer hover:shadow-xl hover:bg-card bg-gray-100 shadow-md rounded-lg flex flex-col items-start"
          onClick={() => addSongToContext(data)}
        >
          <div className="w-full h-40 rounded-lg drop-shadow-lg relative overflow-hidden">
            <motion.img
              whileHover={{ scale: 1.05 }}
              src={data.imageURL}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col items-start justify-start text-left w-full mt-2 px-2">
            <p className="text-base text-headingColor font-semibold">
              {data.name.length > 25
                ? `${data.name.slice(0, 25)}...`
                : data.name}
            </p>
            <span className="block text-sm text-gray-400">{data.artist}</span>
          </div>
        </motion.div>
      ))}
    </>
  );
};

export default Home;
