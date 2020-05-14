var mongoose = require("mongoose");
var comment=require("./comment");
     
var campgroundSchema = new mongoose.Schema({
   name: String,
   price:String,
   image: String,
   description: String,
   createdAt: {type:Date, default:Date.now},
   author:{
      id:{
         type:mongoose.Schema.Types.ObjectId,
         ref:"User"
      },

      username:String
   },
   comments:  [
    {
       type: mongoose.Schema.Types.ObjectId,
       ref: "Comment"
    }
 ]
});

campgroundSchema.pre("remove",async function(next){
   try{
      await comment.deleteMany({
         "_id":{
            $in: this.comments
         }
         
      })
      next()
   }
   catch(err)
   {
      next(err);
   }
})
 
module.exports = mongoose.model("Campground", campgroundSchema);