const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OrderItem = sequelize.define('OrderItem', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'orders',
        key: 'id'
      }
    },
    customized_book_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'customized_books',
        key: 'id'
      }
    },
    format: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: [['digital', 'paperback', 'hardcover']]
      }
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1
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
    tableName: 'order_items',
    timestamps: true,
    underscored: true
  });

  return OrderItem;
};
