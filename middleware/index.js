var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, foundCampground) {
            if (err||!foundCampground) {
                req.flash("error", "Campground not found");
                res.redirect("back");
            } else {
                // does user own the campground?
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });

    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/login");
    }
}

middlewareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err||!foundComment) {
                req.flash("error", "Error finding comment.")
                res.redirect("back");
            }
            else {
                //does user own campground
                if (foundComment.author.id.equals(req.user._id)) {
                    //req.flash("error","You don't have permission to do that.")
                    next();
                }
                else res.send("YOU DO NOT HAVE PERMISSION TO DO THAT")
            }
        })
    }

    else {
        req.flash("error", "You need to log in to do that.")
        res.redirect("/login");
    }
}

middlewareObj.isLoggedIn = function (req, res, next) {

    if (req.isAuthenticated()) return next();
    else {
        req.flash("error", "You need to log in to do that")
        res.redirect("/login");
    }

}

module.exports = middlewareObj;
