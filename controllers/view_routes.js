const router = require("express").Router();
const sequelize = require("sequelize");
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

// new blog entry page
router.get("/entry", isAuthenticated, (req, res) => {
  console.log("Triggered get route for login");
  const isLoggedIn = !!req.session.user_id;

  res.render("entry", {
    isLogin: true,
    isLoggedIn: isLoggedIn,
    isAuthenticated: isAuthenticated
  });
});


// specific post
router.get("/post/:postId", async (req, res) => {

  try {
    const isLoggedIn = !!req.session.user_id;
    const userId = req.session.user_id; // Get the user's ID from the session
    const postId = req.params.postId; // Get the postId from the route parameter
    // Fetch the specific post by postId and include the associated comments
    const userPost = await Post.findOne({
      raw: true,
      where: {
        id: postId
      },
    });

    const comments = await Comment.findAll({
      raw:true, 
      where: {
        postId: postId
      }});
      console.log(comments);
      const newComments = comments.map(comment => {      
        const commentFlag = comment.commenterId === userId;
        console.log("Post User ID: ", comment.commenterId, "User ID: ", userId);
        return {
          ...comment,
          commentAuthor: commentFlag
        };
      });

    // Fetch the user's information
    let user;
    const userInfo = await User.findByPk(userId);
    if (userInfo) {
      user = userInfo.username;
    } else {
      user = null;
    }
    // If the post doesn't belong to the user or doesn't exist, handle accordingly
    if (!userPost) {
      return res.status(404).send("Post not found");
    }
    // Extract the comments from the userPost object


    console.log("before user post render in code.", newComments);
    res.render("blogpost", {
      postId: postId,
      user: user,
      isLoggedIn: isLoggedIn,
      userPost: userPost, // Pass the specific user's post to the template
      comments: newComments // Pass the extracted comments array
    });

  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).send("An error occurred");
  }
});


// specific dashboard for user
router.get("/dashboard", isAuthenticated, async (req, res) => {
  try {
    const isLoggedIn = true; // Since it's an authenticated route
    const userId = req.session.user_id; // Get the user's ID from the session

    // Fetch all posts created by the user
    const userPosts = await Post.findAll({
      where: {
        authorId: userId // Filter posts by the userId
      }
    });

    // Fetch the user's information
    const user = await User.findByPk(userId);

    // Extract dataValues using .get()
    const userPostsDataValues = userPosts.map(post => post.get());

    if (!user) {
      return res.status(404).send("User not found");
    }

    console.log("before dashboard render in code.");
    console.log("The user post data: ", userPosts);
    res.render("dashboard", {
      user: user.username,
      isLoggedIn: isLoggedIn,
      userPosts: userPostsDataValues, // Pass the user's posts to the template
      isAuthenticated: true // Since it's an authenticated route
    });

  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

// specific dashboard for user post to edit and delete
router.get("/dashboard/:postId", isAuthenticated, async (req, res) => {
  try {
    const isLoggedIn = true; // Since it's an authenticated route
    const userId = req.session.user_id; // Get the user's ID from the session
    const postId = req.params.postId; // Get the postId from the route parameter

    // Fetch the specific post by postId and authorId
    const userPost = await Post.findOne({
      where: {
        id: postId,
        authorId: userId // Filter posts by the userId
      }
    });

    // Fetch the user's information
    const user = await User.findByPk(userId);

    // If the post doesn't belong to the user or doesn't exist, handle accordingly
    if (!userPost) {
      return res.status(404).send("Post not found");
    }

    console.log("before user post render in code.");
    res.render("blogedit", {
      id: postId,
      user: user.username,
      isLoggedIn: isLoggedIn,
      userPost: userPost.get(), // Pass the specific user's post to the template
      isAuthenticated: true // Since it's an authenticated route
    });

  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

// Homepage display all posts
router.get("/", async (req, res) => {
  const isLoggedIn = !!req.session.user_id;

  const user = await User.findByPk(req.session.user_id);
  try {
    // Fetch all posts from the database along with the associated user's username and updatedAt
    const posts = await Post.findAll({
      raw: true, // Retrieve raw data values
      attributes: [
        'id',
        'title',
        'entry',
        'updatedAt',
        [sequelize.literal('User.username'), 'username']
      ],
      include: [{ model: User, attributes: [] }] // Include User model with no attributes
    });

    // Render the "post" template and pass the posts data
    if (user == null) {
      await res.render("index", {
        posts: posts, // Pass the posts data
        isHome: true
      });
    } else {
      res.render("index", {
        posts: posts, // Pass the posts data
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



module.exports = router;