const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CustomizationOption = sequelize.define('CustomizationOption', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    element_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    option_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    option_value: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    display_order: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'customization_options',
    timestamps: true,
    underscored: true
  });

  return CustomizationOption;
};
