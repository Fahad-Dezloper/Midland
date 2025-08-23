export const getEventsQuery = /* GraphQL */ `
    query ($first: Int, $after: String) {
    metaobjects(type: "events", first: $first, after: $after) {
        edges {
        node {
            id
            handle
            fields {
            key
            value
            type
            reference {
                ... on MediaImage {
                  id
                  image {
                    url
                    altText
                    width
                    height
                  }
                }
            }
            }
            updatedAt
        }
        }
        pageInfo {
        hasNextPage
        endCursor
        }
    }
    }
`

export const getPastEventsQuery = /* GraphQL */ `
    query ($first: Int, $after: String) {
    metaobjects(type: "past_events", first: $first, after: $after) {
        edges {
        node {
            id
            handle
            fields {
            key
            value
            type
            reference {
                ... on MediaImage {
                  id
                  image {
                    url
                    altText
                    width
                    height
                  }
                }
            }
            }
            updatedAt
        }
        }
        pageInfo {
        hasNextPage
        endCursor
        }
    }
    }
`