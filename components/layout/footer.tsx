import { FacebookIcon } from '@/components/ui/facebook';
import { InstagramIcon } from '@/components/ui/instagram';
import { TwitterIcon } from '@/components/ui/twitter';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full md:px-24 px-4 bg-[#F7F7F7] font-primary text-black">
      <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col md:flex-row md:items-start md:justify-between gap-10 md:gap-40">
        {/* Left: Logo and Description */}
        <div className="flex flex-col min-w-[220px] max-w-[260px]">
          <div className="mb-2">
            <Link href="/" className="flex items-center">
              <Image 
                src="/Midland.svg" 
                alt="Midland Books" 
                width={120} 
                height={40}
                className="h-10 w-auto"
              />
            </Link>
          </div>
          <div className="text-sm leading-snug mt-2 font-secondary text-[#6B6B6B] space-y-2">
            <p>
              <span className="font-semibold text-black">India's Iconic & Independent Book Store</span> offering a vast selection of books across a variety of genres Since 1978.
            </p>
            <p className="italic text-black">
              "We Believe In The Power of Books"
            </p>
            {/* <p>
              Our mission is to make books accessible to everyone, and to cultivate a culture of reading and learning. We strive to provide a wide range of books, from classic literature, sci-fi and fantasy, to graphic novels, biographies and self-help books, so that everyone can find something to read.
            </p> */}
            <p>
              Whether you’re looking for your next great read, a gift for someone special, or just browsing, <span className="font-semibold text-black">Midland</span> is here to make your book-buying experience easy and enjoyable.
            </p>
            <p>
              <span className="font-semibold text-black">We are shipping pan India and across the world.</span>
            </p>
            <div className="mt-2">
              <span className="block font-semibold text-black">For Bulk Order / Corporate Gifting</span>
              <span className="block"><span className="text-black">+91 9818282497</span> | <a href="mailto:read@midlandbookshop.com" className="underline hover:text-primary text-black">read@midlandbookshop.com</a></span>
              <Link href="/bulk-orders" className="text-primary underline hover:text-black mt-1 inline-block">Click To Know More</Link>
            </div>
          </div>
        </div>

        {/* Columns */}
        <div className="md:flex grid grid-cols-2 flex-wrap gap-8 flex-1">
          {/* Information */}
          <div className="min-w-[140px]">
            <h3 className="font-semibold mb-2 text-xl">Information</h3>
            <ul className="space-y-1 text-[#6B6B6B]">
              <li className="hover:text-primary"><Link href="/about">About Us</Link></li>
              <li className="hover:text-primary"><Link href="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Policies */}
          <div className="min-w-[140px]">
            <h3 className="font-semibold mb-2 text-xl">Policies</h3>
            <ul className="space-y-1 text-[#6B6B6B]">
              <li className="hover:text-primary"><Link href="/refund-policy">Refund Policy</Link></li>
              <li className="hover:text-primary"><Link href="/privacy-policy">Privacy Policy</Link></li>
              <li className="hover:text-primary"><Link href="/terms-of-use">Terms Of Use</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div className="min-w-[140px]">
            <h3 className="font-semibold mb-2 text-xl">Account</h3>
            <ul className="space-y-1 text-[#6B6B6B]">
              <li className="hover:text-primary"><Link href="/account">My Account</Link></li>
              <li className="hover:text-primary"><Link href="/wishlist">Wishlist</Link></li>
              <li className="hover:text-primary"><Link href="/wishlist">Our Blogs</Link></li>
              <li className="hover:text-primary"><Link href="/wishlist">Our Reviews</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="min-w-[140px]">
            <h3 className="font-semibold mb-2 text-xl">Quick links</h3>
            <ul className="space-y-1 text-[#6B6B6B]">
              <li className="hover:text-primary"><Link href="/account">Track Your Order</Link></li>
              <li className="hover:text-primary"><Link href="/wishlist">Midland's This Week Recommendations</Link></li>
              <li className="hover:text-primary"><Link href="/wishlist">Bestseller</Link></li>
              <li className="hover:text-primary"><Link href="/wishlist">New Releases</Link></li>
              <li className="hover:text-primary"><Link href="/wishlist">Authors Gallery</Link></li>
            </ul>
          </div>

          {/* Reach Out */}
          <div className="min-w-[180px] flex flex-col gap-3">
            <h3 className="font-semibold text-xl">Reach Out</h3>
            <div className="text-sm space-y-2">
              <div>
                Midland Book Shop - Hauz Khas<br />
                Shop No.20, Aurobindo Palace Market,<br />
                Near Church, New Delhi
              </div>
            </div>
            {/* Social Icons Row */}
            <div className="w-full">
              <div className="flex md:justify-start items-center space-x-4">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-500 transition-colors">
                  <TwitterIcon size={24} />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary transition-colors">
                  <FacebookIcon size={24} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-pink-600 transition-colors">
                  <InstagramIcon size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
}
