import axios from "axios";

const baseURL = "http://localhost:4000/";

export const validateUser = async (token) => {
  try {
    const res = await axios.get(`${baseURL}api/users/login`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  } catch (error) {
    return null;
  }
};

export const getAllArtist = async () => {
  try {
    const res = await axios.get(`${baseURL}api/artists/getAll`);
    return res.data;
  } catch (error) {
    return null;
  }
};

export const getAllUsers = async () => {
  try {
    const res = await axios.get(`${baseURL}api/users/getUsers`);
    return res.data;
  } catch (error) {
    return null;
  }
};

export const removeUser = async (userId) => {
  try {
    const res = axios.delete(`${baseURL}api/users/delete/${userId}`);
    return res;
  } catch (error) {
    return null;
  }
};

export const getAllSongs = async () => {
  try {
    const res = await axios.get(`${baseURL}api/songs/getAll`);
    return res.data;
  } catch (error) {
    return null;
  }
};

export const getAllAlbums = async () => {
  try {
    const res = await axios.get(`${baseURL}api/albums/getAll`);
    return res.data;
  } catch (error) {
    return null;
  }
};

export const changingUserRole = async (userId, role) => {
  try {
    const res = axios.put(`${baseURL}api/users/updateRole/${userId}`, {
      data: { role: role },
    });
    return res;
  } catch (error) {
    return null;
  }
};

export const saveNewArtist = async (data) => {
  try {
    const res = axios.post(`${baseURL}api/artists/save`, { ...data });
    return (await res).data.artist;
  } catch (error) {
    return null;
  }
};

export const saveNewAlbum = async (data) => {
  try {
    const res = axios.post(`${baseURL}api/albums/save`, { ...data });
    return (await res).data.album;
  } catch (error) {
    return null;
  }
};

export const saveNewSong = async (data) => {
  try {
    const res = await axios.post(`${baseURL}api/songs/save`, { ...data });
    return res.data.song;
  } catch (error) {
    console.error('Error saving song:', error.response ? error.response.data : error.message);
    return null;
  }
};


export const deleteSongById = async (id) => {
  try {
    const res = axios.delete(`${baseURL}api/songs/delete/${id}`);
    return res;
  } catch (error) {
    return null;
  }
};

export const deleteArtist = async (id) => {
  try {
    const res = await axios.delete(`${baseURL}api/artists/delete/${id}`);
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to delete artist");
    }
  } catch (error) {
    console.error("Error deleting artist:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const deleteAlbum = async (id) => {
  try {
    const res = await axios.delete(`${baseURL}api/albums/delete/${id}`)
    return res.data
  } catch (error) {
    console.log("Error deleting album: ", error)
    throw error
  }
}

export const updateSong = async (id, songData) => {
  try {
    const response = await axios.put(`${baseURL}/api/songs/update/${id}`, songData);
    return response.data;
  } catch (error) {
    console.error("Error updating song:", error);
    throw error;
  }
};

export const addFavouriteSong = async (userId, songId) => {
  try {
    const res = await axios.put(
      `${baseURL}api/users/favourites/${userId}`,
      {},
      {
        params: { songId },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error adding favourite song:", error);
    return null;
  }
};

export const removeFavouriteSong = async (userId, songId) => {
  try {
    const res = await axios.delete(
      `${baseURL}api/users/favourites/${userId}`,
      {
        data: { songId: songId },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error removing favourite song:", error);
    return null;
  }
};

export const getFavouriteSongs = async (userId) => {
  try {
    const res = await axios.get(`${baseURL}api/users/favourites/${userId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching favourite songs:", error);
    return null;
  }
};

export const getSongById = async (id) => {
  try {
    const res = await axios.get(`${baseURL}api/songs/getOne/${id}`);
    return res.data; // Giả sử API trả về thông tin bài hát
  } catch (error) {
    console.error("Error fetching song by ID:", error);
    return null; // Hoặc bạn có thể xử lý theo cách khác
  }
};




