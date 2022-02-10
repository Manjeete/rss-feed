const cors = require("cors");
const express = require("express");
const {getData} = require("./rss");
const mongoose = require('mongoose')

require('dotenv').config()

const app = express();

//middleware
app.use(express.json());
app.use(cors());

//database connection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Database Connected Successfully"))
.catch((err) => console.log(err));

//models
const Feed = require("./models/feed")
  

const writeData = (arr,keyword) =>{
    return new Promise((resolve,reject) =>{
        arr.forEach(async feed => {
            await Feed.create({
                creator:feed.creator,
                title:feed.title,
                link:feed.link,
                categories:feed.categories,
                content:feed.content,
                keyword:keyword
            })
        });
        let data = Feed.find({keyword:keyword})
        return resolve(data)
    })
}

//routes
app.get("/search/:keyword", async (req, res) => {
    try{
        const keyword = req.params.keyword
        let checkKeyword = await Feed.find({keyword:keyword});
        if(checkKeyword.length){
            return res.status(200).json({
                status:true,
                feed:checkKeyword
            })
        }

        let url = `https://medium.com/feed/tag/${keyword}`
        
        const rssFeed = await getData(url);
        if(rssFeed) {
            let data = await writeData(rssFeed,keyword)
        }

        let udpatedFeed = await Feed.find({keyword:keyword})
        res.status(200).json({
            status:true,
            feed:udpatedFeed
        });
        

    }catch(err){
        console.log(err)
        return res.status(500).json({
            status:false,
            msg:err.message
        })
    }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
