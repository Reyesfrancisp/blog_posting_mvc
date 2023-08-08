const { Model, DataTypes } = require('sequelize');
const { hash, compare } = require('bcrypt');
const db = require('../db/connection');
const Mood = require('./Mood');

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

// Define the association for User to Mood
User.hasMany(Mood, { foreignKey: 'userId' });
// Define the association for Mood to User
Mood.belongsTo(User, { foreignKey: 'userId' });

module.exports = User;
