'use server'
import {
  HIDDEN_PRODUCT_TAG,
  SHOPIFY_GRAPHQL_API_ENDPOINT,
  TAGS
} from 'lib/constants';
import { isShopifyError } from 'lib/type-guards';
import { ensureStartsWith } from 'lib/utils';
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
  revalidateTag
} from 'next/cache';
import { cookies, headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import {
  addToCartMutation,
  createCartMutation,
  editCartItemsMutation,
  removeFromCartMutation
} from './mutations/cart';
import { getBannerImagesQuery } from './queries/bannerImage';
import { getCartQuery } from './queries/cart';
import {
  getCollectionProductsQuery,
  getCollectionQuery,
  getCollectionsQuery
} from './queries/collection';
import { GET_CUSTOMER } from './queries/customer';
import { getEventsQuery, getPastEventsQuery } from './queries/events';
import { getMenuQuery } from './queries/menu';
import { getPageQuery, getPagesQuery } from './queries/page';
import {
  getProductQuery,
  getProductRecommendationsQuery,
  getProductsByAuthorQuery,
  getProductsQuery
} from './queries/product';
import {
  AuthorDetails,
  BannerImage,
  Cart,
  Collection,
  Connection,
  Customer,
  EventDets,
  Image,
  Menu,
  Page,
  PastEventDets,
  Product,
  ShopifyAddToCartOperation,
  ShopifyBannerImagesOperation,
  ShopifyCart,
  ShopifyCartOperation,
  ShopifyCollection,
  ShopifyCollectionOperation,
  ShopifyCollectionProductsOperation,
  ShopifyCollectionsOperation,
  ShopifyCreateCartOperation,
  ShopifyCustomerOperation,
  ShopifyEventsOperation,
  ShopifyMenuOperation,
  ShopifyPageOperation,
  ShopifyPagesOperation,
  ShopifyProduct,
  ShopifyProductOperation,
  ShopifyProductRecommendationsOperation,
  ShopifyProductsByAuthorOperation,
  ShopifyProductsOperation,
  ShopifyRemoveFromCartOperation,
  ShopifyUpdateCartOperation
} from './types';

const domain = process.env.SHOPIFY_STORE_DOMAIN
  ? ensureStartsWith(process.env.SHOPIFY_STORE_DOMAIN, 'https://')
  : '';
const endpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;
const adminKey = process.env.SHOPIFY_ADMIN_API_KEY!;

type ExtractVariables<T> = T extends { variables: object }
  ? T['variables']
  : never;

export async function shopifyFetch<T>({
  headers,
  query,
  variables
}: {
  headers?: HeadersInit;
  query: string;
  variables?: ExtractVariables<T>;
}): Promise<{ status: number; body: T } | never> {
  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': key,
        ...headers
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables })
      })
    });

    const body = await result.json();
    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body
    };
  } catch (e) {
    if (isShopifyError(e)) {
      throw {
        cause: e.cause?.toString() || 'unknown',
        status: e.status || 500,
        message: e.message,
        query
      };
    }

    throw {
      error: e,
      query
    };
  }
}

export async function shopifyFetchBlogs<T>({
  headers,
  blogId = "117983576346"
}: {
  headers?: HeadersInit;
  blogId?: string;
}): Promise<{ status: number; body: T } | never> {
  const adminKey = process.env.SHOPIFY_ADMIN_API_KEY;
  const endpoint = `https://midland-ecom.myshopify.com/admin/api/2025-07/blogs/${blogId}/articles.json`;

  try {
    const result = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminKey ?? '',
        ...headers
      }
    });

    const body = await result.json();

    if (!result.ok) {
      throw body;
    }

    return {
      status: result.status,
      body
    };
  } catch (e) {
    throw {
      error: e
    };
  }
}

const removeEdgesAndNodes = <T>(array: Connection<T>): T[] => {
  return array.edges.map((edge) => edge?.node);
};

const reshapeCart = (cart: ShopifyCart): Cart => {
  if (!cart.cost?.totalTaxAmount) {
    cart.cost.totalTaxAmount = {
      amount: '0.0',
      currencyCode: cart.cost.totalAmount.currencyCode
    };
  }

  return {
    ...cart,
    lines: removeEdgesAndNodes(cart.lines)
  };
};

const reshapeCollection = (
  collection: ShopifyCollection
): Collection | undefined => {
  if (!collection) {
    return undefined;
  }

  return {
    ...collection,
    path: `/search/${collection.handle}`
  };
};

