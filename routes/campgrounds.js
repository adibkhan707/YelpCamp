var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campgrounds");
var middleware=require("../middleware");

router.get("/", function (req, res) {
    //Get all campgrounds from db
    Campground.find({}, (err, allCampgrounds) => {
        if (err) console.log("oops! Error occured")
        else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds });
        }
    })
})

router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new")
})

router.get("/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err||!foundCampground){
            req.flash("error","Campground not found")
            res.redirect("/campgrounds")
        } 
        else res.render("campgrounds/show", { campground: foundCampground });
    })

})

//Index route
router.post("/", middleware.isLoggedIn, (req, res) => {
    //get data from form to add to campgrounds array
    var name = req.body.name;
    var price=req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = { name: name, price:price, image: image, description: desc, author: author };
    Campground.create(newCampground, function (err, result) {
        if (err) console.log("something went wrong")
        //redirect to campgrounds page
        else res.redirect("/campgrounds")
    })
})

//Edit route
router.get("/:id/edit",middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err,campground) {
        //if(err) console.log("error finding campground")
        res.render("campgrounds/edit", { campground });
    });
});

//Update route
router.put("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, done) {
        if (err) res.redirect("/campgrounds");
        else res.redirect("/campgrounds/" + req.params.id);
    })
})

//delete route
router.delete("/:id",middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err,result) {
        if(err){
            req.flash("error","Error removing campground.")
            return res.redirect("/campgrounds");
        }
        else res.redirect("/campgrounds");
    });
});

module.exports = router;