const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const StoryElement = sequelize.define('StoryElement', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    story_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'stories',
        key: 'id'
      }
    },
    element_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    is_customizable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    options: {
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
    tableName: 'story_elements',
    timestamps: true,
    underscored: true
  });

  return StoryElement;
};
