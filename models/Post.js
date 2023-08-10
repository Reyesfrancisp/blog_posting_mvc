const { Model, DataTypes } = require('sequelize');
const db = require('../db/connection');
const Comment = require('./Comment');

class Post extends Model { }

Post.init({
  // Field to store the user's name for the Post
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      min: 5 // Minimum length of 5 characters required
    }
  },
  // Field to store an entry or notes about the user's Post
  entry: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  sequelize: db,
  modelName: 'post',
});


Post.hasMany(Comment, {foreignKey: 'userId'});

Comment.belongsTo(Post, { foreignKey: 'userId' });

module.exports = Post;
