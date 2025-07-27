// Simple script to test the Strapi API

async function testStrapiAPI() {
  try {
    console.log('Testing Strapi API...');

    // Fetch articles
    const response = await fetch('https://special-acoustics-b9adb26838.strapiapp.com/api/articles?populate=*');

    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    console.log('API Response Status:', response.status);
    console.log('Data structure check:');
    console.log('- Has data property:', !!data.data);
    console.log('- Data is array:', Array.isArray(data.data));
    console.log('- Data length:', data.data ? data.data.length : 0);

    if (data.data && data.data.length > 0) {
      const firstItem = data.data[0];
      console.log('\nFirst article:');
      console.log('- ID:', firstItem.id);
      console.log('- Raw item:', JSON.stringify(firstItem, null, 2));

      // Check for content field
      console.log('\nContent field check:');
      console.log('- Has content:', !!firstItem.attributes.content);
      console.log('- Has Content (uppercase):', !!firstItem.attributes.Content);
      console.log('- Content field type:', typeof firstItem.attributes.content);
      console.log('- Content (uppercase) field type:', typeof firstItem.attributes.Content);

      // Log all attribute keys
      console.log('\nAvailable attribute keys:', Object.keys(firstItem.attributes));

      // Check for specific fields
      console.log('\nField values:');
      for (const key of Object.keys(firstItem.attributes)) {
        const value = firstItem.attributes[key];
        const valueType = typeof value;
        const valuePreview = valueType === 'object'
          ? (value === null ? 'null' : Array.isArray(value) ? `Array(${value.length})` : 'Object')
          : (valueType === 'string' && value.length > 50 ? `${value.substring(0, 50)}...` : value);

        console.log(`- ${key}: (${valueType}) ${valuePreview}`);
      }
    }

    console.log('\nTest completed successfully!');
  } catch (error) {
    console.error('Error testing Strapi API:', error);
  }
}

// Run the test
testStrapiAPI();
