//Requires
require("dotenv").config();
const express = require("express");
const { engine } = require("express-handlebars");
const session = require("express-session");
const Handlebars = require("handlebars");
const moment = require("moment"); // Import the moment library

// Register a Handlebars helper to format the date and time
Handlebars.registerHelper("formatDate", function (date) {
  return moment(date).format("MMMM D, YYYY, h:mm A");
});

// Import our db connection
const db = require("./db/connection");

// Import routes
const user_routes = require("./controllers/user_routes");
const view_routes = require("./controllers/view_routes");
const post_routes = require("./controllers/post_routes");

//import associations
const associations = require("./models/Associations");

const app = express();
const PORT = process.env.PORT || 3333;

// Middleware
app.use(express.json()); // Allows the client/browser to send json in a request
// Allow standard encoded form data submissions
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // Allows the client/browser to access any folders or files in public - opens this folder at the root

// Setup Handlebars Template Engine
app.engine("hbs", engine({
  // layout directory that allows you to avoid repeated html code
  layoutsDir: "./views/layouts",
  // Set the extension for your handlebars files to .hbs
  extname: "hbs"
}));
app.set("view engine", "hbs");
app.set("views", "./views");

// Load Sessions
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 60 * 60 * 1000 // 1 hour in milliseconds
  }
}));

// Load Routes
app.use("/", [post_routes, view_routes, user_routes]);

// Connect to the db and create all tables based off of our models
db.sync({ force: false })
  .then(() => {
    //setup associations
    associations.User;
    associations.Post;
    associations.Comment;
    // Start server
    app.listen(PORT, () => console.log("Server started on port %s", PORT));
  });