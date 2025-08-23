import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { email, firstName, lastName } = await req.json();

  const adminApiKey = process.env.SHOPIFY_ADMIN_API_KEY;
  const storeDomain = 'navbar-dezloper.myshopify.com';
  const endpoint = `https://${storeDomain}/admin/api/2025-07/graphql.json`;

  const createCustomerMutation = `
    mutation customerCreate($input: CustomerInput!) {
      customerCreate(input: $input) {
        userErrors {
          field
          message
        }
        customer {
          id
          firstName
          lastName
        }
      }
    }
  `;

  const sendInviteMutation = `
    mutation CustomerSendAccountInviteEmail($customerId: ID!) {
      customerSendAccountInviteEmail(customerId: $customerId) {
        customer {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    // 1. Create the customer
    const createRes = await fetch(endpoint, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminApiKey ?? '',
      }),
      body: JSON.stringify({
        query: createCustomerMutation,
        variables: {
          input: { email, firstName, lastName },
        },
      }),
    });

    const createData = await createRes.json();

    const userErrors = createData?.data?.customerCreate?.userErrors;
    if (createData.errors || (userErrors && userErrors.length > 0)) {
      return NextResponse.json({ error: createData.errors || userErrors }, { status: 400 });
    }

    const customerId = createData.data.customerCreate.customer.id;

    // 2. Send the welcome email
    const inviteRes = await fetch(endpoint, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminApiKey ?? '',
      }),
      body: JSON.stringify({
        query: sendInviteMutation,
        variables: {
          customerId,
        },
      }),
    });

    const inviteData = await inviteRes.json();
    console.log("Invite response", inviteData);

    const inviteErrors = inviteData?.data?.customerSendAccountInviteEmail?.userErrors;
    if (inviteData.errors || (inviteErrors && inviteErrors.length > 0)) {
      return NextResponse.json({ error: inviteData.errors || inviteErrors }, { status: 400 });
    }

    return NextResponse.json({
      customer: createData.data.customerCreate.customer,
      inviteSent: true,
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : error }, { status: 500 });
  }
}
