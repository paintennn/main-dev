import React, { useEffect, useState } from "react";
import Header from "./Header";
import { useStateValue } from "../Context/StateProvider";
import SongCard from "./SongCard";
import { getFavouriteSongs, removeFavouriteSong } from "../api";

const Favorites = () => {
  const [{ allSongs, user }, dispatch] = useStateValue();
  const [favoriteSongs, setFavoriteSongs] = useState([]);

  useEffect(() => {
    const fetchFavouriteSongs = async () => {
      if (user.user?._id) {
        const result = await getFavouriteSongs(user.user._id);
        if (result && Array.isArray(result.data)) {
          setFavoriteSongs(result.data);
        } else {
          console.error("Data format error:", result);
        }
      }
    };
    fetchFavouriteSongs();
  }, [user]);

  const handleRemoveFavorite = async (songId) => {
    const result = await removeFavouriteSong(user.user._id, songId);
    if (result?.success) {
      setFavoriteSongs((prevSongs) =>
        prevSongs.filter((fav) => fav.songId !== songId)
      );
    } else {
      console.error("Error removing favourite song:", result);
    }
  };

  return (
    <div className="w-full h-auto flex flex-col items-center justify-center bg-primary">
      <Header />
      <h2>Bài hát yêu thích</h2>
      {favoriteSongs.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-4 p-4 max-w-[1200px]">
          {favoriteSongs.map((fav) => {
            const song = allSongs.find((s) => s._id === fav.songId);
            if (song) {
              return (
                <div key={song._id}>
                  <SongCard data={song} />
                  <button onClick={() => handleRemoveFavorite(song._id)}>
                    Xóa
                  </button>
                </div>
              );
            } else {
              return <p key={fav._id}>Bài hát không tìm thấy.</p>;
            }
          })}
        </div>
      ) : (
        <p>Không có bài hát yêu thích nào.</p>
      )}
    </div>
  );
};

export default Favorites;
