import React, { useEffect, useState, useRef } from "react";
import { useStateValue } from "../Context/StateProvider";
import { IoMdClose } from "react-icons/io";
import { IoArrowRedo, IoMusicalNote } from "react-icons/io5";
import { motion } from "framer-motion";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { actionType } from "../Context/reducer";
import { getAllSongs, addFavouriteSong, removeFavouriteSong } from "../api"; // Nhập hàm gọi API
import { RiPlayListFill } from "react-icons/ri";
import { FaHeart } from "react-icons/fa"; // Nhập biểu tượng trái tim

const MusicPlayer = () => {
  const [isPlayList, setIsPlayList] = useState(false);
  const [
    { allSongs, song, isSongPlaying, miniPlayer, favoriteSongs, user }, // Thêm userId vào trạng thái
    dispatch,
  ] = useStateValue();
  const isMounted = useRef(true);

  const closeMusicPlayer = () => {
    if (isSongPlaying) {
      dispatch({
        type: actionType.SET_SONG_PLAYING,
        isSongPlaying: false,
      });
    }
  };

  const togglePlayer = () => {
    dispatch({
      type: actionType.SET_MINI_PLAYER,
      miniPlayer: !miniPlayer,
    });
  };

  const nextTrack = () => {
    const nextSongIndex =
      (allSongs.findIndex((s) => s._id === song) + 1) % allSongs.length;
    dispatch({
      type: actionType.SET_SONG,
      song: allSongs[nextSongIndex]._id,
    });
  };

  const previousTrack = () => {
    const prevSongIndex =
      (allSongs.findIndex((s) => s._id === song) - 1 + allSongs.length) %
      allSongs.length;
    dispatch({
      type: actionType.SET_SONG,
      song: allSongs[prevSongIndex]._id,
    });
  };

  const toggleFavorite = async () => {
    const isFavorite = favoriteSongs.includes(song);
    const updatedFavorites = isFavorite
      ? favoriteSongs.filter((id) => id !== song) // Xóa nếu đã yêu thích
      : [...favoriteSongs, song]; // Thêm nếu chưa yêu thích

    // Gọi API tương ứng
    if (isFavorite) {
      await removeFavouriteSong(user.user._id, song); // Gọi API xóa bài hát yêu thích
    } else {
      await addFavouriteSong(user.user._id, song); // Gọi API thêm bài hát yêu thích
    }

    dispatch({
      type: actionType.SET_FAVORITE_SONGS,
      favoriteSongs: updatedFavorites,
    });
  };

  useEffect(() => {
    isMounted.current = true;

    if (!allSongs.length) {
      getAllSongs().then((data) => {
        if (isMounted.current) {
          dispatch({
            type: actionType.SET_ALL_SONGS,
            allSongs: data.data,
          });
        }
      });
    }

    return () => {
      isMounted.current = false;
    };
  }, [allSongs, dispatch]);

  return (
    <div className="w-full flex items-center gap-3 overflow-hidden">
      <div
        className={`w-full items-center gap-3 p-4 ${
          miniPlayer ? "absolute top-40" : "flex relative"
        }`}
      >
        <img
          src={allSongs.find((s) => s._id === song)?.imageURL}
          className="w-40 h-20 object-cover rounded-md"
          alt=""
        />
        <div className="flex items-start flex-col">
          <p className="text-xl text-headingColor font-semibold">
            {allSongs.find((s) => s._id === song)?.name.length > 20
              ? allSongs.find((s) => s._id === song)?.name.slice(0, 20)
              : allSongs.find((s) => s._id === song)?.name}{" "}
            <span className="text-base">
              ({allSongs.find((s) => s._id === song)?.album})
            </span>
          </p>
          <p className="text-textColor">
            {allSongs.find((s) => s._id === song)?.artist}{" "}
            <span className="text-sm text-textColor font-semibold">
              ({allSongs.find((s) => s._id === song)?.category})
            </span>
          </p>
          <motion.i
            whileTap={{ scale: 0.8 }}
            onClick={() => setIsPlayList(!isPlayList)}
          >
            <RiPlayListFill className="text-textColor hover:text-headingColor text-3xl cursor-pointer" />
          </motion.i>
          <motion.i whileTap={{ scale: 0.8 }} onClick={toggleFavorite}>
            <FaHeart
              className={
                favoriteSongs.includes(song) ? "text-red-500" : "text-textColor"
              }
            />
          </motion.i>
        </div>
        <div className="flex-1">
          <AudioPlayer
            src={allSongs.find((s) => s._id === song)?.songUrl}
            autoPlay={isSongPlaying}
            showSkipControls={true}
            onClickNext={nextTrack}
            onClickPrevious={previousTrack}
          />
        </div>
        <div className="h-full flex items-center justify-center flex-col gap-3">
          <motion.i whileTap={{ scale: 0.8 }} onClick={closeMusicPlayer}>
            <IoMdClose className="text-textColor hover:text-headingColor text-2xl cursor-pointer" />
          </motion.i>
          <motion.i whileTap={{ scale: 0.8 }} onClick={togglePlayer}>
            <IoArrowRedo className="text-textColor hover:text-headingColor text-2xl cursor-pointer" />
          </motion.i>
        </div>
      </div>

      {isPlayList && <PlayListCard />}

      {miniPlayer && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed right-2 bottom-2"
        >
          <div className="w-40 h-40 rounded-full flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full bg-red-600 blur-xl animate-pulse"></div>
            <motion.img
              onClick={togglePlayer}
              src={allSongs.find((s) => s._id === song)?.imageURL}
              className="z-50 w-32 h-32 rounded-full object-cover cursor-pointer"
              alt=""
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Phần PlayListCard
export const PlayListCard = () => {
  const [{ allSongs, song, favoriteSongs, userId }, dispatch] = useStateValue();

  const setCurrentPlaySong = (songIndex) => {
    const currentSong = allSongs[songIndex];
    if (currentSong) {
      dispatch({
        type: actionType.SET_SONG,
        song: currentSong._id,
      });
    }
  };

  const toggleFavorite = async (songId) => {
    const isFavorite = favoriteSongs.includes(songId);
    const updatedFavorites = isFavorite
      ? favoriteSongs.filter((id) => id !== songId) // Xóa nếu đã yêu thích
      : [...favoriteSongs, songId]; // Thêm nếu chưa yêu thích

    // Gọi API tương ứng
    if (isFavorite) {
      await removeFavouriteSong(userId, songId); // Gọi API xóa bài hát yêu thích
    } else {
      await addFavouriteSong(userId, songId); // Gọi API thêm bài hát yêu thích
    }

    dispatch({
      type: actionType.SET_FAVORITE_SONGS,
      favoriteSongs: updatedFavorites,
    });
  };

  return (
    <div className="absolute left-4 bottom-24 gap-2 py-2 w-350 max-w-[350px] h-510 max-h-[510px] flex flex-col overflow-y-scroll scrollbar-thin rounded-md shadow-md bg-primary">
      {allSongs.length > 0 ? (
        allSongs.map((music, index) => (
          <motion.div
            key={music._id}
            initial={{ opacity: 0, translateX: -50 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`w-full p-4 hover:bg-card flex gap-3 items-center cursor-pointer ${
              music._id === song ? "bg-card" : "bg-transparent"
            }`}
            onClick={() => setCurrentPlaySong(index)}
          >
            <IoMusicalNote className="text-textColor group-hover:text-headingColor text-2xl" />
            <div className="flex flex-col">
              <p className="text-headingColor text-base font-semibold">
                {music.name}
              </p>
              <p className="text-textColor text-sm">{music.artist}</p>
            </div>
            <motion.i
              whileTap={{ scale: 0.8 }}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(music._id);
              }}
            >
              <FaHeart
                className={
                  favoriteSongs.includes(music._id)
                    ? "text-red-500"
                    : "text-textColor"
                }
              />
            </motion.i>
          </motion.div>
        ))
      ) : (
        <p className="text-center">No songs available</p>
      )}
    </div>
  );
};

export default MusicPlayer;
