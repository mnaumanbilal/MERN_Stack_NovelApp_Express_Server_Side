var express = require("express");
var router = express.Router();
var Product = require("../../../models/Product");

// gets all novels
router.get("/", async function (req, res, next) {
  
  console.log("inside product");
  //setTimeout(async () => {

    let newNovelApi = await Product.find();

    newNovelApi.map((novel)=>{
      console.log("Executing MAP function")
      if(novel.chapters && novel.chapters.length > 0){
          console.log("before -> novel.chapters.length = " + novel.chapters.length)
        for(let i = 0; i<novel.chapters.length; i++){
           console.log("i = " + i)
          novel.chapters.length = 0
            console.log("after -> novel.chapters.length POP = " + novel.chapters.length)
        }
      }  
  })

    res.send(newNovelApi);

 // }, 0);

});
module.exports = router;

/**
 *   //   newNovelApi.map((novel,index)=>{
  //     if(novel.chapters && novel.chapters.length > 0){
  //       for(let i = 0; i<novel.chapters.length; i++){
  //         novel.chapters.pop()
  //       }
  //     }  
  // })
 */


/*
  newNovelApi.map((novel)=>{
    console.log("Executing MAP function")
    if(novel.chapters && novel.chapters.length > 0){
        console.log("before -> novel.chapters.length = " + novel.chapters.length)
      for(let i = 0; i<novel.chapters.length; i++){
         console.log("i = " + i)
        novel.chapters.length = 0
          console.log("after -> novel.chapters.length POP = " + novel.chapters.length)
      }
    }  
})

*/
