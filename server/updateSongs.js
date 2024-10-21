const mongoose = require("mongoose");
const songModel = require("./models/song"); // Đường dẫn đến mô hình của bạn
require("dotenv").config(); // Import dotenv để sử dụng biến môi trường

// Kết nối đến MongoDB
mongoose.connect(process.env.DB_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Danh sách các nhà cung cấp âm nhạc
const providers = [
    "Music Provider A",
    "Music Provider B",
    "Music Provider C",
    "Music Provider D",
    "Music Provider E",
    "Music Provider F"
];

// Hàm tạo ngày ngẫu nhiên trong khoảng thời gian nhất định
const getRandomDate = (start, end) => {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0]; // Trả về định dạng YYYY-MM-DD
};

const updateSongs = async () => {
    try {
        const songs = await songModel.find();

        for (const song of songs) {
            song.releaseDate = getRandomDate(new Date(2000, 0, 1), new Date()); // Ngày phát hành ngẫu nhiên từ năm 2000 đến hiện tại
            song.provider = providers[Math.floor(Math.random() * providers.length)]; // Chọn nhà cung cấp ngẫu nhiên
            song.lyrics =
                "Đây là lời bài hát ví dụ dài. " +
                "Lời bài hát này có thể bao gồm nhiều câu và nhiều ý tưởng khác nhau. " +
                "Chúng ta có thể viết về tình yêu, nỗi nhớ, và nhiều cảm xúc khác. " +
                "Hãy để âm nhạc mang lại niềm vui và sự an lành cho mọi người. " +
                "Âm nhạc là ngôn ngữ của tâm hồn. " +
                "Hãy cùng nhau thưởng thức những giai điệu tuyệt vời.";

            await song.save(); // Lưu bài hát đã được cập nhật
            console.log(`Đã cập nhật bài hát: ${song.name}`);
        }

        console.log("Đã cập nhật tất cả bài hát.");
    } catch (error) {
        console.error("Lỗi khi cập nhật bài hát:", error);
    } finally {
        mongoose.connection.close(); // Đóng kết nối
    }
};

updateSongs();
