// src/components/Home.js
import React, { useEffect, useState } from "react";
import { getAllSongs } from "../api";
import { actionType } from "../Context/reducer";
import { useStateValue } from "../Context/StateProvider";
import Filter from "./Filter";
import Header from "./Header";
import SearchBar from "./SearchBar";
import SongCard from "./SongCard"; // Nhập SongCard
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
          {filteredSongs
            ? filteredSongs.map((data, index) => (
                <SongCard key={data._id} data={data} /> // Sử dụng SongCard
              ))
            : allSongs.map((data, index) => (
                <SongCard key={data._id} data={data} /> // Sử dụng SongCard
              ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
