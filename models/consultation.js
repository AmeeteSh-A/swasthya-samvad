const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Consultation', {
    patientId: DataTypes.INTEGER,
    doctorId: DataTypes.INTEGER,
    specialty: DataTypes.STRING,
    status: { type: DataTypes.STRING, defaultValue: 'pending' }
  });
};