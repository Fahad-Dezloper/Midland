export const getBlogsQuery = `
query ($first: Int, $after: String) {
  blog(id: "gid://shopify/Blog/117983576346") {
    id
    title
    handle
    articles(first: $first, after: $after) {
      nodes {
        id
        title
        handle
        body
        summary
        author {
          name
        }
        publishedAt
        createdAt
        updatedAt
        isPublished
        tags
        image {
          url
          altText
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}
`;