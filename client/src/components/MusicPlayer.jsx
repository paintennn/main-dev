import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  memo,
  useMemo,
} from "react";
import { useStateValue } from "../Context/StateProvider";
import { IoMdClose } from "react-icons/io";
import { IoArrowRedo } from "react-icons/io5";
import { motion } from "framer-motion";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { actionType } from "../Context/reducer";
import {
  getAllSongs,
  addFavouriteSong,
  removeFavouriteSong,
  getFavouriteSongs,
} from "../api"; // Nhập hàm gọi API
import { FaHeart } from "react-icons/fa"; // Nhập biểu tượng trái tim

const MusicPlayer = () => {
  const [isPlayList, setIsPlayList] = useState(false); // Playlist state không còn cần thiết
  const [
    { allSongs, song, isSongPlaying, miniPlayer, favoriteSongs, user },
    dispatch,
  ] = useStateValue();
  const isMounted = useRef(true);

  // Hàm đóng MusicPlayer
  const closeMusicPlayer = useCallback(() => {
    if (isSongPlaying) {
      dispatch({
        type: actionType.SET_SONG_PLAYING,
        isSongPlaying: false,
      });
    }
  }, [dispatch, isSongPlaying]);

  // Hàm thu nhỏ hoặc mở rộng player
  const togglePlayer = useCallback(() => {
    dispatch({
      type: actionType.SET_MINI_PLAYER,
      miniPlayer: !miniPlayer,
    });
  }, [dispatch, miniPlayer]);

  // Hàm chuyển sang bài tiếp theo
  const nextTrack = useCallback(() => {
    const nextSongIndex =
      (allSongs.findIndex((s) => s._id === song) + 1) % allSongs.length;
    dispatch({
      type: actionType.SET_SONG,
      song: allSongs[nextSongIndex]._id,
    });
  }, [allSongs, song, dispatch]);

  // Hàm quay lại bài trước đó
  const previousTrack = useCallback(() => {
    const prevSongIndex =
      (allSongs.findIndex((s) => s._id === song) - 1 + allSongs.length) %
      allSongs.length;
    dispatch({
      type: actionType.SET_SONG,
      song: allSongs[prevSongIndex]._id,
    });
  }, [allSongs, song, dispatch]);

  // Hàm thêm/xóa bài hát yêu thích
  const toggleFavorite = useCallback(async () => {
    const isFavorite = favoriteSongs.includes(song);

    const updatedFavorites = isFavorite
      ? favoriteSongs.filter((id) => id !== song) // Xóa bài hát khỏi yêu thích
      : [...favoriteSongs, song]; // Thêm bài hát vào yêu thích

    if (isFavorite) {
      await removeFavouriteSong(user.user._id, song);
    } else {
      await addFavouriteSong(user.user._id, song);
    }

    dispatch({
      type: actionType.SET_FAVORITE_SONGS,
      favoriteSongs: updatedFavorites,
    });
  }, [favoriteSongs, song, user.user._id, dispatch]);

  // Fetch toàn bộ bài hát
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

  // Fetch danh sách bài hát yêu thích từ API khi trang được tải lại
  useEffect(() => {
    const fetchFavoriteSongs = async () => {
      if (user?.user?._id) {
        const result = await getFavouriteSongs(user.user._id);
        if (result?.data) {
          dispatch({
            type: actionType.SET_FAVORITE_SONGS,
            favoriteSongs: result.data.map((fav) => fav.songId),
          });
        }
      }
    };

    fetchFavoriteSongs();
  }, [user, dispatch]);

  // Lấy dữ liệu bài hát hiện tại với useMemo để tránh tính toán lại không cần thiết
  const currentSong = useMemo(
    () => allSongs.find((s) => s._id === song),
    [allSongs, song]
  );

  return (
    <div className="w-full flex items-center gap-3 overflow-hidden">
      <div
        className={`w-full items-center gap-3 p-4 ${
          miniPlayer ? "absolute top-40" : "flex relative"
        }`}
      >
        <img
          src={currentSong?.imageURL}
          className="w-40 h-20 object-cover rounded-md"
          alt=""
        />
        <div className="flex items-start flex-col">
          <p className="text-xl text-headingColor font-semibold">
            {currentSong?.name.length > 20
              ? currentSong.name.slice(0, 20)
              : currentSong.name}{" "}
            <span className="text-base">({currentSong?.album})</span>
          </p>
          <p className="text-textColor">
            {currentSong?.artist}{" "}
            <span className="text-sm text-textColor font-semibold">
              ({currentSong?.category})
            </span>
          </p>
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
            src={currentSong?.songUrl}
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
              src={currentSong?.imageURL}
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

export default memo(MusicPlayer);
