const app = require('express');
const { modelName } = require('../models/model');
const router = app.Router();
const Model = require('../models/model');
module.exports = router;


//Post Method
router.post('/songs', async (req, res, next) => {
    const data = new Model({
        title: req.body.title,
        artist: req.body.artist,
        album: req.body.album,
        genre: req.body.genre
    })

    try {
        const dataToSave = await data.save();

        res.send(dataToSave);
    }
    catch (error) {
        res.status(400).json({ message: error.message })

    }
})

//Get all Method
router.get('/songs', async (req, res, next) => {
    try {
        const data = await Model.find();
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Get by ID Method
router.get('/songs/:id', async (req, res) => {
    try {
        const data = await Model.findById(req.params.id);
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Update by ID Method
router.put('/songs/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await Model.findByIdAndUpdate(
            id, updatedData, options
        )

        res.send(result)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Delete by ID Method
router.delete('/songs/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Model.findByIdAndDelete(id)
        res.send(`Document with ${data.title} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//get number of song
router.get('/getSong', async (req, res) => {
    try {
        const data = await Model.count();
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//get number of song, album, genre and artist
router.get('/statistics', async (req, res) => {
    try {

        // const result = await data.save() // Make sure to wrap this code in an async function
        // console.log(result);

        const titles = await Model.distinct('title').exec();
        const artists = await Model.distinct('artist').exec();
        const albums = await Model.distinct('album').exec();
        const genres = await Model.distinct('genre').exec();


        // count for all fields
        const totalNumberForAllFields = {
            title: titles.length,
            artist: artists.length,
            album: albums.length,
            genre: genres.length
        }

        // count of song for all artists
        const allArtistsSongCount = await Promise.all(artists.map(async uniqueArtist => {
            const agg = await Model.aggregate([
               {
                   $match: { artist: uniqueArtist }
               },
               {
                   $group: {
                       _id: "$artist",
                       count: { $sum: 1 }
                   }
               }

           ]);
           return agg[0];
       }));

       // count of song in all albums
       const allSongsInAlbumCount = await Promise.all(albums.map(async uniqueAlbum => {
        const agg = await Model.aggregate([
           {
               $match: { album: uniqueAlbum }
           },
           {
               $group: {
                   _id: "$album",
                   count: { $sum: 1 }
               }
           }

       ]);
       return agg[0];
   }));


   // count of song in all genre
   const allSongsInGenreCount = await Promise.all(genres.map(async uniqueGenre => {
    const agg = await Model.aggregate([
       {
           $match: { genre: uniqueGenre }
       },
       {
           $group: {
               _id: "$genre",
               count: { $sum: 1 }
           }
       }

   ]);
   return agg[0];
}));



       const statistics = {
        totalNumberForAllFields,
        allArtistsSongCount,
        allSongsInAlbumCount,
        allSongsInGenreCount
       }


        res.status(200).json(statistics);


    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

