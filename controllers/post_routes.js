require("dotenv").config();
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



router.post("/entry", isAuthenticated, async (req, res) => {
  console.log("got into the entry route for posting");
  try {
    const user = await User.findByPk(req.session.user_id);
    const newEntry = req.body.entry;
    const newTitle = req.body.title.toUpperCase();

    // Create a new Post instance
    const newPost = Post.build({ authorId: user.id, title: newTitle, entry: newEntry, username: user.username });

    // Validate the new Post instance
    try {
      await newPost.validate();
    } catch (validationError) {
      // If validation fails, validationError contains error details
      res.status(400).send("Validation error: " + validationError.errors[0].message);
      return;
    }

    // If validation passes, save the new entry
    await newPost.save();

    // Redirect after the data is obtained
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred");
  }
});



router.post("/post/:id", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findByPk(req.session.user_id, {
      include: Comment
    });

    const blogId = req.params.id;
    const blogPost = await Post.findOne({
      where: {
        id: blogId,
        authorId: user.id
      }
    });

    if (!blogPost) {
      return res.status(404).send("Blog post not found");
    }

    // Update the blog post entry with the new values
    blogPost.set({
      title: req.body.title.toUpperCase(),
      entry: req.body.entry
    });

    await blogPost.save();

    // Redirect the user to the updated post page
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

// Provide the route to add a comment to a blog post
router.post("/post/:postId/comments", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findByPk(req.session.user_id);
    const postId = req.params.postId;
    const text  = req.body.commentText; // Assuming the comment text is sent in the request body

    // Create a new comment
    await Comment.create({
      entry: text,
      postId: postId,
      commenterId: user.id,
      username: user.username
    });

    // Redirect back to the blog post
    res.redirect(`/post/${postId}`); // Use the correct URL pattern for post detail pages
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});


//provide a button to delete a comment if it"s from that user
router.delete("/:postId/comments/:commentId", isAuthenticated, async (req, res) => {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    // Find and delete the comment by postId and commentId
    await Comment.destroy({
      where: {
        postId: postId,
        id: commentId
      }
    });

    res.sendStatus(200); // Send a successful response

  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});


// Route to delete the blog post and its associated comments
router.delete("/post/:blogPostId", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findByPk(req.session.user_id, {
      include: [Post, Comment], // Include both Post and Comment associations
    });

    const postID = req.params.blogPostId;

    const post = await Post.findOne({
      where: {
        id: postID,
        authorId: user.id,
      },
    });

    if (!post) {
      return res.status(404).send("Post not found");
    }

    // Find all associated comments
    const comments = await Comment.findAll({
      where: {
        postId: post.id,
      },
    });

    // Delete each associated comment
    for (const comment of comments) {
      await comment.destroy();
    }

    // Delete the post entry from the database
    await post.destroy();

    // Send a successful response
    res.sendStatus(200);

  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});



module.exports = router;
