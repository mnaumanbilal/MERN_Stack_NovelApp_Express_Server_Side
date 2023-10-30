var express = require("express");
var router = express.Router();
var Product = require("../models/Product");
const User = require("../models/User");
const auth = require("../routes/api/auth")
const sessionAuth = require("../middlewares/sessionAuth")
//const uploads = require("")

// token and config for jwt private key
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const config = require("config");

const upload = require("../middlewares/multer")

/* We do not direct store the actual password in the DB but rather
we will use it to hash user's password and store the generated dummy string.*/
const bcrypt = require("bcryptjs");
const { token } = require("morgan");


/* GET home page. */
router.get("/login", function (req, res, next) {
  return res.render("site/login");
});

// ============= LOGIN Method (POST) === START ========
router.post("/login", async function (req, res, next) {
  console.log("Executing index.js - Login func")
  //first we find if given user who's trying to login exists or not.
  // complete obj(name, ) of user fetched by email id
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    req.flash("danger", "User with this email not present");
    //return res.redirect("/login");
    return res.send(false)
  }
  

  // here we validate the entered password
  const validPassword = await bcrypt.compare(req.body.password, user.password);

  console.log("req.body.password = "+ req.body.password)
  console.log("user.pssword = " + user.password)

  if (validPassword) {

    // session has user email now
    req.session.user = user;

    // res.locals.user = req.session.user (to use session in all views.ejs files)

    const token = jwt.sign(
      {
        _id: user._id,
        roles: user.roles,
        name: user.name,
        email: user.email,
        // profilePic:user.profilePic,
      },
   
      config.get("jwtPrivateKey") 
      // {expiresIn:"10 minutes"} give token expiry
    );
  
    console.log("Token = " + token)

    res.cookie("token", token, {expires:new Date(Date.now() + 900000)})
    res.send(token);
    
    req.flash("success", "Logged in Successfully");
    
    //res.send(token);
    // return res.redirect("/");

  } else {
    req.flash("danger", "Invalid Password");
    //return res.redirect("/login");
    return res.send(false)
  }
});
// ------------ LOGIN ----END---------//


// ========== REGISTERATION === START =============

// rendering the registeration form
router.get("/register", function (req, res, next) {
  return res.render("site/register");
});

// registering a user
router.post("/register", upload.single("profilePic"), async function (req, res, next) {

  // first we will check if user who's trying to make an ACC already exists or not.
  // if exists we show a flash msg that he's already got an acc in our DB.
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    req.flash("danger", "User with given email already registered");
    // redirect user back to the registration form.
    return res.redirect("/register"); // return from here so program flow doesn't go forward
  }
  
  const url=req.protocol + '://' + req.get('host');
  // if email id was fresh then we create the user
  // same work as user.email = req.body.email etc
  if(req.file){
    user = new User();

    user.name = req.body.name
    user.email = req.body.email
    user.profilePic=url + '/images/uploaded/' + req.file.filename;
  
  
    // generate salt (salt is generated for each user once in a life time)
    const salt = await bcrypt.genSalt(10);
  
    // user.password is the actual field name
    // hashing/encrypting the password.
    user.password = await bcrypt.hash(req.body.password, salt);
  
    await user.save();
    return res.redirect("/login");
  }
  else{
    user = new User();

  user.name = req.body.name
  user.email = req.body.email
  user.profilePic=url + '/images/uploaded/' + 'userdefault.png'


  // generate salt (salt is generated for each user once in a life time)
  const salt = await bcrypt.genSalt(10);

  // user.password is the actual field name
  // hashing/encrypting the password.
  user.password = await bcrypt.hash(req.body.password, salt);

  await user.save();
  return res.redirect("/login");
  }
  
});

// ---------- Registeration --- END ------------

// ====== LOGOUT ======
router.get("/logout", async (req, res) => {

  // empty the session to logout the user
  req.session.user = null;
  console.log("session clear");
  return res.redirect("/login");
});

router.get("/contact-us", function (req, res, next) {
  return res.render("site/contact", { layout: "layout" });
});

router.get("/admin", (req,res)=>{
  res.render("site/adminpanel.ejs")
})

router.get("/", async function (req, res, next) {
  let products = await Product.find();
  return res.render("site/homepage", {
    pagetitle: "Awesome Novels",
    products,
  });
});

router.get("/UserInfo/:email", async (req, res, next)=>{
  let userInfo = await User.findOne({email:req.params.email})
  if(userInfo){
  console.log("User Info: email= " + userInfo.name)
  return res.send(userInfo) // send user object if email is validated
  }
  else 
  return res.send(false)

})

module.exports = router;

//module.exports = token
