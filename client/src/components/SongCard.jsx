// src/components/SongCard.js
import React from "react";
import { motion } from "framer-motion";
import { useStateValue } from "../Context/StateProvider";
import { actionType } from "../Context/reducer";

const SongCard = ({ data }) => {
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
    <motion.div
      whileTap={{ scale: 0.8 }}
      initial={{ opacity: 0, translateX: -50 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ duration: 0.3 }}
      className="relative w-1/6 min-w-[160px] h-64 cursor-pointer hover:shadow-xl hover:bg-card bg-gray-100 shadow-md rounded-lg flex flex-col items-start"
      onClick={addSongToContext}
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
          {data.name.length > 25 ? `${data.name.slice(0, 25)}...` : data.name}
        </p>
        <span className="block text-sm text-gray-400">{data.artist}</span>
      </div>
    </motion.div>
  );
};

export default SongCard;
