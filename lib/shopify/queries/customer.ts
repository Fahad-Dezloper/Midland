export const GET_CUSTOMER = `
  query getCustomer($token: String!) {
    customer(customerAccessToken: $token) {
      id
      email
      firstName
      lastName
      phone
      acceptsMarketing
      createdAt
      updatedAt
    }
  }
`;

export const GET_CUSTOMER_ORDERS = `
  query getCustomerOrders($token: String!, $first: Int!) {
    customer(customerAccessToken: $token) {
      id
      email
      firstName
      lastName
      phone
      acceptsMarketing
      createdAt
      updatedAt
      orders(first: $first) {
        edges {
          node {
            id
            name
            orderNumber
            processedAt
            fulfillmentStatus
            financialStatus
            totalPriceV2 {
              amount
              currencyCode
            }
            lineItems(first: 10) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    image {
                      url
                      altText
                      width
                      height
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_ORDER_TRACKING = `
  query getOrderTracking($id: ID!) {
    order(id: $id) {
      id
      name
      fulfillments(first: 10) {
        id
        status
        createdAt
        deliveredAt
        estimatedDeliveryAt
        inTransitAt
        displayStatus
        trackingInfo(first: 10) {
          company
          number
          url
        }
        fulfillmentLineItems(first: 10) {
          edges {
            node {
              id
              quantity
              lineItem {
                title
              }
            }
          }
        }
      }
    }
  }
`;

export const customerFragment = `
  fragment customerFragment on Customer {
    id
    email
    firstName
    lastName
    phone
    acceptsMarketing
    createdAt
    updatedAt
  }
`;
