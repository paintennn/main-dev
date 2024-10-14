import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AiOutlineClear } from "react-icons/ai";
import { deleteSongById, getAllSongs } from "../api";
import { useStateValue } from "../Context/StateProvider";
import { actionType } from "../Context/reducer";
import { IoAdd, IoTrash } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import AlertSuccess from "./AlertSuccess";
import AlertError from "./AlertError";

const DashboardSongs = () => {
  const [songFilter, setSongFilter] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [filteredSongs, setFilteredSongs] = useState(null);
  const [{ allSongs }, dispatch] = useStateValue();

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
    if (songFilter.length > 0) {
      const filtered = allSongs.filter(
        (data) =>
          data.artist.toLowerCase().includes(songFilter.toLowerCase()) ||
          data.language.toLowerCase().includes(songFilter.toLowerCase()) ||
          data.name.toLowerCase().includes(songFilter.toLowerCase())
      );
      setFilteredSongs(filtered);
    } else {
      setFilteredSongs(null);
    }
  }, [songFilter, allSongs]);

  return (
    <div className="w-full p-4 flex items-center justify-center flex-col">
      <div className="w-full flex justify-center items-center gap-24">
        <NavLink
          to={"/dashboard/newSong"}
          className="flex items-center px-4 py-3 border rounded-md border-gray-300 hover:border-gray-400 hover:shadow-md cursor-pointer"
        >
          <IoAdd />
        </NavLink>
        <input
          type="text"
          placeholder="Search here"
          className={`w-52 px-4 py-2 border ${
            isFocus ? "border-gray-500 shadow-md" : "border-gray-300"
          } rounded-md bg-transparent outline-none duration-150 transition-all ease-in-out text-base text-textColor font-semibold`}
          value={songFilter}
          onChange={(e) => setSongFilter(e.target.value)}
          onBlur={() => setIsFocus(false)}
          onFocus={() => setIsFocus(true)}
        />

        {songFilter && (
          <motion.i
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileTap={{ scale: 0.75 }}
            onClick={() => {
              setSongFilter("");
              setFilteredSongs(null);
            }}
          >
            <AiOutlineClear className="text-3xl text-textColor cursor-pointer" />
          </motion.i>
        )}
      </div>

      <div className="relative w-full my-4 p-4 py-12 border border-gray-300 rounded-md">
        <div className="absolute top-4 left-4">
          <p className="text-xl font-bold">
            <span className="text-sm font-semibold text-textColor">
              Count :{" "}
            </span>
            {filteredSongs ? filteredSongs.length : allSongs?.length}
          </p>
        </div>

        <SongContainer data={filteredSongs ? filteredSongs : allSongs} />
      </div>
    </div>
  );
};

export const SongContainer = ({ data }) => {
  return (
    <div className="w-full flex flex-wrap justify-between">
      {data &&
        data.map((song, i) => (
          <div key={song._id} className="flex-shrink-0 w-1/5 p-2">
            <SongCard data={song} index={i} />
          </div>
        ))}
    </div>
  );
};

export const SongCard = ({ data, index }) => {
  const [alert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false); // Trạng thái hiển thị modal xác nhận xóa
  const [{ song, isSongPlaying, allSongs }, dispatch] = useStateValue();

  const deleteSong = async () => {
    try {
      await deleteSongById(data._id); // Gọi API xóa bài hát
      setAlertMsg("Song deleted successfully");
      setAlert("success");
      // Cập nhật danh sách bài hát
      const updatedSongs = allSongs.filter((song) => song._id !== data._id);
      dispatch({
        type: actionType.SET_ALL_SONGS,
        allSongs: updatedSongs,
      });
    } catch (error) {
      console.error("Error deleting song:", error);
      setAlertMsg("Failed to delete song");
      setAlert("error");
    } finally {
      setShowConfirm(false); // Đóng modal xác nhận
    }
  };

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
    <motion.div
      whileTap={{ scale: 0.8 }}
      initial={{ opacity: 0, translateY: -20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="relative w-full h-full bg-white shadow-lg rounded-lg overflow-hidden flex flex-col items-center"
      onClick={() => addSongToContext(data)}
    >
      <div className="w-full h-40 relative overflow-hidden">
        <motion.img
          whileHover={{ scale: 1.05 }}
          src={data.imageURL}
          alt={data.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col p-4 w-full">
        <h3 className="text-lg font-semibold truncate">{data.name}</h3>
        <p className="text-sm text-gray-500 truncate">{data.artist}</p>
      </div>

      <div className="w-full flex justify-end p-2">
        <motion.i
          whileTap={{ scale: 0.75 }}
          onClick={() => setShowConfirm(true)} // Hiển thị modal xác nhận
          className="text-red-500 hover:text-red-700"
        >
          <IoTrash />
        </motion.i>
      </div>

      {alert && (
        <>
          {alert === "success" ? (
            <AlertSuccess msg={alertMsg} />
          ) : (
            <AlertError msg={alertMsg} />
          )}
        </>
      )}

      {showConfirm && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold">Confirm Delete</h2>
            <p>Are you sure you want to delete this song?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={deleteSong}
                className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
              >
                Delete
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default DashboardSongs;
