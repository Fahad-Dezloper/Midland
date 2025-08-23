import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { BadgePercentIcon } from '@/components/ui/badge-percent';
import BuyNowSection from 'components/(productPage)/BuyNow';
import ReleatedProducts from 'components/(productPage)/ReleatedProducts';
import SameAuthorProducts from 'components/(productPage)/SameAuthorProducts';
import ReviewSection from 'components/(sharedComponents)/ReviewSection';
import { Gallery } from 'components/product/gallery';
import { ProductProvider } from 'components/product/product-context';
import { HIDDEN_PRODUCT_TAG } from 'lib/constants';
import { getProduct } from 'lib/shopify';
import { Image as ShopifyImage } from 'lib/shopify/types';
import { formatDate, getAuthorName, getBookSpecifications, getMetafieldValue, getShortDescription } from 'lib/utils';
import { BookOpen, Building, Calendar, Globe, Layers, Star } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable
      }
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt
            }
          ]
        }
      : null
  };
}

export default async function ProductPage(props: { params: Promise<{ handle: string }> }) {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.featuredImage.url,
    offers: {
      '@type': 'AggregateOffer',
      availability: product.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount
    }
  };

  // console.log("products data", product);

  return (
    <ProductProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd)
        }}
      />
      
      {/* Breadcrumb */}
      <div className="py-4 font-primary">
        <nav className="text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-700">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-gray-700">Best Seller</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Product Name</span>
        </nav>
      </div>

      <div className="pb-8">
        <div className="flex gap-8">
          {/* Left Sidebar - Book Cover */}
          <div className="w-[280px] flex-shrink-0">
            <Suspense
              fallback={
                <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden bg-gray-100 rounded-lg" />
              }
            >
              <Gallery
                images={product.images.slice(0, 5).map((image: ShopifyImage) => ({
                  src: image.url,
                  altText: image.altText
                }))}
              />
            </Suspense>
            
          </div>

          {/* Main Content Area */}
          <div className="flex-1 font-primary">
            {/* Title and Author */}
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-gray-900 mb-1 font-primary">{product.title}</h1>
              
              {(() => {
                const format = getMetafieldValue(product.metafields, 'book', 'format');
                const pubDateRaw = getMetafieldValue(product.metafields, 'book', 'publication_date');
                const pubDateFormatted = formatDate(pubDateRaw);
                const authorName = getAuthorName(product.metafields);
                
                return (
                  <>
                    <p className="text-gray-600 text-sm font-body">
                      {format}
                      {format && pubDateFormatted ? ' - ' : ''}
                      {pubDateFormatted}
                    </p>
                    {authorName && (
                      <p className="text-gray-600 text-sm font-body">
                        by <Link href={`/author/${authorName.toLowerCase().replace(/\s+/g, '-')}`}>
                          <span className='text-primary font-primary underline text-base cursor-pointer'>{authorName}</span>
                        </Link> (Author)
                      </p>
                    )}
                  </>
                );
              })()}
            </div>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                <span className="text-lg font-bold mr-1 font-primary">4.3</span>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : i === 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <Link href="#" className="text-primary text-sm hover:underline font-body">1,309 ratings</Link>
            </div>
            
            {/* Promotional Offer */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shadow"
                >
                  <BadgePercentIcon className='text-primary' />
                </div>
                <span className="text-base font-semibold font-primary ">
                  Save <span className="font-bold">5%</span> by becoming a member of <span className="underline text-primary">Midland Book Shop</span>
                </span>
              </div>
            </div>
            
            {/* Book Description */}
            <div className="mb-6">
              {(() => {
                const shortDescription = getShortDescription(product.metafields);
                return shortDescription ? (
                  <>
                    <h3 className="text-lg font-bold mb-3 font-primary">About this book</h3>
                    <p className="text-sm text-gray-700 leading-relaxed mb-4 font-body">
                      {shortDescription}
                    </p>
                  </>
                ) : null;
              })()}
            </div>
            
            {/* Report Issue */}
            {/* <div className="mb-6">
              <Link href="#" className="text-blue-600 text-sm hover:underline flex items-center gap-1 font-body">
                <div className="w-4 h-4 border border-gray-400 rounded flex items-center justify-center">
                  <span className="text-xs">!</span>
                </div>
                Report an issue with this product
              </Link>
            </div> */}
            
            {/* Book Specifications */}
            {(() => {
              const specs = getBookSpecifications(product.metafields);
              const hasSpecs = specs.pages || specs.language || specs.publisher || specs.publicationDate || specs.format;
              
              return hasSpecs ? (
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {specs.format && (
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-5 h-5 text-gray-500" />
                        <div>
                          <span className="text-gray-500 font-body">Format:</span>
                          <span className="ml-1 font-body">{specs.format}</span>
                        </div>
                      </div>
                    )}
                    {specs.pages && (
                      <div className="flex items-center gap-3">
                        <Layers className="w-5 h-5 text-gray-500" />
                        <div>
                          <span className="text-gray-500 font-body">Print length:</span>
                          <span className="ml-1 font-body">{specs.pages}</span>
                        </div>
                      </div>
                    )}
                    {specs.language && (
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-gray-500" />
                        <div>
                          <span className="text-gray-500 font-body">Language:</span>
                          <span className="ml-1 font-body">{specs.language}</span>
                        </div>
                      </div>
                    )}
                    {specs.publisher && (
                      <div className="flex items-center gap-3">
                        <Building className="w-5 h-5 text-gray-500" />
                        <div>
                          <span className="text-gray-500 font-body">Publisher:</span>
                          <span className="ml-1 font-body">{specs.publisher}</span>
                        </div>
                      </div>
                    )}
                    {specs.publicationDate && (
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <div>
                          <span className="text-gray-500 font-body">Publication date:</span>
                          <span className="ml-1 font-body">{specs.publicationDate}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : null;
            })()}
          </div>

          {/* Right Sidebar - Purchase Options */}
          <div className="w-[320px] flex-shrink-0">
            <BuyNowSection product={product} />
          </div>
        </div>

        {/* Other Books by Same Author */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8 font-primary">Other Books by Same Author</h2>
          <SameAuthorProducts id={product.id} authorName={getAuthorName(product.metafields)} />
        </div>

        {/* Similar Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8 font-primary">Similar Books</h2>
          <ReleatedProducts id={product.id} />
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8 font-primary">Review And Rating</h2>
          <ReviewSection />
        </div>
      </div>
    </ProductProvider>
  );
}