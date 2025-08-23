export const getBannerImagesQuery = /* GraphQL */ `
  query getBannerImages {
    metaobjects(type: "banner_images", first: 10) {
      edges {
        node {
          id
          handle
          fields {
            key
            value
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
        }
      }
    }
  }
`;
