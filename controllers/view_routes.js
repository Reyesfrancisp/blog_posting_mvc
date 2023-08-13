const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

// Middleware
function isAuthenticated(req, res, next) {
  const isAuthenticated = req.session.user_id;

  if (!isAuthenticated) return res.redirect("/login");

  next();
}

// Homepage display all posts
router.get("/", async (req, res) => {
  console.log("Got into the get route");
  try {
    // Fetch all posts from the database
    const post = await Post.findAll();
    console.log("This is the post data", post);
    // Render the "post" template and pass the posts data
    res.render("index", {
      post: post // Pass the posts data
    });
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

// Login page
router.get("/login", (req, res) => {
  console.log ("Triggered get route for login");

  res.render("login", {
    isLogin: true
  });
});

// Register Page
router.get("/register", (req, res) => {
  console.log("got into the get route for register");

  res.render("register", {
    isRegister: true
  });
});




// specific post
router.get("/post/:id", async (req, res) => {
  console.log("got into post:id route");
  try {
    // Fetch the post and its associated comments
    const postId = req.params.id;
    const singlePost = await Post.findByPk(postId, {
      include: [
        {
          model: Comment,
          required: false // Fetch associated comments even if there are none
        }
      ]
    });

    if (!singlePost) {
      // Handle the case if the post is not found
      return res.redirect("/");
    }

    // Determine if the current user is the author of the post
    const isAuthor = req.session.user_id === singlePost.userId;

    console.log("before render in code.");
   await res.render("dashboard", {
      title: singlePost.title,
      entry: singlePost.entry,
      isAuthor: isAuthor,
      comments: singlePost.Comments // Pass the comments to the template
    });
    console.log("after render in code.");

  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

router.get("/entry", isAuthenticated, async (req, res) => {
  const user = await User.findByPk(req.session.user_id);

  res.render("entry", {
    email: user.email
  });
});



module.exports = router;