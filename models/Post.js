const { Model, DataTypes } = require('sequelize');
const db = require('../db/connection');

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

// Define the association for Mood to User
// Mood.belongsTo(User, { foreignKey: 'userId' });

module.exports = Post;
