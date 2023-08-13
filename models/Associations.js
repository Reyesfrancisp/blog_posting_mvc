const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');

// Define associations here
User.hasMany(Post, { foreignKey: 'authorId' });
User.hasMany(Comment, { foreignKey: 'commenterId' }); 

Post.belongsTo(User, { foreignKey: 'authorId' }); 
Post.hasMany(Comment, { foreignKey: 'postId' });

Comment.belongsTo(User, { foreignKey: 'commenterId' }); 
Comment.belongsTo(Post, { foreignKey: 'postId' });


// Export associations
module.exports = {
  User,
  Post,
  Comment,
};
