const axios = require('axios');

async function run() {
  try {
    console.log('🔐 Logging in as seeded user...');
    const login = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'user@cyberstore.com',
      password: 'user123'
    });

    const token = login.data.token;
    console.log('✅ Logged in. Token prefix:', token.substring(0, 20) + '...');

    const productId = 13;
    const payload = { rating: 5, comment: 'Automated test review — looks great!' };

    console.log(`✍️  Submitting review for product ${productId}...`);
    const post = await axios.post(`http://localhost:5000/api/products/${productId}/reviews`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Review submitted:', { id: post.data.id, rating: post.data.rating });

    console.log('📥 Fetching latest reviews (first 5)...');
    const reviews = await axios.get(`http://localhost:5000/api/products/${productId}/reviews?limit=5`);
    console.log('✅ Reviews count (page):', reviews.data.reviews.length);
    const found = reviews.data.reviews.find(r => r.comment && r.comment.includes('Automated test review'));
    console.log('🔎 Found our review in recent page?', Boolean(found));

    console.log('📊 Fetching product to verify rating...');
    const product = await axios.get(`http://localhost:5000/api/products/${productId}`);
    console.log('✅ Product rating:', product.data.rating, 'reviews:', product.data.reviews);

    process.exit(0);
  } catch (err) {
    console.error('❌ Test failed');
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Body:', err.response.data);
    } else {
      console.error(err.message);
    }
    process.exit(1);
  }
}

run();
