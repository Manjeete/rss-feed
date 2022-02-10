const RSSParser = require("rss-parser");

const getData = (url) => {
    let parser = new RSSParser();
    return new Promise((resolve, reject) => {
      let entry;
  
      parser.parseURL(url, function (err, feed) {
        if (err) throw reject(err);
         entry = feed.items;
        return resolve(entry);
      });
    });
  };


  module.exports = {
      getData
  }