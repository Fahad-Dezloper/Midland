import { ReadonlyURLSearchParams } from 'next/navigation';

export const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000';

export const createUrl = (
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams
) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? '?' : ''}${paramsString}`;

  return `${pathname}${queryString}`;
};

export const ensureStartsWith = (stringToCheck: string, startsWith: string) =>
  stringToCheck.startsWith(startsWith)
    ? stringToCheck
    : `${startsWith}${stringToCheck}`;

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

export const getMetafieldValue = (
  metafields: any[],
  namespace: string,
  key: string
): string => {
  const metafield = metafields.find(
    (mf) => mf.namespace === namespace && mf.key === key
  );
  return metafield?.value || '';
};

export const getAuthorName = (metafields: any[]): string => {
  const authorNameMetafield = metafields.find(
    (mf) => mf.key === 'author_name'
  );
  
  if (authorNameMetafield?.value) {
    return authorNameMetafield.value;
  }
  
  const authorMetafield = metafields.find(
    (mf) => mf.namespace === 'books' && mf.key === 'author'
  );
  
  if (authorMetafield?.reference?.fields) {
    const nameField = authorMetafield.reference.fields.find(
      (field: any) => field.key === 'author_name'
    );
    return nameField?.value || '';
  }
  
  return '';
};

export const getShortDescription = (metafields: any[]): string => {
  const shortDescriptionMetafield = metafields.find(
    (mf) => mf.namespace === 'books' && mf.key === 'short_description'
  );
  
  return shortDescriptionMetafield?.value || '';
};

export const getBookSpecifications = (metafields: any[]) => {
  const pages = getMetafieldValue(metafields, 'book', 'pages');
  const language = getMetafieldValue(metafields, 'book', 'language');
  const publisher = getMetafieldValue(metafields, 'book', 'publisher');
  const publicationDate = getMetafieldValue(metafields, 'book', 'publication_date');
  const format = getMetafieldValue(metafields, 'book', 'format');
  
  return {
    pages: pages ? `${pages} pages` : '',
    language,
    publisher,
    publicationDate: publicationDate ? formatDate(publicationDate) : '',
    format
  };
};

export const parseRichTextDescription = (description: string): string => {
  if (!description) return '';
  
  try {
    const parsed = JSON.parse(description);
    return convertRichTextToHtml(parsed);
  } catch (error) {
    return description;
  }
};

const convertRichTextToHtml = (node: any): string => {
  if (!node) return '';
  
  switch (node.type) {
    case 'root':
      return node.children?.map((child: any) => convertRichTextToHtml(child)).join('') || '';
    
    case 'paragraph':
      return `<p>${node.children?.map((child: any) => convertRichTextToHtml(child)).join('') || ''}</p>`;
    
    case 'text':
      let text = node.value || '';
      if (node.bold) text = `<strong>${text}</strong>`;
      if (node.italic) text = `<em>${text}</em>`;
      return text;
    
    default:
      return node.children?.map((child: any) => convertRichTextToHtml(child)).join('') || '';
  }
};

export const validateEnvironmentVariables = () => {
  const requiredEnvironmentVariables = [
    'SHOPIFY_STORE_DOMAIN',
    'SHOPIFY_STOREFRONT_ACCESS_TOKEN'
  ];
  const missingEnvironmentVariables = [] as string[];

  requiredEnvironmentVariables.forEach((envVar) => {
    if (!process.env[envVar]) {
      missingEnvironmentVariables.push(envVar);
    }
  });

  if (missingEnvironmentVariables.length) {
    throw new Error(
      `The following environment variables are missing. Your site will not work without them. Read more: https://vercel.com/docs/integrations/shopify#configure-environment-variables\n\n${missingEnvironmentVariables.join(
        '\n'
      )}\n`
    );
  }

  if (
    process.env.SHOPIFY_STORE_DOMAIN?.includes('[') ||
    process.env.SHOPIFY_STORE_DOMAIN?.includes(']')
  ) {
    throw new Error(
      'Your `SHOPIFY_STORE_DOMAIN` environment variable includes brackets (ie. `[` and / or `]`). Your site will not work with them there. Please remove them.'
    );
  }
};
