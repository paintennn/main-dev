import React from "react";
import Header from "./Header";
import { useStateValue } from "../Context/StateProvider";
import SongCard from "./SongCard"; // Nhập SongCard

const Favorites = () => {
  const [{ favoriteSongs, allSongs }] = useStateValue();

  return (
    <div className="w-full h-auto flex flex-col items-center justify-center bg-primary">
      <Header />
      <h2>Bài hát yêu thích</h2>
      {favoriteSongs.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-4 p-4 max-w-[1200px]">
          {favoriteSongs.map((songId) => {
            const song = allSongs.find((s) => s._id === songId);
            return <SongCard key={song._id} data={song} />; // Sử dụng SongCard
          })}
        </div>
      ) : (
        <p>Không có bài hát yêu thích nào.</p>
      )}
    </div>
  );
};

export default Favorites;
