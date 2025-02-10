// src/components/Home.js
import React, { useEffect, useState, useCallback } from "react";
import { getAllSongs } from "../api";
import { actionType } from "../Context/reducer";
import { useStateValue } from "../Context/StateProvider";
import Filter from "./Filter";
import Header from "./Header";
import SearchBar from "./SearchBar";
import SongCard from "./SongCard";

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

  const [filteredSongs, setFilteredSongs] = useState([]);

  // Fetch all songs if not already loaded
  useEffect(() => {
    if (!allSongs) {
      getAllSongs().then((data) => {
        if (data?.data) {
          dispatch({
            type: actionType.SET_ALL_SONGS,
            allSongs: data.data,
          });
        }
      });
    }
  }, [allSongs, dispatch]);

  // Filter songs based on the current filters
  useEffect(() => {
    if (allSongs) {
      let filtered = allSongs;

      // Filter by search term
      if (searchTerm.length > 0) {
        filtered = filtered.filter(
          (song) =>
            song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
            song.language.toLowerCase().includes(searchTerm.toLowerCase()) ||
            song.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Filter by artist
      if (artistFilter) {
        filtered = filtered.filter((song) => song.artist === artistFilter);
      }

      // Filter by category (filterTerm)
      if (filterTerm) {
        filtered = filtered.filter(
          (song) => song.category.toLowerCase() === filterTerm.toLowerCase()
        );
      }

      // Filter by album
      if (albumFilter) {
        filtered = filtered.filter((song) => song.album === albumFilter);
      }

      // Filter by language
      if (languageFilter) {
        filtered = filtered.filter((song) => song.language === languageFilter);
      }

      setFilteredSongs(filtered);
    }
  }, [
    searchTerm,
    artistFilter,
    filterTerm,
    albumFilter,
    languageFilter,
    allSongs,
  ]);

  // Function to render the song cards
  const renderSongs = useCallback(() => {
    if (filteredSongs && filteredSongs.length > 0) {
      return filteredSongs.map((song) => (
        <SongCard key={song._id} data={song} />
      ));
    }

    if (allSongs && allSongs.length > 0) {
      return allSongs.map((song) => <SongCard key={song._id} data={song} />);
    }

    return <p className="text-textColor">No songs found</p>;
  }, [filteredSongs, allSongs]);

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
          {renderSongs()}
        </div>
      </div>
    </div>
  );
};

export default Home;
