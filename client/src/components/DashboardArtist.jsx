import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useStateValue } from "../Context/StateProvider";
import { IoLogoInstagram, IoLogoTwitter } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { getAllArtist, deleteArtist } from "../api";
import { actionType } from "../Context/reducer";

const DashboardArtist = () => {
  const [{ artists }, dispatch] = useStateValue();

  useEffect(() => {
    if (!artists || artists.length === 0) {
      getAllArtist().then((data) => {
        dispatch({ type: actionType.SET_ARTISTS, artists: data.data });
      });
    }
  }, [artists, dispatch]);

  const handleDeleteArtist = useCallback(
    (artistId) => {
      if (
        window.confirm(
          "Are you sure you want to delete this artist? This will also delete all related songs."
        )
      ) {
        deleteArtist(artistId)
          .then(() => {
            const updatedArtists = artists.filter(
              (artist) => artist._id !== artistId
            );
            dispatch({ type: actionType.SET_ARTISTS, artists: updatedArtists });
          })
          .catch((error) => {
            console.error("Error deleting artist:", error);
            alert("Failed to delete artist. Please try again.");
          });
      }
    },
    [artists, dispatch]
  );

  return (
    <div className="w-full p-4 flex items-center justify-center flex-col">
      <div className="relative w-full gap-3 my-4 p-4 py-12 border border-gray-300 rounded-md flex flex-wrap justify-evenly">
        {artists &&
          artists.map((data, index) => (
            <ArtistCard
              key={data._id}
              data={data}
              index={index}
              onDelete={handleDeleteArtist}
            />
          ))}
      </div>
    </div>
  );
};

export const ArtistCard = ({ data, index, onDelete }) => {
  const [isDelete, setIsDelete] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, translateX: -50 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="relative w-44 min-w-180 px-2 py-4 gap-3 cursor-pointer hover:shadow-xl hover:bg-card bg-gray-100 shadow-md rounded-lg flex flex-col items-center"
    >
      <img
        src={data?.imageURL}
        className="w-full h-40 object-cover rounded-md"
        alt="artist"
      />
      <p className="text-base text-textColor">{data.name}</p>
      <div className="flex items-center gap-4">
        <a href={data.instagram} target="_blank" rel="noopener noreferrer">
          <motion.i whileTap={{ scale: 0.75 }}>
            <IoLogoInstagram className="text-gray-500 hover:text-headingColor text-xl" />
          </motion.i>
        </a>
        <a href={data.twitter} target="_blank" rel="noopener noreferrer">
          <motion.i whileTap={{ scale: 0.75 }}>
            <IoLogoTwitter className="text-gray-500 hover:text-headingColor text-xl" />
          </motion.i>
        </a>
      </div>
      <motion.i
        className="absolute bottom-2 right-2"
        whileTap={{ scale: 0.75 }}
        onClick={() => setIsDelete(true)}
      >
        <MdDelete className="text-gray-400 hover:text-red-400 text-xl cursor-pointer" />
      </motion.i>

      {isDelete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="absolute inset-0 p-4 bg-darkOverlay backdrop-blur-md flex flex-col items-center justify-center gap-4 rounded-md"
        >
          <p className="text-gray-100 text-base text-center">
            Are you sure you want to delete this artist?
          </p>
          <div className="flex items-center w-full justify-center gap-3">
            <div
              className="bg-red-500 px-3 py-2 rounded-md cursor-pointer hover:bg-red-700"
              onClick={() => {
                onDelete(data._id);
                setIsDelete(false);
              }}
            >
              <p className="text-white text-sm">Yes</p>
            </div>
            <div
              className="bg-green-500 px-3 py-2 rounded-md cursor-pointer hover:bg-green-700"
              onClick={() => setIsDelete(false)}
            >
              <p className="text-white text-sm">No</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DashboardArtist;
