const artist = require("../models/artist");
const song = require("../models/song");


const router = require("express").Router();

router.get("/getAll", async (req, res) => {
  const options = {
    // sort returned documents in ascending order
    sort: { createdAt: 1 },
    // Include only the following
    // projection : {}
  };

  const cursor = await artist.find(options);
  if (cursor) {
    res.status(200).send({ success: true, data: cursor });
  } else {
    res.status(200).send({ success: true, msg: "No Data Found" });
  }
});

router.get("/getOne/:getOne", async (req, res) => {
  const filter = { _id: req.params.getOne };

  const cursor = await artist.findOne(filter);

  if (cursor) {
    res.status(200).send({ success: true, data: cursor });
  } else {
    res.status(200).send({ success: true, msg: "No Data Found" });
  }
});

router.post("/save", async (req, res) => {
  const newArtist = artist({
    name: req.body.name,
    imageURL: req.body.imageURL,
    twitter: req.body.twitter,
    instagram: req.body.instagram,
  });
  try {
    const savedArtist = await newArtist.save();
    res.status(200).send({ artist: savedArtist });
  } catch (error) {
    res.status(400).send({ success: false, msg: error });
  }
});

router.put("/update/:updateId", async (req, res) => {
  const filter = { _id: req.params.updateId };
  const options = {
    upsert: true,
    new: true,
  };
  try {
    const result = await artist.findOneAndUpdate(
      filter,
      {
        name: req.body.name,
        imageURL: req.body.imageURL,
        twitter: req.body.twitter,
        instagram: req.body.instagram,
      },
      options
    );
    res.status(200).send({ artist: result });
  } catch (error) {
    res.status(400).send({ success: false, msg: error });
  }
});

router.delete("/delete/:deleteId", async (req, res) => {
  const artistId = req.params.deleteId; // Lấy artistId từ params

  try {
    // Xóa tất cả các bài hát liên quan đến artist
    await song.deleteMany({ artist: artistId });

    // Xóa artist
    const result = await artist.deleteOne({ _id: artistId });

    if (result.deletedCount === 1) {
      res.status(200).send({ success: true, msg: "Artist and related songs deleted successfully." });
    } else {
      res.status(404).send({ success: false, msg: "Artist Not Found" });
    }
  } catch (error) {
    console.error("Error deleting artist:", error); // In lỗi ra console
    res.status(500).send({ success: false, msg: "Internal Server Error" });
  }
});


module.exports = router;
