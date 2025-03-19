const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Story = sequelize.define('Story', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    base_content: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    cover_image: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    min_age: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    max_age: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    gender: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        isIn: [['boy', 'girl', 'neutral']]
      }
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
    tableName: 'stories',
    timestamps: true,
    underscored: true
  });

  return Story;
};
