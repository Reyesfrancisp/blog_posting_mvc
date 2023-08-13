const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

// Middleware to see if they're not logged in and redirect them before accessing that part
function isAuthenticated(req, res, next) {
  const isAuthenticated = req.session.user_id;

  if (!isAuthenticated) return res.redirect("/login");

  next();
}

//make middleware to check if somebody is logged in

// Homepage display all posts
router.get("/", async (req, res) => {
  console.log("Got into the get route");

  const isLoggedIn = !!req.session.user_id;

  const user = await User.findByPk(req.session.user_id);
  try {
    // Fetch all posts from the database
    const post = await Post.findAll();
    console.log("This is the post data", post);
    // Render the "post" template and pass the posts data
    if (user == null) {

      await res.render("index", {
        post: post, // Pass the posts data
        isHome: true
      });
    }
    else {
      res.render("index", {
        post: post, // Pass the posts data
        user: user.username,
        isHome: true,
        isLoggedIn: isLoggedIn
      });
    }

  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

// Login page
router.get("/login", (req, res) => {
  console.log("Triggered get route for login");
  const isLoggedIn = !!req.session.user_id;

  res.render("login", {
    isLogin: true,
    isLoggedIn: isLoggedIn
  });
});

// Register Page
router.get("/register", (req, res) => {
  console.log("got into the get route for register");

  const isLoggedIn = !!req.session.user_id;

  res.render("register", {
    isRegister: true,
    isLoggedIn: isLoggedIn
  });
});

// specific post
router.get("/post/:id", async (req, res) => {

  const isLoggedIn = !!req.session.user_id;

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
    const isAuthor = req.session.user_id === singlePost.authorId;
    const isAuthenticated = req.session.user_id;
    console.log("before render in code.");
    await res.render("blogpost", {
      isLoggedIn: isLoggedIn,
      id: singlePost.id,
      title: singlePost.title,
      entry: singlePost.entry,
      isAuthor: isAuthor,
      isAuthenticated: isAuthenticated,
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
  const isLoggedIn = !!req.session.user_id;
  res.render("entry", {
    user: user.username,
    isLoggedIn: isLoggedIn
  });
});

module.exports = router;