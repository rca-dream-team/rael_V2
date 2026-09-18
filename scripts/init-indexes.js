/**
 * MongoDB Index Initialization & Concurrency Integrity Script
 * Project: RAEL (Rwanda Coding Academy Editorial & Lifestyle)
 *
 * This script creates production-grade B-Tree indexes on 'comments' and 'comment_likes'.
 * It is fully idempotent and safe to run multiple times.
 *
 * Usage:
 *   node scripts/init-indexes.js
 *   npm run db:indexes
 */

const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

async function initIndexes() {
  const uri = process.env.RAEL_DATABASE_URL;

  if (!uri) {
    console.error('❌ Error: RAEL_DATABASE_URL environment variable is not defined in .env');
    process.exit(1);
  }

  console.log('🔄 Connecting to MongoDB Atlas...');
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas successfully.\n');

    const db = client.db();

    // =========================================================================
    // 1. INDEXES FOR 'comments' COLLECTION
    // =========================================================================
    console.log('📌 [1/2] Configuring indexes for "comments" collection...');
    const commentsCollection = db.collection('comments');

    // Index 1: Compound Equality-Sort index for fast reverse-chronological article comments (SSR)
    console.log('   -> Creating compound index: { postId: 1, createdAt: -1 }...');
    const idxCommentsPostCreated = await commentsCollection.createIndex(
      { postId: 1, createdAt: -1 },
      { name: 'idx_comments_post_created' }
    );
    console.log(`      ✅ Active: ${idxCommentsPostCreated}`);

    // Index 2: Thread hierarchy index for instant child reply lookups and cascading deletes
    console.log('   -> Creating index: { parentId: 1 }...');
    const idxCommentsParent = await commentsCollection.createIndex(
      { parentId: 1 },
      { name: 'idx_comments_parent' }
    );
    console.log(`      ✅ Active: ${idxCommentsParent}`);

    // Index 3: Pseudonym collision index for fast Faker alias uniqueness checks
    console.log('   -> Creating compound index: { postId: 1, name: 1 }...');
    const idxCommentsPostName = await commentsCollection.createIndex(
      { postId: 1, name: 1 },
      { name: 'idx_comments_post_name' }
    );
    console.log(`      ✅ Active: ${idxCommentsPostName}`);

    // =========================================================================
    // 2. INDEXES FOR 'comment_likes' COLLECTION
    // =========================================================================
    console.log('\n📌 [2/2] Configuring indexes for "comment_likes" collection...');
    const likesCollection = db.collection('comment_likes');

    // Defensive Pre-Check: Detect any duplicate likes before applying unique constraint
    console.log('   -> Pre-checking for duplicate likes in database...');
    const duplicates = await likesCollection.aggregate([
      { $group: { _id: { commentId: '$commentId', userId: '$userId' }, count: { $sum: 1 }, ids: { $push: '$_id' } } },
      { $match: { count: { $gt: 1 } } }
    ]).toArray();

    if (duplicates.length > 0) {
      console.warn(`   ⚠️ Found ${duplicates.length} duplicate like groups. Cleaning up duplicates before index creation...`);
      for (const dup of duplicates) {
        // Keep the first ID, delete the rest
        const [, ...toDelete] = dup.ids;
        await likesCollection.deleteMany({ _id: { $in: toDelete } });
      }
      console.log('   ✅ Duplicate likes deduplicated.');
    } else {
      console.log('   ✅ Zero duplicate likes found. Safe to apply unique constraint.');
    }

    // Index: Unique Compound Index on (commentId, userId)
    // Note: The prefix { commentId: 1 } also accelerates like count aggregations and cascade deletes
    console.log('   -> Creating UNIQUE compound index: { commentId: 1, userId: 1 }...');
    const idxLikesUniqueUser = await likesCollection.createIndex(
      { commentId: 1, userId: 1 },
      { unique: true, name: 'idx_comment_likes_unique_user' }
    );
    console.log(`      ✅ Active: ${idxLikesUniqueUser}`);

    // =========================================================================
    // SUMMARY OF ACTIVE INDEXES
    // =========================================================================
    console.log('\n📋 --- ACTIVE DATABASE INDEX AUDIT ---');

    const finalCommentIndexes = await commentsCollection.indexes();
    console.log('• "comments" collection indexes:');
    finalCommentIndexes.forEach((idx) => {
      console.log(`   - ${idx.name}: ${JSON.stringify(idx.key)} ${idx.unique ? '(UNIQUE)' : ''}`);
    });

    const finalLikeIndexes = await likesCollection.indexes();
    console.log('• "comment_likes" collection indexes:');
    finalLikeIndexes.forEach((idx) => {
      console.log(`   - ${idx.name}: ${JSON.stringify(idx.key)} ${idx.unique ? '(UNIQUE)' : ''}`);
    });

    console.log('\n🎉 ALL DATABASE INDEXES SUCCESSFULLY CONFIGURED AND VERIFIED!');
  } catch (error) {
    console.error('❌ Failed to initialize database indexes:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB Atlas.');
  }
}

initIndexes().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
