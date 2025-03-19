const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Customization = sequelize.define('Customization', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    story_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'stories',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    gender: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        isIn: [['boy', 'girl', 'other']]
      }
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    custom_fields: {
      type: DataTypes.JSONB,
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
    tableName: 'customizations',
    timestamps: true,
    underscored: true
  });

  return Customization;
};
