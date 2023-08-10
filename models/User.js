const { Model, DataTypes } = require('sequelize');
const { hash, compare } = require('bcrypt');
const db = require('../db/connection');
const Post = require('./Post');
const Comment = require('./Comment');


class User extends Model { }

User.init({
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },


  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      min: 5
    }
  },


  password: {
    type: DataTypes.STRING,
    validate: {
      min: 6
    }
  }
}, {
  sequelize: db,
  modelName: 'user',
  hooks: {
    async beforeCreate(user) {
      const hashPassword = await hash(user.password, 10);
      user.password = hashPassword;
    }
  }
});

User.prototype.validatePass = async function (formPassword) {
  const isValid = await compare(formPassword, this.password);
  return isValid;
};

// Define the association for User to post
User.hasMany(Post, { foreignKey: 'userId' });
// Define the association for post to User
Post.belongsTo(User, { foreignKey: 'userId' });

// Define the association for User to post
User.hasMany(Comment, { foreignKey: 'userId' });
// Define the association for Comment to User
Comment.belongsTo(User, { foreignKey: 'userId' });


module.exports = User;
