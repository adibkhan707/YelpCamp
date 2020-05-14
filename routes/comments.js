var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");
var middleware=require("../middleware");
//____________________________________________________________

//COMMENTS ROUTES

//____________________________________________________________

//NEW ROUTE FOR ADDING COMMENTS (SHOULD SHOW A FORM TO ADD COMMENTS)
router.get("/new", middleware.isLoggedIn, function (req, res) {
    //find by id
    Campground.findById(req.params.id, (err, campground) => {
        if (err||!campground) {
            req.flash("error","Error finding campground")
            res.redirect("/campgrounds")
        }
        else res.render("comments/new", { campground: campground });
    })
})

router.post("/", middleware.isLoggedIn, function (req, res) {
    //lookup using id
    Campground.findById(req.params.id, function (err, campground) {
        if (err) 
        {
            req.flash("error","Error finding campground. Stop using rest clients to make post requests you little shite");
            return res.redirect("/campgrounds")
        }
        else {
            //create a new comment
            Comment.create(req.body.comment, function (err, comment) {
                if (err) console.log("Error creating comment")
                else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save the comment
                    comment.save();
                    //insert the comment in campground object
                    campground.comments.push(comment);
                    campground.save((err) => {
                        if (err) console.log("error while saving");
                        else res.redirect("/campgrounds/" + campground._id)
                    });
                }
            });
        }
    });
});

//edit route
router.get("/:comment_id/edit",middleware.checkCommentOwnership, function (req, res) {
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err||!foundCampground){
            req.flash("error","Campground not found"); 
            return res.redirect("/campgrounds");
        }

        else{
            Comment.findById(req.params.comment_id, function (err, comment) {
                res.render("comments/edit",{comment:comment, campground_id:req.params.id});
        });
        }
    })
    
});

//update route
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,done){
        if(err)console.log("Error updating comment")
        else res.redirect("/campgrounds/"+req.params.id);
    });
});

//delete route
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.deleteOne({ _id:req.params.comment_id},function(err,done){
        if(err) console.log("Error deleting comment")
        else res.redirect("/campgrounds/"+req.params.id)
    })

    // Comment.findByIdAndRemove(req.params.comment_id,function(err,foundComment){
    //     if(err) console.log("Error finding comment")
    //     else res.redirect("/campgrounds/"+req.params.id)
    // })
})

module.exports = router;