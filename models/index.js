const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

const User = sequelize.define('User', {
  email: { type: DataTypes.STRING, unique: true },
  password: DataTypes.STRING,
  role: DataTypes.STRING,
  specialty: DataTypes.STRING
});

const Consultation = sequelize.define('Consultation', {
  patientId: DataTypes.INTEGER,
  doctorId: DataTypes.INTEGER,
  specialty: DataTypes.STRING,
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending'
  },
  roomUrl: DataTypes.STRING,
  prescription: DataTypes.TEXT
});

module.exports = {
  sequelize,
  User,
  Consultation
};