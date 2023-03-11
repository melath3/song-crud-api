const mongoose = require('mongoose');




const dataSchema = new mongoose.Schema(
    {
    title:{
        type:String,
        required:true,
        unique:true
    },
    artist:{
        type:String,
        required:true,
        
    },
    album:{
        type:String,
        required:true,
        
    },
    genre:{
        type:String,
        required:true,
        
    },
})

module.exports = mongoose.model('Data', dataSchema)