const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CustomizedBook = sequelize.define('CustomizedBook', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    customization_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'customizations',
        key: 'id'
      }
    },
    rendered_content: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    cover_image: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: 'draft',
      validate: {
        isIn: [['draft', 'final', 'archived']]
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
    tableName: 'customized_books',
    timestamps: true,
    underscored: true
  });

  return CustomizedBook;
};
