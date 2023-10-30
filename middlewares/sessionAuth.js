//sets user variable for pug files
async function sessionAuth(req, res, next) {

  console.log("Execution sessionAuth.js Router")
  
  // accessible by all views pages - public
  res.locals.user = req.session.user;

  // req.session.user has entire object of the logged-in user

  // the isAdmin boolean are used in ejs files to check if admin is logged-in
  res.locals.isAdmin = false;
  if (req.session.user) {
    res.locals.isAdmin = Boolean(
      req.session.user.roles.find((r) => {r == "user"})
    );
  } else req.session.user = null;
  //set flash function to req;
  //use req.flash("info","message") in router to set a flash message
  req.flash = function (type, message) {
    req.session.flash = { type, message };
  };
  //if flash message is set. set it to res.locals and clear it.
  if (req.session.flash) {
    res.locals.flash = req.session.flash;
    req.session.flash = null;
  }
  next();
}

module.exports = sessionAuth;
