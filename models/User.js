const { Model, DataTypes } = require('sequelize');
const { hash, compare } = require('bcrypt');
const db = require('../db/connection');


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
      min: 2
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


module.exports = User;
