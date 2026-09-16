// Script to create the comments collection in MongoDB
// Run with: node scripts/create-collection.js

const { MongoClient } = require('mongodb');
require('dotenv').config();

async function createCollection() {
  const uri = process.env.RAEL_DATABASE_URL;
  if (!uri) {
    console.error('RAEL_DATABASE_URL environment variable not set');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    //console.log('Connected to MongoDB');
    
    const db = client.db();
    
    // Check if collection exists
    const collections = await db.listCollections({ name: 'comments' }).toArray();
    
    if (collections.length === 0) {
      // Create the comments collection
      await db.createCollection('comments');
      //console.log('Created comments collection');
    } else {
      //console.log('Comments collection already exists');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    //console.log('Disconnected from MongoDB');
  }
}

createCollection().catch(console.error); 