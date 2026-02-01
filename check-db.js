const mongoose = require('mongoose');
require('dotenv').config();

// Import the Tool model
const Tool = require('./models/Tool');

async function checkDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/toolshub', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Count tools in the database
    const count = await Tool.countDocuments();
    console.log(`Total tools in database: ${count}`);

    // Get first few tools to verify
    const tools = await Tool.find().limit(5);
    console.log('First 5 tools:');
    tools.forEach(tool => {
      console.log(`- ${tool.name} (${tool.category})`);
    });

    // Close the connection
    await mongoose.connection.close();
    console.log('Database check completed');
  } catch (error) {
    console.error('Error during database check:', error);
  }
}

// Run the check function
checkDatabase();