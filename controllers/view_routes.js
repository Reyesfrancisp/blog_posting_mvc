const router = require('express').Router();
const User = require('../models/User');
const Post = require('../models/Post');

// Middleware
function isAuthenticated(req, res, next) {
  const isAuthenticated = req.session.user_id;

  if (!isAuthenticated) return res.redirect('/login');

  next();
}

// Login page
router.get('/login', (req, res) => {
  if (req.session.user_id) return res.redirect('/');

  res.render('login', {
    isLogin: true
  });
});

// Register Page
router.get('/register', (req, res) => {
  res.render('register', {
    isRegister: true
  });
});

// Homepage display all posts
router.get('/', isAuthenticated, async (req, res) => {
  console.log("Got into the get route");
  try {
    // Fetch all posts from the database
    const posts = await Post.findAll();

    // Render the "post" template and pass the posts data
    res.render("post", {
      email: req.user.email, // Assuming the authenticated user is stored in req.user
      posts: posts // Pass the posts data
    });
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).send("An error occurred");
  }
});


// specific post
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findByPk(req.session.user_id, {
      include: post
    });

    const postId = req.params.id; // Get the post ID from the URL parameter
    const post = await post.findOne({
      where: {
        id: postId,
        userId: user.id
      },
      raw: true
    });

    if (!post) {
      // Handle the case if the post is not found
      return res.redirect("/");
    }

    res.render('display', {
      id: post.id,
      email: user.email,

    });

  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).send('An error occurred');
  }
});

router.get('/entry', isAuthenticated, async (req, res) => {
  const user = await User.findByPk(req.session.user_id);

  res.render('entry', {
    email: user.email
  });
});

module.exports = router;