import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const storeDomain = "midland-ecom.myshopify.com";
  const storefrontToken = "e0d367302bc432210b5ec2547260195d";
  const endpoint = `https://${storeDomain}/api/2025-07/graphql.json`;

  const query = `
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerUserErrors {
          code
          field
          message
        }
        customerAccessToken {
          accessToken
          expiresAt
        }
      }
    }
  `;

  const variables = {
    input: {
      email,
      password,
    },
  };

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontToken,
      },
      body: JSON.stringify({ query, variables }),
    });

    const data = await res.json();
    const { customerAccessToken, customerUserErrors } = data.data.customerAccessTokenCreate;

    if (customerUserErrors.length > 0) {
      return NextResponse.json({ error: customerUserErrors }, { status: 401 });
    }

    return NextResponse.json({
      token: customerAccessToken.accessToken,
      expiresAt: customerAccessToken.expiresAt,
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : error }, { status: 500 });
  }
}
