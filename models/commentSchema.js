const mongoose=require('mongoose');

const commentSchema=mongoose.Schema({
    commentText:String,

    user:[{
        type:mongoose.Types.ObjectId,
        ref:'users'
    }],
    novel:{
        type:mongoose.Types.ObjectId,
        ref:'novels'
    }

})

const commentModel=mongoose.model('comments',commentSchema);

module.exports=commentModel;