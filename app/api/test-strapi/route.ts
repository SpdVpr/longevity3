import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get the query parameter
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'articles';
    
    // Define the Strapi Cloud URL and API token
    const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://wise-growth-11e60bdab7.strapiapp.com';
    const API_TOKEN = process.env.STRAPI_API_TOKEN || '259ea5c9cca226780e30384a2c3258a3ff5695e15e298fe2573af9b3f32d83a53bc60ef87f5e6f213dc4ff32c6d8a3cab4221556b4d90645ca90b6cb4253f382ef0a7345954b59e276eaff942b1cd90d120df58bb33a6fea2fde4eaedf7dd45732085cbde24c305d15c905db551a8a9a1dc1ed6b48b2e0ef338462c1c05fa691';
    
    // Prepare headers with the API token
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_TOKEN}`
    };
    
    // Log the request details
    console.log(`Testing Strapi Cloud API for ${type}...`);
    console.log('Strapi URL:', STRAPI_URL);
    console.log('API Token exists:', !!API_TOKEN);
    
    // Determine the endpoint based on the type
    let endpoint = '';
    if (type === 'articles') {
      endpoint = '/api/articles?populate=*';
    } else if (type === 'categories') {
      endpoint = '/api/categories?populate=*';
    } else {
      return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }
    
    // Make the request to Strapi Cloud
    console.log(`Fetching from ${STRAPI_URL}${endpoint}`);
    const response = await fetch(`${STRAPI_URL}${endpoint}`, { headers });
    
    if (!response.ok) {
      console.error(`Failed to fetch ${type}: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: `Failed to fetch ${type}: ${response.status} ${response.statusText}` }, 
        { status: response.status }
      );
    }
    
    // Parse the response
    const data = await response.json();
    console.log(`Successfully fetched ${type} data`);
    
    // Return the data
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in test-strapi API route:', error);
    return NextResponse.json(
      { error: error.message || 'An unknown error occurred' }, 
      { status: 500 }
    );
  }
}
