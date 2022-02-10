const mongoose = require("mongoose");

const feedSchema = new mongoose.Schema({
    creator:{
        type:String,
        trim:true
    },
    title:{
        type:String,
        required:true
    },
    link:String,
    categories:[],
    content:String,
    keyword:String
},
    {timestamps:true}
)

module.exports = mongoose.model("Feed",feedSchema,"Feed");