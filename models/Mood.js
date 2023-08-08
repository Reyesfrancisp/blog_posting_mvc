const { Model, DataTypes } = require('sequelize');
const db = require('../db/connection');
const User = require('./User');

class Mood extends Model { }

Mood.init({
  // Field to store the user's name for the mood
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      min: 5 // Minimum length of 5 characters required
    }
  },
  // Field to store the user's mood as a percentage
  joy: {
    type: DataTypes.DECIMAL(5, 2), // Decimal with 5 digits in total and 2 decimal places
    allowNull: false,
  },
  surprise: {
    type: DataTypes.DECIMAL(5, 2), // Decimal with 5 digits in total and 2 decimal places
    allowNull: false,
  },
  sadness: {
    type: DataTypes.DECIMAL(5, 2), // Decimal with 5 digits in total and 2 decimal places
    allowNull: false,
  },
  disgust: {
    type: DataTypes.DECIMAL(5, 2), // Decimal with 5 digits in total and 2 decimal places
    allowNull: false,
  },
  anger: {
    type: DataTypes.DECIMAL(5, 2), // Decimal with 5 digits in total and 2 decimal places
    allowNull: false,
  }, fear: {
    type: DataTypes.DECIMAL(5, 2), // Decimal with 5 digits in total and 2 decimal places
    allowNull: false,
  },
  // Field to store an entry or notes about the user's mood
  entry: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  sequelize: db,
  modelName: 'mood',
});

// Define the association for Mood to User
// Mood.belongsTo(User, { foreignKey: 'userId' });

module.exports = Mood;
