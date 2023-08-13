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
    const newPost = Post.build({ authorId: user.id, title: newTitle, entry: newEntry });

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
        userId: user.id
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
    res.redirect(`/post/${blogId}`);
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
    const text  = req.body; // Assuming the comment text is sent in the request body

    // Find the blog post by ID
    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).send("Post not found");
    }

    // Create a new comment
    await Comment.create({
      text: text,
      postId: post.id,
      commenterId: user.id,
    });

    // Redirect back to the blog post or somewhere else
    res.redirect(`/post/${postId}`); // Use the correct URL pattern for post detail pages
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});


//provide a button to delete a comment if it"s from that user
router.delete("/:postId/comments/:commentId", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findByPk(req.session.user_id, {
      include: [Post, Comment],
    });

    const postId = req.params.postId;
    const commentId = req.params.commentId;

    // Find the blog post by ID and user
    const post = await Post.findOne({
      where: {
        id: postId,
        userId: user.id,
      },
    });

    if (!post) {
      return res.status(404).send("Post not found");
    }

    // Find the comment to delete under the specified post
    const comment = await Comment.findOne({
      where: {
        id: commentId,
        postId: post.id,
      },
    });

    if (!comment) {
      return res.status(404).send("Comment not found");
    }

    // Delete the comment from the database
    await comment.destroy();

    // Redirect back to the blog post or somewhere else
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

//route to delete the blog post
router.delete("/post/:blogPostId", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findByPk(req.session.user_id, {
      include: [Post, Comment], // Include both Post and Comment associations
    });

    const postID = req.params.blogPostId;
    const post = await Post.findOne({ // Find the blog post by ID and user
      where: {
        id: postID,
        userId: user.id,
      },
    });

    if (!post) {
      return res.status(404).send("Post not found");
    }

    // Delete the post entry from the database
    await post.destroy();

    // Redirect to the main page
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

module.exports = router;
