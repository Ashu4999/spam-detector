const { v4: uuidv4 } = require('uuid');
const { sequelize, DBModels } = require("../config/dbConn");

// Generate UUIDs for users
const user1UUID = uuidv4(); // Generate UUID for User 1
const user2UUID = uuidv4(); // Generate UUID for User 2

// Define sample data with UUIDs
const userData = [
  {
    id: user1UUID,
    name: "John Doe",
    phone_number: "1234567890",
    email: "john.doe@example.com",
    password: "$2b$10$8vvBMSo82omnSGI/h6.lq.hOuv60VgUQ95.yRUWTI9ncO5CKtBZpi",
  },
  {
    id: user2UUID,
    name: "Jane Smith",
    phone_number: "9876543210",
    email: "jane.smith@example.com",
    password: "$2b$10$8vvBMSo82omnSGI/h6.lq.hOuv60VgUQ95.yRUWTI9ncO5CKtBZpi",
  },
];

const contactData = [
  {
    user_id: user1UUID,
    contact_name: "Alice",
    contact_phone_number: "1111111111",
  },
  {
    user_id: user1UUID,
    contact_name: "Bob",
    contact_phone_number: "2222222222",
  },
  {
    user_id: user2UUID,
    contact_name: "Eve",
    contact_phone_number: "3333333333",
  },
];

const spamData = [
  {
    phone_number: "5555555555",
    marked_by: user1UUID,
  },
];

// Function to seed data
const seedDatabase = async () => {
  try {
    // Sync models with database (ensure tables exist)
    await sequelize.sync({ force: true });

    // Insert sample data into User table
    await DBModels.user.bulkCreate(userData);

    // Insert sample data into Contact table
    await DBModels.contact.bulkCreate(contactData);

    // Insert sample data into Spam table
    await DBModels.spam.bulkCreate(spamData);

    console.log("Database seeding completed.");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    // Close database connection
    await sequelize.close();
  }
};

// Run the seeding function
seedDatabase();
