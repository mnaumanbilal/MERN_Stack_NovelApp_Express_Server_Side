const mongoose = require("mongoose");

const userSchema = mongoose.Schema({

  name: {type:String, required:true},

  email: {type:String, required:true},

  password: {type:String, required:true},

  roles: {
    type:[String],
    default:"user"
  },

  novelWorks: {type: String, default: "none"},

  followers: {type: Number, default: 0},

  wishlist: {type: String, default: "empty"},

  profilePic:String,

  novel:[{
    type:mongoose.Types.ObjectId,
    ref:'novels'
}],
comments:[{
    type:mongoose.Types.ObjectId,
    ref:'comments'
}]

  

});
const User = mongoose.models.users || mongoose.model("users", userSchema);
module.exports = User;
