"use client";
import { Sheet } from "@silk-hq/components";
import { DetachedSheet } from "./DetachedSheet";
import "./ExampleDetachedSheet.css";

interface BookQuickAddDetachedSheetProps {
  product: {
    id: string;
    handle: string;
    title: string;
    vendor: string;
    priceRange: { minVariantPrice: { amount: string } };
    featuredImage?: { url: string; altText?: string };
    description: string;
  };
}

const BookQuickAddDetachedSheet = ({
  product,
}: BookQuickAddDetachedSheetProps) => {
  const handleAddToCart = () => {
    // Placeholder for add to cart logic
    alert(`Added ${product.title} to cart!`);
  };

  return (
    <DetachedSheet
      presentTrigger={
        <Sheet.Trigger
          asChild
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            if (
              e.nativeEvent &&
              typeof e.nativeEvent.stopImmediatePropagation === "function"
            ) {
              e.nativeEvent.stopImmediatePropagation();
            }
          }}
        >
          <button
            type="button"
            className="w-full flex items-center p-3 rounded-xl bg-white justify-center"
          >
            <p className="text-sm font-medium">Quick Add</p>
          </button>
        </Sheet.Trigger>
      }
      sheetContent={
        <div className="ExampleDetachedSheet-root flex flex-col justify-between p-4 sm:p-6 min-h-[50vh] bg-white rounded-2xl mx-auto">
          {/* Main content: image, title, author */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-row items-start gap-3">
              <img
                src={product.featuredImage?.url || "/placeholder.jpg"}
                alt={product.featuredImage?.altText || product.title}
                className="w-32 h-44 object-cover rounded-xl border border-gray-200 shadow-sm flex-shrink-0"
              />
              <div className="flex flex-col gap-2 justify-center flex-1">
                <h2 className="md:text-3xl text-xl font-bold text-gray-900">
                  {product.title}
                </h2>
                <div className="flex w-full justify-between flex-wrap">
                <p className="text-gray-500 text-sm whitespace-nowrap">
                  by <span className="hover:text-primary underline cursor-pointer">{product.vendor}</span>
                </p>
                <div className="flex items-center gap-2">
                <span className="text-yellow-500 text-base sm:text-lg">★★★★★</span>
                <span className="text-xs sm:text-sm text-gray-600">(2<span className="md:inline hidden"> reviews</span>)</span>
              </div>
                </div>
                <div className="flex flex-row items-center justify-between md:mt-2">
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-2xl font-bold text-green-600">
                  ₹{product.priceRange.minVariantPrice.amount}
                </span>
                <span className="line-through text-gray-400 text-xs sm:text-base">
                  ₹
                  {parseFloat(
                    parseFloat(product.priceRange.minVariantPrice.amount) * 1.15 + ""
                  ).toFixed(2)}
                </span>
                <span className="text-xs sm:text-sm text-red-600 font-semibold">
                  Save 14%
                </span>
              </div>
            </div>
              </div>
            </div>
            {/* Reviews and Price */}
            {/* <div className="flex flex-row items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <span className="text-yellow-500 text-base sm:text-lg">★★★★★</span>
                <span className="text-xs sm:text-sm text-gray-600">(2 reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-2xl font-bold text-green-600">
                  ₹{product.priceRange.minVariantPrice.amount}
                </span>
                <span className="line-through text-gray-400 text-xs sm:text-base">
                  ₹
                  {parseFloat(
                    parseFloat(product.priceRange.minVariantPrice.amount) * 1.15 + ""
                  ).toFixed(2)}
                </span>
                <span className="text-xs sm:text-sm text-red-600 font-semibold">
                  Save 14%
                </span>
              </div>
            </div> */}
            {/* Description */}
            <p className="text-black text-xs sm:text-sm mt-2">
              {product.description}
            </p>
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                onClick={handleAddToCart}
                className="btn-primary cursor-pointer text-white py-2 px-4 rounded-xl text-sm font-medium transition duration-200 w-full sm:w-auto"
              >
                Add to Cart
              </button>
              <a
                href={`/product/${product.handle}`}
                className="border border-[#0493D7] hover:bg-blue-50 py-2 px-4 rounded-xl text-sm font-medium transition duration-200 text-center w-full sm:w-auto"
              >
                View All Product Details
              </a>
            </div>
          </div>
        </div>
      }
    />
  );
};

export { BookQuickAddDetachedSheet };

