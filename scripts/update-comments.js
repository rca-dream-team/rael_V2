const { MongoClient } = require('mongodb');
require('dotenv').config();

async function updateComments() {
    const uri = process.env.RAEL_DATABASE_URL;
    if (!uri) {
        console.error('RAEL_DATABASE_URL environment variable is not set');
        process.exit(1);
    }

    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db();
        const comments = db.collection('comments');

        // Update all existing comments to have the new fields with default values
        const result = await comments.updateMany(
            {
                $or: [
                    { parentId: { $exists: false } },
                    { replyCount: { $exists: false } }
                ]
            },
            {
                $set: {
                    parentId: null,
                    replyCount: 0
                }
            }
        );

        console.log(`Updated ${result.modifiedCount} comments`);
        console.log('Migration completed successfully');

    } catch (error) {
        console.error('Error updating comments:', error);
    } finally {
        await client.close();
    }
}

updateComments().catch(console.error); 