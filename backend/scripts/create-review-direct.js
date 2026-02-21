const Review = require('../models/Review');
const Product = require('../models/Product');

async function run() {
  try {
    const productId = 13;
    const userId = 2; // seeded 'cyberuser' has id 2 in seed.js
    console.log('Inserting review via model layer...');

    const created = await Review.create({ productId, userId, rating: 5, comment: 'Direct-model test review' });
    console.log('Created review id:', created.id);

    const stats = await Review.getStatsForProduct(productId);
    console.log('Stats after insert:', stats);

    await Product.update(productId, { rating: Number(stats.avgRating).toFixed(2) });
    const prod = await Product.findById(productId);
    console.log('Product rating after recompute:', prod.rating, 'reviews count (best-effort):', stats.count);

    process.exit(0);
  } catch (err) {
    console.error('Error in direct review creation test:', err);
    process.exit(1);
  }
}

run();
