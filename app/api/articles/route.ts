import { NextRequest, NextResponse } from 'next/server';

const SHOPIFY_ADMIN_API_KEY = process.env.SHOPIFY_ADMIN_API_KEY;
const BLOG_ID = "117983576346"; // Same blog ID as in your existing code

export async function POST(request: NextRequest) {
  try {
    const endpoint = `https://midland-ecom.myshopify.com/admin/api/2025-07/blogs/${BLOG_ID}/articles.json`;

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_API_KEY || '',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Shopify API error details:', errorText);
      throw new Error(`Shopify API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 