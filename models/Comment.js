const { Model, DataTypes } = require('sequelize');
const db = require('../db/connection');

class Comment extends Model { }

Comment.init({
  // Field to store an entry or notes about the user's comment
  entry: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  sequelize: db,
  modelName: 'comment',
});

module.exports = Comment;
