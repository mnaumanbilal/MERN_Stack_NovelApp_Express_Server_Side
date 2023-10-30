const mongoose = require("mongoose");
const productSchema = mongoose.Schema({
  name: {type: String, required: true},
  description: {type: String, default:"New Novel"},
  author:{type:String, required: true},
  genre: {type: [String], required: true},
  imgLink: String,
  likes: {type:Number, default: 0},
  views: {type:Number, default: 0},
  favourites: {type: Number, default: 0},
  chapters: {type:[String], default:["This Chapter is not Available yet! Wait Patiently!"]},

  user:{
    type:mongoose.Types.ObjectId,
    ref:'users'
},
comments:[{
    type:mongoose.Types.ObjectId,
    ref:'comments'
}]
});

const Product = mongoose.models.novels || mongoose.model("novels", productSchema);
module.exports = Product;