const reshapeCollections = (collections: ShopifyCollection[]) => {
  const reshapedCollections = [];

  for (const collection of collections) {
    if (collection) {
      const reshapedCollection = reshapeCollection(collection);

      if (reshapedCollection) {
        reshapedCollections.push(reshapedCollection);
      }
    }
  }

  return reshapedCollections;
};

const reshapeImages = (images: Connection<Image>, productTitle: string) => {
  const flattened = removeEdgesAndNodes(images);

  return flattened.map((image) => {
    const filename = image.url.match(/.*\/(.*)\..*/)?.[1];
    return {
      ...image,
      altText: image.altText || `${productTitle} - ${filename}`
    };
  });
};

const reshapeProduct = (
  product: ShopifyProduct,
  filterHiddenProducts: boolean = true
) => {
  if (
    !product ||
    (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))
  ) {
    return undefined;
  }

  const { images, variants, ...rest } = product;

  return {
    ...rest,
    images: reshapeImages(images, product.title),
    variants: removeEdgesAndNodes(variants)
  };
};

const reshapeProducts = (products: ShopifyProduct[]) => {
  const reshapedProducts = [];

  for (const product of products) {
    if (product) {
      const reshapedProduct = reshapeProduct(product);

      if (reshapedProduct) {
        reshapedProducts.push(reshapedProduct);
      }
    }
  }

  return reshapedProducts;
};

export async function createCart(): Promise<Cart> {
  const res = await shopifyFetch<ShopifyCreateCartOperation>({
    query: createCartMutation
  });

  return reshapeCart(res.body.data.cartCreate.cart);
}

export async function addToCart(
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const cartId = (await cookies()).get('cartId')?.value!;
  const res = await shopifyFetch<ShopifyAddToCartOperation>({
    query: addToCartMutation,
    variables: {
      cartId,
      lines
    }
  });
  return reshapeCart(res.body.data.cartLinesAdd.cart);
}

export async function removeFromCart(lineIds: string[]): Promise<Cart> {
  const cartId = (await cookies()).get('cartId')?.value!;
  const res = await shopifyFetch<ShopifyRemoveFromCartOperation>({
    query: removeFromCartMutation,
    variables: {
      cartId,
      lineIds
    }
  });

  return reshapeCart(res.body.data.cartLinesRemove.cart);
}

export async function updateCart(
  lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const cartId = (await cookies()).get('cartId')?.value!;
  const res = await shopifyFetch<ShopifyUpdateCartOperation>({
    query: editCartItemsMutation,
    variables: {
      cartId,
      lines
    }
  });

  return reshapeCart(res.body.data.cartLinesUpdate.cart);
}

export async function getCart(): Promise<Cart | undefined> {
  const cartId = (await cookies()).get('cartId')?.value;

  if (!cartId) {
    return undefined;
  }

  const res = await shopifyFetch<ShopifyCartOperation>({
    query: getCartQuery,
    variables: { cartId }
  });

  // Old carts becomes `null` when you checkout.
  if (!res.body.data.cart) {
    return undefined;
  }

  return reshapeCart(res.body.data.cart);
}

export async function getCollection(
  handle: string
): Promise<Collection | undefined> {
  'use cache';
  cacheTag(TAGS.collections);
  cacheLife('days');

  let res;
  try {
    res = await shopifyFetch<ShopifyCollectionOperation>({
      query: getCollectionQuery,
      variables: {
        handle
      }
    });
  } catch (error) {
    console.error('Error fetching collection:', error);
    return undefined;
  }

  return reshapeCollection(res.body.data.collection);
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  'use cache';
  cacheTag(TAGS.collections, TAGS.products);
  cacheLife('days');

  const res = await shopifyFetch<ShopifyCollectionProductsOperation>({
    query: getCollectionProductsQuery,
    variables: {
      handle: collection,
      reverse,
      sortKey: sortKey === 'CREATED_AT' ? 'CREATED' : sortKey
    }
  });

  if (!res.body.data.collection) {
    console.log(`No collection found for \`${collection}\``);
    return [];
  }

  return reshapeProducts(
    removeEdgesAndNodes(res.body.data.collection.products)
  );
}

export async function getCollections(): Promise<Collection[]> {
  'use cache';
  cacheTag(TAGS.collections);
  cacheLife('days');

  const res = await shopifyFetch<ShopifyCollectionsOperation>({
    query: getCollectionsQuery
  });
  const shopifyCollections = removeEdgesAndNodes(res.body?.data?.collections);
  const collections = [
    {
      handle: '',
      title: 'All',
      description: 'All products',
      seo: {
        title: 'All',
        description: 'All products'
      },
      path: '/search',
      updatedAt: new Date().toISOString()
    },
    // Filter out the `hidden` collections.
    // Collections that start with `hidden-*` need to be hidden on the search page.
    ...reshapeCollections(shopifyCollections).filter(
      (collection) => !collection.handle.startsWith('hidden')
    )
  ];

  return collections;
}

