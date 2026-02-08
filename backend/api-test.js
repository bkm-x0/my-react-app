// api-test.js - Test product creation API
const axios = require('axios');

async function testProductAPI() {
  try {
    console.log('🧪 Starting API Tests\n');

    // 1. Get admin token
    console.log('1️⃣  Testing Login...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@cyberstore.com',
      password: 'admin123'
    });

    const token = loginResponse.data.token;
    console.log('✅ Login successful!');
    console.log(`   Token: ${token.substring(0, 20)}...`);

    // 2. Test category fetching
    console.log('\n2️⃣  Testing Categories...');
    const categoriesResponse = await axios.get('http://localhost:5000/api/categories', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    console.log('✅ Categories retrieved!');
    categoriesResponse.data.forEach(cat => {
      console.log(`   - ${cat.name} (slug: ${cat.slug})`);
    });

    // 3. Test product creation
    console.log('\n3️⃣  Testing Product Creation...');
    const testProduct = {
      name: 'Test Quantum Processor',
      sku: `TEST-${Date.now()}`,
      price: 2500.50,
      stock: 25,
      category: 'Quantum Hardware',
      description: 'Advanced quantum computing processor for cybernetic enhancements',
      isFeatured: true,
      features: ['64-qubit', 'Quantum Error Correction', 'Neural Interface Compatible']
    };

    console.log('   Sending:', testProduct);

    const productResponse = await axios.post(
      'http://localhost:5000/api/products',
      testProduct,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Product created successfully!');
    console.log(`   ID: ${productResponse.data.id}`);
    console.log(`   Name: ${productResponse.data.name}`);
    console.log(`   SKU: ${productResponse.data.sku}`);
    console.log(`   Category ID: ${productResponse.data.category_id}`);

    // 4. Test fetching products
    console.log('\n4️⃣  Testing Product Retrieval...');
    const getResponse = await axios.get('http://localhost:5000/api/products', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    console.log(`✅ Retrieved ${getResponse.data.products.length} products`);
    const created = getResponse.data.products.find(p => p.id === productResponse.data.id);
    if (created) {
      console.log(`   ✅ Just created product found in list!`);
    }

    console.log('\n✅ All tests passed!');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Test failed!');
    
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Message: ${error.response.data?.message || error.response.data?.error}`);
      console.error(`Response:`, error.response.data);
    } else if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused - Backend not running on localhost:5000');
      console.error('Run: cd backend && npm run dev');
    } else {
      console.error(error.message);
    }

    process.exit(1);
  }
}

testProductAPI();
