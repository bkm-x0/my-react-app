const http = require('http');

function request(options, body) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data || '{}');
          resolve({ status: res.statusCode, body: parsed });
        } catch (err) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(typeof body === 'string' ? body : JSON.stringify(body));
    req.end();
  });
}

(async () => {
  try {
    const PORT = Number(process.env.PORT || 5000);
    console.log('1) Logging in (user@cyberstore.com)...');
    const login = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { email: 'user@cyberstore.com', password: 'user123' });

    if (login.status !== 200 || !login.body.token) throw new Error('Login failed: ' + JSON.stringify(login));
    const token = login.body.token;
    console.log('   ✅ got token (prefix):', token.substring(0, 20) + '...');

    console.log('0) Fetching available products...');
    const prodList = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/products?limit=1',
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    const productId = prodList.body?.products?.[0]?.id;
    if (!productId) throw new Error('No products found in database; run: npm run seed');
    console.log('   ✅ found product id:', productId);

    console.log(`2) Submitting review for product ${productId}`);
    const review = await request({
      hostname: 'localhost',
      port: PORT,
      path: `/api/products/${productId}/reviews`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    }, { rating: 5, comment: 'E2E smoke: review from e2e-review-http' });

    console.log('   → status:', review.status);
    console.log('   → body:', review.body);

    if (review.status !== 201) throw new Error('Review POST failed');

    console.log('3) Fetching reviews to confirm presence...');
    const list = await request({ hostname: 'localhost', port: PORT, path: `/api/products/${productId}/reviews?limit=10`, method: 'GET', headers: { 'Authorization': `Bearer ${token}` } });
    const found = (list.body.reviews || []).some(r => typeof r.comment === 'string' && r.comment.includes('E2E smoke'));
    console.log('   → found in recent page?', found);

    console.log('4) Fetching product to verify rating updated...');
    const prod = await request({ hostname: 'localhost', port: PORT, path: `/api/products/${productId}`, method: 'GET' });
    console.log('   → product rating:', prod.body.rating, 'reviews:', prod.body.reviews);

    if (!found) throw new Error('Inserted review not found in API response');

    console.log('\n✅ E2E smoke passed');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ E2E smoke failed:', err.message || err);
    process.exit(1);
  }
})();