export async function getMenu(handle: string): Promise<Menu[]> {
  'use cache';
  cacheTag(TAGS.collections);
  cacheLife('days');

  const res = await shopifyFetch<ShopifyMenuOperation>({
    query: getMenuQuery,
    variables: {
      handle
    }
  });

  return (
    res.body?.data?.menu?.items.map((item: { title: string; url: string }) => ({
      title: item.title,
      path: item.url
        .replace(domain, '')
        .replace('/collections', '/search')
        .replace('/pages', '')
    })) || []
  );
}

export async function getPage(handle: string): Promise<Page> {
  const res = await shopifyFetch<ShopifyPageOperation>({
    query: getPageQuery,
    variables: { handle }
  });

  return res.body.data.pageByHandle;
}

export async function getPages(): Promise<Page[]> {
  const res = await shopifyFetch<ShopifyPagesOperation>({
    query: getPagesQuery
  });

  return removeEdgesAndNodes(res.body.data.pages);
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  'use cache';
  cacheTag(TAGS.products);
  cacheLife('days');

  const res = await shopifyFetch<ShopifyProductOperation>({
    query: getProductQuery,
    variables: {
      handle
    }
  });

  return reshapeProduct(res.body.data.product, false);
}

export async function getProductRecommendations(
  productId: string
): Promise<Product[]> {
  'use cache';
  cacheTag(TAGS.products);
  cacheLife('days');

  const res = await shopifyFetch<ShopifyProductRecommendationsOperation>({
    query: getProductRecommendationsQuery,
    variables: {
      productId
    }
  });

  return reshapeProducts(res.body.data.productRecommendations);
}

export async function getProductFromSameAuthor(
  authorName: string
): Promise<Product[]> {
  'use cache';
  cacheTag(TAGS.products);
  cacheLife('days');
  
  if (!authorName) {
    return [];
  }
  try {
    const res = await shopifyFetch<ShopifyProductsByAuthorOperation>({
      query: getProductsByAuthorQuery,
      variables: {
        authorName: `metafields.books.author:*${authorName}*`,
        first: 10
      }
    });

    if (!res.body?.data?.products?.edges) {
      return [];
    }
    return reshapeProducts(res.body.data.products.edges.map((edge: any) => edge.node));
  } catch (error) {
    console.error('Error fetching products by author:', error);
    return [];
  }
}

export async function getAuthorDetailsAndBooks(
  authorName: string
): Promise<{ author: AuthorDetails | null; books: Product[] }> {
  'use cache';
  cacheTag(TAGS.products);
  cacheLife('days');
  
  if (!authorName) {
    return { author: null, books: [] };
  }
  
  try {
    const res = await shopifyFetch<ShopifyProductsByAuthorOperation>({
      query: getProductsByAuthorQuery,
      variables: {
        authorName: `metafields.books.author:*${authorName}*`,
        first: 50
      }
    });

    if (!res.body?.data?.products?.edges) {
      return { author: null, books: [] };
    }

    const products = res.body.data.products.edges.map((edge: any) => edge.node);
    const books = reshapeProducts(products);

    // Extract author details from the first product
    let authorDetails = null;
    if (products[0]?.metafields) {
      const authorMetafield = products[0].metafields.find(
        (mf: any) => mf.namespace === 'books' && mf.key === 'author'
      );
      
      if (authorMetafield?.reference?.fields) {
        const nameField = authorMetafield.reference.fields.find((field: any) => field.key === 'author_name');
        const descriptionField = authorMetafield.reference.fields.find((field: any) => field.key === 'author_description');
        const imageField = authorMetafield.reference.fields.find((field: any) => field.key === 'author_image');
        
        authorDetails = {
          name: nameField?.value || authorName,
          description: descriptionField?.value || '',
          image: imageField?.reference?.image || null
        };
      }
    }

    return { author: authorDetails, books };
  } catch (error) {
    console.error('Error fetching author details and books:', error);
    return { author: null, books: [] };
  }
}

