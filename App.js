const express = require('express');
const authRoute = require('./routes/auth');
const homeRoute = require('./routes/home');
const allRoute = require('./routes/allUsers');
const friendRoute = require('./routes/friends');
const profileRoute = require('./routes/profile');
const commentRoute = require('./routes/comment');
const trendingRoute = require('./routes/trending');
const path = require('path');
const passport = require('passport');
const {connectMongoose} = require('./Models/user');
const Session = require('express-session');
const cookieParser = require('cookie-parser');
const {initializingPassport} = require('./passportConfig');
const flash = require('connect-flash');
const multer = require('multer');
const { log } = require('console');

connectMongoose();

initializingPassport(passport);

const app = express();

app.use(express.json());

app.use(express.urlencoded({extended:true}));

app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));

app.use(express.static('public'));

app.use(cookieParser('keyboard cat'));

app.set('trust proxy', 1) 
app.use(Session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge : 600000000000000 },
}))



app.use(flash());
app.use(passport.initialize());
app.use(passport.session());




app.use('/',authRoute);
app.use('/',homeRoute);
app.use('/',allRoute);
app.use('/',friendRoute);
app.use('/',profileRoute);
app.use('/',commentRoute);
app.use('/',trendingRoute);


app.get('/', async (req, res) => {

  if (req.isAuthenticated()) {

      const currentUser = req.user;

      const userId = currentUser._id;

     const data = await postModel.find({userId:userId});

     console.log(data);


      return res.render('home', { currentUser,data });

}

	res.render('landing.ejs');
});


app.get('/logout',(req,res)=>{
  req.logOut((err)=>{
    if(err){
      console.log(err);
      return res.redirect('/');
    }
    res.redirect('/');
  })
})

const port = process.env.PORT || 4000;

app.listen(port,()=>{
    console.log("Server Started at port 4000");
})