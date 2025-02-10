import React, { memo } from "react";
import { motion } from "framer-motion";
import { useStateValue } from "../Context/StateProvider";
import { actionType } from "../Context/reducer";
import { Link } from "react-router-dom";

const SongCard = ({ data, isAdmin, onDelete }) => {
  const [{ isSongPlaying, song }, dispatch] = useStateValue();

  const addSongToContext = () => {
    if (!isSongPlaying) {
      dispatch({
        type: actionType.SET_SONG_PLAYING,
        isSongPlaying: true,
      });
    }
    if (song?._id !== data._id) {
      dispatch({
        type: actionType.SET_SONG,
        song: data._id,
      });
    }
  };

  return (
    <div className="relative w-1/6 min-w-[160px] h-64 cursor-pointer hover:shadow-xl hover:bg-card bg-gray-100 shadow-md rounded-lg flex flex-col items-start">
      <div
        className="w-full h-40 rounded-lg drop-shadow-lg relative overflow-hidden"
        onClick={addSongToContext}
      >
        <motion.img
          whileHover={{ scale: 1.05 }}
          src={data.imageURL}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      <Link to={`/song/${data._id}`}>
        <div className="flex flex-col items-start justify-start text-left w-full mt-2 px-2">
          <p className="text-base text-headingColor font-semibold">
            {data.name.length > 25 ? `${data.name.slice(0, 25)}...` : data.name}
          </p>
          <span className="block text-sm text-gray-400">{data.artist}</span>
        </div>
      </Link>
      {isAdmin && ( // Kiểm tra xem người dùng có phải admin không
        <button
          className="mt-2 px-2 py-1 bg-red-500 text-white rounded-md"
          onClick={(e) => {
            e.stopPropagation(); // Ngăn chặn sự kiện click từ lan ra ngoài
            onDelete(data._id);
          }}
        >
          Xóa
        </button>
      )}
    </div>
  );
};

export default memo(SongCard); // Memo hóa SongCard
