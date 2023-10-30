var express = require("express");
var router = express.Router();
var NovelModel = require("../../models/Product");

const auth = require("../../routes/api/auth")
const admin = require("../../middlewares/admin")
const commentModel = require("../../models/commentSchema")
const userModel = require("../../models/User")

// LINK = "/api/novels"


// for novel detail page
router.get("/:id", async function (req, res, next) {
  let Novel = await NovelModel.findById(req.params.id);
  let newNovel = {...Novel}

  delete newNovel.chapters
  newNovel.chapters = "preview version"

  console.log("new novel = "+newNovel)
  return res.send(newNovel);
});

router.get("/", async function (req, res, next) {
  let Novels = await NovelModel.find();
  let newNovelApi = {...Novels}
  //newNovelApi.chapters = ""
  for (let i=0; i<newNovelApi.length; i++){
    delete newNovelApi[i].chapters
    newNovelApi[i].chapters = "preview version"
  }

  return res.send(newNovelApi);
});

// router.post("/", admin, async (req,res)=>{

router.post("/", async (req,res)=>{
  let newNovel = new NovelModel()
  newNovel.name = req.body.name;
  newNovel.author = req.body.author;
  newNovel.genre = req.body.genre;
  newNovel.description = req.body.description;
  newNovel.likes = req.body.likes;
  newNovel.views = req.body.views;
  newNovel.imgLink = req.body.imgLink;
  newNovel.favourites = req.body.favourites;
  await newNovel.save();
 // req.flash("success", "Item was added Successfully!");
   return res.send(newNovel);
  
})


// router.post("/", upload.single("image"), async function (req, res, next) {
//   let newNovel = new NovelModel(req.body);
//   if (req.file) newNovel.image = req.file.filename;
//   await newNovel.save();
//   res.send(newNovel);
// });

router.post("/", admin, async (req,res)=>{
  let newNovel = new NovelModel()

  newNovel.name = req.body.name;
  newNovel.author = req.body.author;
  newNovel.genre = req.body.genre;
  newNovel.description = req.body.description;
  newNovel.likes = req.body.likes;
  newNovel.views = req.body.views;
  newNovel.imgLink = req.body.imgLink;
  newNovel.favourites = req.body.favourites;
  await newNovel.save();
  return res.send(newNovel);
  
})

router.put("/:id", async function (req, res, next) {
  let newNovel = await NovelModel.findById(req.params.id);
  newNovel.name = req.body.name;
  newNovel.author = req.body.author;
  newNovel.genre = req.body.genre;
  newNovel.description = req.body.description;
  newNovel.likes = req.body.likes;
  newNovel.views = req.body.views;
  newNovel.imgLink = req.body.imgLink;
  newNovel.favourites = req.body.favourites;
  await newNovel.save();
  return res.send(newNovel);
});
router.delete("/:id", async function (req, res, next) {
  try {
    let newNovel = await NovelModel.findById(req.params.id);
    await newNovel.delete();
    return res.send("deleted");
  } catch (err) {
    return res.status(400).send("Invalid Id");
  }
});

router.get("/get/comments/:novelID", async (req, res)=> { 
  // path: prop-in-comment-schema(from user prop which contains reference to users table), select: field=> name
  const comments = await commentModel.find({novel:req.params.novelID}).populate([{path:'user', select:('name')}]);
  console.log("Comment Found = " + comments.commentText)
    res.send(comments)

})

//get chapter:
router.get("/chapter/:novelID/:chpNumber", async (req,res)=>{
  const novel = await NovelModel.findById(req.params.novelID)
  let index = Number(req.params.chpNumber)
  console.log("Index is = " + index)
  console.log("Novel is = " + novel)
  console.log("novel.chapters.length = " + novel.chapters[0])

  const chapter = novel.chapters[index]
  console.log("novel.chapter is = " + chapter)

  if(chapter){
    //const chapter = novel.chapters[index]
    res.send(chapter)}
  else
  res.send("This Chapter Does Not Exist!")

})

router.post("/submit/comment/:UID/:novelID", async (req, res)=> {
  
  let user = await userModel.findOne({_id:req.params.UID})
  let novel = await NovelModel.findOne({_id:req.params.novelID})

  let comment = new commentModel()
  comment.commentText = req.body.commentText
  comment.user = user._id
  comment.novel = novel._id
  await comment.save()

  novel.comments.push(comment)
  await novel.save()

  user.comments.push(comment)
  await user.save()

  res.send("comment added")
  
  
})
module.exports = router;
