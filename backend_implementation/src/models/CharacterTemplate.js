const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CharacterTemplate = sequelize.define('CharacterTemplate', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    gender: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: [['boy', 'girl', 'neutral']]
      }
    },
    age_group: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    base_image: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    customizable_features: {
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
    tableName: 'character_templates',
    timestamps: true,
    underscored: true
  });

  return CharacterTemplate;
};
