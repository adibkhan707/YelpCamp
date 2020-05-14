var express=require("express");
var router=express.Router();
var user=require("../models/user");
var passport=require("passport");

router.get("/",function(req,res){
    res.render("landing")
})

//AUTH ROUTES
router.get("/register",function(req,res){
    res.render("register");
})

router.post("/register",function(req,res){
    var newUser=new user({username:req.body.username});
    user.register(newUser,req.body.password,function(err,user){
        if(err) {
            return res.render("register", {"error":err.message});;
        }
        else{
            passport.authenticate("local")(req,res,function(){
                req.flash("success","Welcome to yelpcamp "+newUser.username)
                res.redirect("/campgrounds")
            });
        }
    });
});

router.get("/login",function(req,res){
    res.render("login");
});

router.post("/login",passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect:"/login",
    failureFlash:true
}),function(req,res){
});

router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Logged you out!");
    res.redirect("/campgrounds");
})

module.exports=router;