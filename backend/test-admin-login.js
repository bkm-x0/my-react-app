// Test admin login
const http = require('http');

async function testAdminLogin() {
  try {
    console.log('🧪 Testing admin login...');
    console.log('Email: admin@cyberstore.com');
    console.log('Password: admin123\n');
    
    const postData = JSON.stringify({
      email: 'admin@cyberstore.com',
      password: 'admin123'
    });
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          
          console.log('Response status:', res.statusCode);
          console.log('Response data:', JSON.stringify(jsonData, null, 2));
          
          if (res.statusCode === 200 && jsonData.role === 'admin') {
            console.log('\n✅ Admin login successful!');
            console.log('   User role:', jsonData.role);
            console.log('   Username:', jsonData.username);
            console.log('   Token generated:', jsonData.token ? 'Yes' : 'No');
          } else if (res.statusCode === 200 && jsonData.role !== 'admin') {
            console.log('\n⚠️ Login successful but user is not admin!');
            console.log('   User role:', jsonData.role);
          } else {
            console.log('\n❌ Admin login failed!');
            console.log('   Error:', jsonData.message || jsonData.error);
          }
          
          process.exit(0);
        } catch (error) {
          console.error('❌ Error parsing response:', error.message);
          console.log('Raw response:', data);
          process.exit(1);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ Request error:', error.message);
      process.exit(1);
    });
    
    req.write(postData);
    req.end();
    
  } catch (error) {
    console.error('❌ Error testing admin login:', error.message);
    process.exit(1);
  }
}

testAdminLogin();
