import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { email, fullName, phone, password } = await req.json();

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
          email
          phone 
          firstName
          smsMarketingConsent {
            marketingState
            marketingOptInLevel
            consentUpdatedAt
          }
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
          input: { 
            email, 
            phone, 
            firstName: fullName, 
            smsMarketingConsent: {
              marketingState: "SUBSCRIBED",
              marketingOptInLevel: "SINGLE_OPT_IN"
            } 
          },
        },
      }),
    });

    const createData = await createRes.json();

    const userErrors = createData?.data?.customerCreate?.userErrors;
    if (createData.errors || (userErrors && userErrors.length > 0)) {
      console.error('create-customer: GraphQL errors', createData.errors || userErrors);
      const message = Array.isArray(createData.errors)
        ? createData.errors.map((e: any) => e.message).join(', ')
        : Array.isArray(userErrors)
        ? userErrors.map((e: any) => e.message).join(', ')
        : 'Failed to create customer';
      return NextResponse.json({ error: message, details: createData.errors || userErrors }, { status: 400 });
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
      console.error('create-customer: Invite errors', inviteData.errors || inviteErrors);
      const message = Array.isArray(inviteData.errors)
        ? inviteData.errors.map((e: any) => e.message).join(', ')
        : Array.isArray(inviteErrors)
        ? inviteErrors.map((e: any) => e.message).join(', ')
        : 'Failed to send invite email';
      return NextResponse.json({ error: message, details: inviteData.errors || inviteErrors }, { status: 400 });
    }

    return NextResponse.json({
      customer: createData.data.customerCreate.customer,
      inviteSent: true,
    });
  } catch (error) {
    console.error('create-customer: Unexpected error', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
