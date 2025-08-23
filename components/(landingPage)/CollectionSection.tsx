import { Button } from "@/components/ui/button";
import { getCollectionProducts } from "lib/shopify";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CollectionSectionProps {
  section: string;
  title: string;
}

const CollectionSection = async ({ section, title }: CollectionSectionProps) => {
    const BestSellerItems = await getCollectionProducts({
      collection: section
    });

    // console.log("collection item", BestSellerItems);
        
    return (
      <div className="w-full h-fit flex flex-col gap-3 font-primary">
          <h1 className="collection-heading leading-tight">{title}</h1>
          <div className="md:grid flex md:grid-cols-3 md:grid-rows-2 gap-4 gap-y-6 overflow-x-scroll md:overflow-x-hidden">
              {BestSellerItems.map((book, i) => (
                  <Link href={`/product/${book.handle}`} key={i} className="block">
                      <div className="md:min-w-[28vw] min-w-[38vw] md:flex flex flex-col md:flex-row max-h-[40vh] gap-4 md:bg-[#F6F5FB] rounded-2xl md:p-4 hover:shadow-sm transition-shadow duration-200">
                          <div className="flex-shrink-0">
                              <div className="w-36 h-54 overflow-hidden">
                                  <Image
                                      src={book.featuredImage.url} 
                                      alt="book image" 
                                      className="rounded-xl w-full h-full object-cover" 
                                      width={140} 
                                      height={160} 
                                  />
                              </div>
                          </div>
                          <div className="flex flex-col justify-between">
                              <div className="flex flex-col w-full gap-3">
                                  <div className="w-full flex flex-col h-full md:flex-row gap-2 justify-between items-start">
                                      <h3 className="leading-tight">{book.title}</h3>
                                      <span className="md:hidden flex"><span className="font-light">₹</span>{typeof book.priceRange?.maxVariantPrice === 'object' && 'amount' in book.priceRange.maxVariantPrice
                                              ? book.priceRange.maxVariantPrice.amount
                                              : book.priceRange?.maxVariantPrice ?? ''}</span>
                                      <span className="md:flex hidden"><Heart /></span>
                                  </div>
                                  <div className="md:flex hidden justify-between items-center">
                                      {/* @ts-ignore */}
                                      <span className="text-[#787878] text-sm">{book.vendor}</span>
                                      <span>
                                          <span className="font-light">₹</span>
                                          {typeof book.priceRange?.maxVariantPrice === 'object' && 'amount' in book.priceRange.maxVariantPrice
                                              ? book.priceRange.maxVariantPrice.amount
                                              : book.priceRange?.maxVariantPrice ?? ''}
                                      </span>
                                  </div>
                                  <div className="text-[#6B6B6B] md:flex hidden leading-tight text-xs">
                                      {book.description && book.description.length > 232 
                                        ? `${book.description.substring(0, 232)}...` 
                                        : book.description
                                      }
                                  </div>
                              </div> 
                              <div className="md:flex hidden gap-4">
                                  <Button className="text-white">Add to cart</Button>
                                  <Button className="text-white">Buy Now</Button>
                              </div>
                          </div>
                      </div>
                  </Link>
              ))}
          </div>
      </div>
    )
}

export default CollectionSection