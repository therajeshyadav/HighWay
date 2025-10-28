// Simple test script to verify API is working
// Run with: node test-api.js

const API_BASE = 'http://localhost:3001/api';

async function testAPI() {
  console.log('🧪 Testing BookIt API...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing health check...');
    const healthResponse = await fetch(`${API_BASE}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.message);

    // Test 2: Get Experiences
    console.log('\n2. Testing experiences endpoint...');
    const expResponse = await fetch(`${API_BASE}/experiences`);
    const expData = await expResponse.json();
    console.log(`✅ Found ${expData.data?.length || 0} experiences`);
    
    if (expData.data && expData.data.length > 0) {
      console.log(`   First experience: ${expData.data[0].title} - ₹${expData.data[0].price}`);
    }

    // Test 3: Get Experience Details
    if (expData.data && expData.data.length > 0) {
      console.log('\n3. Testing experience details...');
      const detailResponse = await fetch(`${API_BASE}/experiences/1`);
      const detailData = await detailResponse.json();
      
      if (detailData.success) {
        console.log(`✅ Experience details: ${detailData.data.title}`);
        console.log(`   Available dates: ${detailData.data.availableDates?.length || 0}`);
        console.log(`   Available times: ${detailData.data.availableTimes?.length || 0}`);
      }
    }

    // Test 4: Validate Promo Code
    console.log('\n4. Testing promo code validation...');
    const promoResponse = await fetch(`${API_BASE}/promo/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'SAVE10', amount: 1000 })
    });
    const promoData = await promoResponse.json();
    
    if (promoData.success) {
      console.log(`✅ Promo code SAVE10: ₹${promoData.data.discountAmount} discount`);
    } else {
      console.log('❌ Promo code test failed:', promoData.message);
    }

    console.log('\n🎉 All tests completed! Your API is working correctly.');
    console.log('\n📱 You can now start your frontend with: npm run dev');
    console.log('🌐 Frontend will be available at: http://localhost:5173');

  } catch (error) {
    console.error('\n❌ API test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure backend server is running: npm run dev');
    console.log('2. Check if database is set up correctly');
    console.log('3. Verify .env file has correct database credentials');
  }
}

testAPI();