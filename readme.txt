#Social Sphere

Social Sphere is a social media platform designed to facilitate connections between users through images and videos. Users can upload, delete, comment on posts, like/unlike posts, follow/unfollow other users, upload profile and cover photos, view their own posts and friends list, and utilize a trending feature to see popular posts quickly.

#Technologies Used -
-Node.js
-Express.js
-MongoDB
-JavaScript
-EJS (Embedded JavaScript)
-CSS
-Passport.js for authentication

#Features

#Authentication
Passport.js is used for authentication, allowing users to securely sign up, log in, and log out of their accounts.

#User Profiles
Users can upload profile photos and cover photos.
They can view all their own posts and manage them (delete/edit).

#Post Management
Upload and delete photos and videos.
Comment on posts and delete own comments.
Like/unlike posts.

#Social Features
Follow/unfollow other users.
View friends list (people followed).

#Trending Feature
Posts are ranked based on the number of likes received in a short time, ensuring popular content appears prominently in users' feeds.

#Installation
Clone the repository:

git clone https://github.com/okabe_kyouma/social-sphere.git
cd social-sphere

#Install dependencies:

npm install
Set up environment variables:

Create a .env file based on .env.example and configure your MongoDB connection string and session secret.

#Start the server:

npm start


Project Structure
app.js: Main entry point for the application. Sets up Express server, middleware, and routes.
routes/: Contains route handlers for different parts of the application (authentication, home, user profiles, comments, etc.).
Models/: Contains Mongoose models for defining MongoDB schemas and handling database operations.
public/: Contains static assets (CSS files, client-side JavaScript).
views/: Contains EJS templates for rendering HTML pages.
Usage
Ensure MongoDB is running (mongod).
Open your browser and navigate to http://localhost:4000 (or another port specified in .env).
Contributing
Contributions are welcome! Please fork the repository and create a pull request with your suggested improvements.

License
This project is for learning exp.

*/ Below is the explanation of the App.js file */

// Import required modules and routes
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
const { connectMongoose } = require('./Models/user');
const Session = require('express-session');
const cookieParser = require('cookie-parser');
const { initializingPassport } = require('./passportConfig');
const flash = require('connect-flash');
const multer = require('multer');

// Connect to MongoDB
connectMongoose();

// Initialize Passport authentication
initializingPassport(passport);

// Create Express application
const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser('keyboard cat'));
app.set('trust proxy', 1);
app.use(Session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 600000000000000 }, // Session cookie configuration
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Routes setup
app.use('/', authRoute);
app.use('/', homeRoute);
app.use('/', allRoute);
app.use('/', friendRoute);
app.use('/', profileRoute);
app.use('/', commentRoute);
app.use('/', trendingRoute);

// Home route
app.get('/', async (req, res) => {
  if (req.isAuthenticated()) {
    const currentUser = req.user;
    const userId = currentUser._id;
    const data = await postModel.find({ userId: userId }); // Fetch posts for the current user
    console.log(data);
    return res.render('home', { currentUser, data });
  }
  res.render('landing.ejs'); // Render landing page for non-authenticated users
});

// Logout route
app.get('/logout', (req, res) => {
  req.logOut((err) => {
    if (err) {
      console.log(err);
      return res.redirect('/');
    }
    res.redirect('/');
  });
});

// Start server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server Started at port ${port}`);
});
