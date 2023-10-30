
// i.e pic/any file uploading etc
const multer = require("multer");


const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "public/images/uploaded"); // local dir link
  },
  filename: (req, file, callBack) => {
    
    // 1st parameter is always null, 2nd parameter will save the profile image by its original file name. 
    callBack(null, file.originalname);
  },
});

let upload = multer({ storage, fileFilter:(req,file,cb)=>{
  if(file.mimetype=='image/png' || file.mimetype=='image/jpeg' || file.mimetype=='image/jpg' ){
    return cb(null,true);
  }
  else{
    return cb(null,new Error('Invalid Format'));
  }
} });

module.exports = upload;