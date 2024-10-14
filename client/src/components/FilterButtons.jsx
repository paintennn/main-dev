import React, { useEffect, useState, useRef } from "react";
import { IoChevronDown } from "react-icons/io5";
import { motion } from "framer-motion";
import { useStateValue } from "../Context/StateProvider";
import { actionType } from "../Context/reducer";

const FilterButtons = ({ filterData, flag }) => {
  const [filterName, setFilterName] = useState(null);
  const [filterMenu, setFilterMenu] = useState(false);
  const menuRef = useRef(null);

  const [{ artists, albums }, dispatch] = useStateValue();

  const updateFilterButton = (name) => {
    setFilterName(name === "None" ? null : name);
    setFilterMenu(false);

    if (flag === "Artist") {
      dispatch({
        type: actionType.SET_ARTIST_FILTER,
        artistFilter: name === "None" ? null : name,
      });
    }
    if (flag === "Language") {
      dispatch({
        type: actionType.SET_LANGUAGE_FILTER,
        languageFilter: name === "None" ? null : name,
      });
    }
    if (flag === "Albums") {
      dispatch({
        type: actionType.SET_ALBUM_FILTER,
        albumFilter: name === "None" ? null : name,
      });
    }
    if (flag === "Category") {
      dispatch({
        type: actionType.SET_FILTER_TERM,
        filterTerm: name === "None" ? null : name,
      });
    }
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setFilterMenu(false);
    }
  };

  useEffect(() => {
    // Thêm sự kiện click bên ngoài
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="border border-gray-300 rounded-md px-4 py-1 relative cursor-pointer hover:border-gray-400"
      ref={menuRef}
    >
      <p
        className="text-base tracking-wide text-textColor flex items-center gap-2"
        onClick={() => setFilterMenu(!filterMenu)}
      >
        {filterName || flag}
        <IoChevronDown
          className={`text-base text-textColor duration-150 transition-all ease-in-out ${
            filterMenu ? "rotate-180" : "rotate-0"
          }`}
        />
      </p>
      {filterData && filterMenu && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="w-48 z-50 backdrop-blur-sm max-h-44 overflow-y-scroll scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-400 py-2 flex flex-col rounded-md shadow-md absolute top-8 left-0"
        >
          <div
            className="flex items-center gap-2 px-4 py-1 hover:bg-gray-200"
            onClick={() => updateFilterButton("None")}
          >
            <p className="w-full">None</p>
          </div>
          {filterData?.map((data) => (
            <div
              key={data.name}
              className="flex items-center gap-2 px-4 py-1 hover:bg-gray-200"
              onClick={() => updateFilterButton(data.name)}
            >
              {(flag === "Artist" || flag === "Albums") && (
                <img
                  src={data.imageURL}
                  className="w-8 min-w-[32px] h-8 rounded-full object-cover"
                  alt=""
                />
              )}
              <p className="w-full">
                {data.name.length > 15
                  ? `${data.name.slice(0, 14)}...`
                  : data.name}
              </p>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default FilterButtons;
