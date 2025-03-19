const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserSavedBook = sequelize.define('UserSavedBook', {
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
    customized_book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'customized_books',
        key: 'id'
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
    tableName: 'user_saved_books',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'customized_book_id']
      }
    ]
  });

  return UserSavedBook;
};
