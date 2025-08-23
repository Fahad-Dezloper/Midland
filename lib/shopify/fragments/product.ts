import imageFragment from './image';
import seoFragment from './seo';

const productFragment = /* GraphQL */ `
  fragment product on Product {
    id
    handle
    availableForSale
    title
    description
    descriptionHtml
    vendor
    productType
    options {
      id
      name
      values
    }
    priceRange {
      maxVariantPrice {
        amount
        currencyCode
      }
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 250) {
      edges {
        node {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
        }
      }
    }
    featuredImage {
      ...image
    }
    metafields(identifiers: [
      {namespace: "books", key: "author"},
      {namespace: "books", key: "short_description"},
      {namespace: "book", key: "format"},
      {namespace: "book", key: "publication_date"},
      {namespace: "book", key: "language"},
      {namespace: "book", key: "pages"},
      {namespace: "book", key: "publisher"}
    ]) {
      namespace
      key
      value
      type
      reference {
        ... on Metaobject {
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
    images(first: 20) {
      edges {
        node {
          ...image
        }
      }
    }
    seo {
      ...seo
    }
    tags
    updatedAt
  }
  ${imageFragment}
  ${seoFragment}
`;

export default productFragment;