export async function getProducts({
  query,
  reverse,
  sortKey
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  'use cache';
  cacheTag(TAGS.products);
  cacheLife('days');

  const res = await shopifyFetch<ShopifyProductsOperation>({
    query: getProductsQuery,
    variables: {
      query,
      reverse,
      sortKey
    }
  });

  return reshapeProducts(removeEdgesAndNodes(res.body.data.products));
}


// This is called from `app/api/revalidate.ts` so providers can control revalidation logic.
export async function revalidate(req: NextRequest): Promise<NextResponse> {
  // We always need to respond with a 200 status code to Shopify,
  // otherwise it will continue to retry the request.
  const collectionWebhooks = [
    'collections/create',
    'collections/delete',
    'collections/update'
  ];
  const productWebhooks = [
    'products/create',
    'products/delete',
    'products/update'
  ];
  const topic = (await headers()).get('x-shopify-topic') || 'unknown';
  const secret = req.nextUrl.searchParams.get('secret');
  const isCollectionUpdate = collectionWebhooks.includes(topic);
  const isProductUpdate = productWebhooks.includes(topic);

  if (!secret || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
    console.error('Invalid revalidation secret.');
    return NextResponse.json({ status: 401 });
  }

  if (!isCollectionUpdate && !isProductUpdate) {
    // We don't need to revalidate anything for any other topics.
    return NextResponse.json({ status: 200 });
  }

  if (isCollectionUpdate) {
    revalidateTag(TAGS.collections);
  }

  if (isProductUpdate) {
    revalidateTag(TAGS.products);
  }

  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}

export async function getBannerImages(): Promise<BannerImage[]> {
  const res = await shopifyFetch<ShopifyBannerImagesOperation>({
    query: getBannerImagesQuery,
  });
  
  const metaobjects = res?.body?.data?.metaobjects?.edges ?? [];

  return metaobjects.map(({ node }) => {
    // Find the field with key 'images' (as shown in your console log)
    const imageField = node.fields.find((field: any) => field.key === 'images');
    const imageRef = imageField?.reference?.image;
    if (
      !imageRef ||
      typeof imageRef.url !== 'string' ||
      imageRef.url.length === 0
    ) {
      throw new Error('Banner image is missing a valid URL');
    }

    return {
      id: node.id,
      handle: node.handle,
      image: {
        url: imageRef.url,
        altText: imageRef.altText,
        width: imageRef.width,
        height: imageRef.height,
      },
    };
  });
}

export async function getEvents(): Promise<EventDets[]> {
  const res = await shopifyFetch<ShopifyEventsOperation>({
    query: getEventsQuery,
     // @ts-ignore: later
    variables: { first: 50 },
  });

  const metaobjects = res?.body?.data?.metaobjects?.edges ?? [];

  return metaobjects.map(({ node }) => {
    const fields = node.fields.reduce((acc: any, field: any) => {
      acc[field.key] = field;
      return acc;
    }, {});

    const imageRef = fields['event_image']?.reference;
    const image = imageRef?.image;

    return {
      id: node.id,
      handle: node.handle,
      name: fields['event_name']?.value || '',
      description: fields['event_description']?.value || '',
      date: fields['event_date']?.value || '',
      book_now: fields['book_now']?.value || '',
      image: image
        ? {
            url: image.url,
            altText: image.altText ?? null,
            width: image.width ?? 0,
            height: image.height ?? 0,
          }
        : null,
    };
  });
}

export async function getPastEventImages(): Promise<PastEventDets[]> {
  console.log("reached here");
  const res = await shopifyFetch<ShopifyEventsOperation>({
    query: getPastEventsQuery,
    // @ts-ignore: later
    variables: { first: 50 },
  });

  const metaobjects = res?.body?.data?.metaobjects?.edges ?? [];

  return metaobjects
    .map(({ node }) => {
      const fields = node.fields.reduce((acc: any, field: any) => {
        acc[field.key] = field;
        return acc;
      }, {});
      const imageRef = fields['event_images']?.reference;
      const image = imageRef?.image;
      const altText = fields['alt_text']?.value || null;
      if (image && image.url && altText) {
        return {
          url: image.url,
          altText: altText,
        };
      }
      return null;
    })
    .filter((x): x is { url: string; altText: string } => x !== null);
}

export async function getBlogs(): Promise<any> {
  const res = await shopifyFetchBlogs({
    blogId: "117983576346"
  });
  // @ts-ignore:i know it is not defined
  console.log("res", res?.body?.articles);
  // @ts-ignore:i know it is not defined
  const articles = res?.body?.articles;
  return articles;
}

export async function validateCustomerToken(token: string): Promise<Customer | null> {
  try {
    const res = await shopifyFetch<ShopifyCustomerOperation>({
      query: GET_CUSTOMER,
      variables: { token },
    });

    console.log("reacher here for validation", res.body.data.customer)

    return res.body.data.customer;
  } catch (error) {
    console.error('Error validating customer token:', error);
    return null;
  }
}


