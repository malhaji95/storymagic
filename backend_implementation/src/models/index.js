const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'story_customization',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const User = require('./User')(sequelize);
const Story = require('./Story')(sequelize);
const StoryElement = require('./StoryElement')(sequelize);
const Customization = require('./Customization')(sequelize);
const CustomizedBook = require('./CustomizedBook')(sequelize);
const Order = require('./Order')(sequelize);
const OrderItem = require('./OrderItem')(sequelize);
const CharacterTemplate = require('./CharacterTemplate')(sequelize);
const CustomizationOption = require('./CustomizationOption')(sequelize);
const UserSavedBook = require('./UserSavedBook')(sequelize);

// Define associations
User.hasMany(Customization, { foreignKey: 'user_id' });
Customization.belongsTo(User, { foreignKey: 'user_id' });

Story.hasMany(StoryElement, { foreignKey: 'story_id' });
StoryElement.belongsTo(Story, { foreignKey: 'story_id' });

Story.hasMany(Customization, { foreignKey: 'story_id' });
Customization.belongsTo(Story, { foreignKey: 'story_id' });

Customization.hasOne(CustomizedBook, { foreignKey: 'customization_id' });
CustomizedBook.belongsTo(Customization, { foreignKey: 'customization_id' });

User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });

Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

CustomizedBook.hasMany(OrderItem, { foreignKey: 'customized_book_id' });
OrderItem.belongsTo(CustomizedBook, { foreignKey: 'customized_book_id' });

User.belongsToMany(CustomizedBook, { through: UserSavedBook, foreignKey: 'user_id' });
CustomizedBook.belongsToMany(User, { through: UserSavedBook, foreignKey: 'customized_book_id' });

module.exports = {
  sequelize,
  User,
  Story,
  StoryElement,
  Customization,
  CustomizedBook,
  Order,
  OrderItem,
  CharacterTemplate,
  CustomizationOption,
  UserSavedBook
};
