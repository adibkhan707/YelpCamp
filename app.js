var express=require("express");
var mongoose=require("mongoose");
var passport=require("passport");
var localStrategy=require("passport-local");
var user=require("./models/user")
var expressSession=require("express-session");
var commentRoutes=require("./routes/comments.js");
var indexRoutes=require("./routes/index.js");
var campgroundRoutes=require("./routes/campgrounds")
var methodOverride=require ("method-override");
var flash=require("connect-flash");

var app=express();
//mongoose.connect("mongodb://localhost:27017/yelp_camp",{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
mongoose.connect("mongodb+srv://adib:vAlQBPHVERiTIlUV@cluster0-jffyo.mongodb.net/test?retryWrites=true&w=majority",{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
app.use(methodOverride('_method'));
app.use(flash());
var Campground=require("./models/campgrounds");
var Comment=require("./models/comment");

app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
var seedDB=require("./seeds.js");
app.use(express.static(__dirname+"/public"));

app.use(expressSession({
    secret:"this is yelpCamp app",
    resave:false,
    saveUninitialized:false
}));

app.locals.moment=require("moment");
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error=req.flash("error")
    res.locals.success=req.flash("success")
    next();
});
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use(indexRoutes);

//seedDB();

var port = process.env.PORT || 8080;
app.listen(port,()=>{
    console.log("Yelp app has started!");
})