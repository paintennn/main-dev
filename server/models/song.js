const mongoose = require("mongoose");

const SongSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    imageURL: {
      type: String,
      required: true,
    },
    songUrl: {
      type: String,
      required: true,
    },
    album: {
      type: String,
    },
    artist: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    releaseDate: {  // Ngày phát hành
      type: Date,
      required: false,
    },
    provider: {  // Nhà cung cấp
      type: String,
      required: false,
    },
    lyrics: {  // Thêm trường lyrics
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("song", SongSchema);
