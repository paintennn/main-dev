import React, { useEffect, useState } from "react";
import Header from "./Header";
import { useParams } from "react-router-dom"; // Nhập useParams
import { getSongById } from "../api"; // Nhập hàm gọi API

const SongDetail = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [song, setSong] = useState(null); // Khởi tạo state cho bài hát

  useEffect(() => {
    const fetchSongDetail = async () => {
      try {
        const response = await getSongById(id); // Gọi API để lấy thông tin bài hát
        if (response && response.success) {
          setSong(response.data); // Cập nhật state với data từ API
        } else {
          console.error("No data found"); // Xử lý trường hợp không có dữ liệu
        }
      } catch (error) {
        console.error("Error fetching song detail:", error); // Xử lý lỗi
      }
    };

    fetchSongDetail();
  }, [id]);

  return (
    <div className="w-full h-auto flex flex-col items-center justify-center bg-primary">
      <Header />
      {song ? ( // Kiểm tra xem bài hát có tồn tại không
        <div className="p-4">
          <h2 className="text-xl font-semibold">{song.name}</h2>
          <img
            src={song.imageURL}
            alt={song.name}
            className="w-48 h-48 object-cover my-4"
          />
          <p className="text-md">Artist: {song.artist}</p>
          <p className="text-sm">
            Released: {new Date(song.releaseDate).toLocaleDateString()}
          </p>
          <p className="text-sm">Provider: {song.provider}</p>
          <p className="text-sm">Lyrics: {song.lyrics}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default SongDetail;
