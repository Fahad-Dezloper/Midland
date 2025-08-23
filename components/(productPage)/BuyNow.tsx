"use client"
import { AddToCart } from 'components/cart/add-to-cart';
import { Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const BuyNowSection = ({product}) => {
    const [quantity, setQuantity] = useState(1)

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity)
    }
  }

  return (
    <div className="buy-now-section font-body w-full bg-white rounded-lg border border-gray-200 px-6 py-4 flex flex-col gap-4">
      {/* Price Details */}
      <div className="border-b pb-4">
        <div className="flex items-end gap-3 mb-2">
          <span className="text-red-600 text-sm font-medium font-primary">-20%</span>
          <span className="text-2xl font-bold text-gray-900">₹240</span>
        <div className="text-sm text-gray-600 mb-2 font-body">
          <span className="line-through">M.R.P.: ₹299</span>
        </div>
        </div>
        <div className="text-xs text-gray-600 font-body">Inclusive of all taxes</div>
      </div>

      {/* Fulfillment and Delivery */}
      <div className="border-b pb-4 space-y-3">
        {/* <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-600 font-primary">Fulfilled</span>
        </div> */}
        
        <div className="text-sm text-gray-700 space-y-1 font-body">
          <div>
            <span className="font-semibold text-green-700">FREE delivery</span> On your first order. 
            <Link href="#" className="text-blue-600 hover:underline ml-1">Details</Link>
          </div>
          <div>
            Or fastest delivery <span className="font-semibold">Tomorrow, 2 August</span>. Order within 
            <span className="text-red-600 font-semibold ml-1">9 hrs 53 mins</span>. 
            <Link href="#" className="text-blue-600 hover:underline ml-1">Details</Link>
          </div>
        </div>

        {/* <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-gray-600" />
          <Link href="#" className="text-blue-600 hover:underline font-body">
            Delivering to Delhi 110001 - Update location
          </Link>
        </div> */}
      </div>

      {/* Stock Information */}
      <div className="border-b pb-4 space-y-1 text-sm flex justify-between items-start">
        <div className="text-green-700 font-medium font-body">In stock</div>
        <div className="text-gray-600 font-body relative group">
          Payment{" "}
          <span className="relative">
            <Link
              href="#"
              className="text-primary hover:underline cursor-pointer"
              tabIndex={0}
            >
              Secure transaction
            </Link>
            <div className="absolute left-1/2 z-20 -translate-x-1/2 mt-2 w-80 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-sm text-gray-800 font-body opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto transition-opacity duration-200"
              style={{ top: '100%' }}
              role="tooltip"
            >
              <div className="font-semibold mb-1">Your transaction is secure</div>
              <div>
                We work hard to protect your security and privacy. Our payment security system encrypts your information during transmission.<br /><br />
                We don’t share your credit card details with third-party sellers, and we don’t sell your information to others. <a href="#" className="text-primary hover:underline">Learn more</a>
              </div>
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
                aria-label="Close"
                style={{ pointerEvents: 'auto' }}
                onClick={e => {
                  // Prevent closing popup since it's hover-based, but button is for accessibility
                  e.stopPropagation();
                }}
              >
                ×
              </button>
            </div>
          </span>
        </div>
      </div>

      {/* Quantity Selector */}
      <div className="border-b pb-4">
        <label className="text-sm text-gray-600 mb-3 block font-body">Quantity:</label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
            className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus className="w-4 h-4" />
          </button>
          <div className="w-16 h-8 border border-gray-300 rounded-md flex items-center justify-center text-sm font-medium font-primary">
            {quantity}
          </div>
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= 10}
            className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded-md transition-colors font-primary">
          Buy Now
        </button>
        <AddToCart product={product} />
        
        <div className="flex items-center gap-2">
          <input type="checkbox" id="gift" className="rounded" />
          <label htmlFor="gift" className="text-sm text-gray-600 font-body relative group cursor-pointer">
            Add a <span className="text-primary underline">Gift Wrap</span>
            <span className="absolute left-0 top-full mt-2 w-64 z-10 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs text-gray-700 font-body opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Make your gift extra special! Get your book beautifully gift wrapped with a personalized message for your loved ones.
            </span>
          </label>
        </div>
        
        <button className="w-full border border-gray-300 bg-white text-black font-medium py-2 px-4 rounded-md hover:bg-gray-50 transition-colors font-primary">
          Add to Wish List
        </button>
      </div>
    </div>
  )
}

export default BuyNowSection