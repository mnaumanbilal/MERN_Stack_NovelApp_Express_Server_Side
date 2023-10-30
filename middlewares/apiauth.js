const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../models/User");
//const cookie = require("cookie-parser")

async function apiauth(req, res, next) {

  // token = req.header("authToken")
// now instead of header we get token from cookie
  const token = req.cookies.token
  console.log(token);

  

  if (!token) 
  {return res.status(401).send("Access denied. No token provided.");}

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));

    //const user = await User.findById(decoded._id).select("-password");
    const user = await User.findById(decoded._id).select("-password");
    if (!user) return res.status(400).send("Invalid token: User Dont exist");
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong at server");
  }
}

module.exports = apiauth;
