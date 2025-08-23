import UserAuth from 'components/(landingPage)/UserAuth';
import CartModal from 'components/cart/modal';
import { getMenu } from 'lib/shopify';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { FacebookIcon } from '../../../src/components/ui/facebook';
import { InstagramIcon } from '../../../src/components/ui/instagram';
import { TwitterIcon } from '../../../src/components/ui/twitter';
import CategoryNavLinks from './CategoryNavLinks';
import DesktopNavLinks from './DesktopNavLinks';
import MobileMenu from './mobile-menu';
import Search, { SearchSkeleton } from './search';

const { SITE_NAME } = process.env;

// Social Media Icons
const TwitterIconn = () => (
  <TwitterIcon size={24} />
);

const FacebookIconn = () => (
  <FacebookIcon size={24}  />
);

const InstagramIconn = () => (
  <InstagramIcon size={24} />
);

export async function Navbar() {
  const menu = await getMenu('main-menu');
  const menu2 = await getMenu('card-menu');
  const menu3 = await getMenu('category-menu');

  return (
    <header className="w-full md:px-24 px-4 bg-white flex flex-col gap-4 font-primary pt-6 overflow-hidden border-b-1 mb-8 border-black">
      {/* Top Navigation Bar */}
      <nav className="bg-white ">
        <div className="flex items-center justify-between h-12">
          {/* Left Navigation - Hidden on mobile, visible on md+ */}
          <DesktopNavLinks />

          {/* Mobile Logo - Only visible on mobile */}
          <div className="block md:hidden">
            <Link href="/" className="flex items-center">
              <Image 
                src="/Midland.svg" 
                alt="Midland Books" 
                width={100} 
                height={30}
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Mobile Menu Button and Cart */}
          <div className="flex items-center space-x-2 md:hidden">
            <CartModal />
            <Suspense fallback={null}>
              <MobileMenu menu={menu} />
            </Suspense>
          </div>

          {/* Right Navigation - Hidden on mobile, visible on md+ */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/pre-order" className="text-gray-700 hover:text-primary text-sm font-medium">
              Pre-order
            </Link>
            <Link href="/track-shipment" className="text-gray-700 hover:text-primary text-sm font-medium">
              Track Shipment
            </Link>
            <Link href="/wishlist" className="text-gray-700 hover:text-primary text-sm font-medium">
              Wishlist
            </Link>
           <UserAuth />
            <CartModal />
          </div>
        </div>
      </nav>

      {/* Logo and Search Section */}
      <div className="bg-white ">
        <div className="flex items-center">
          {/* Desktop Logo - Hidden on mobile */}
          <div className="hidden md:flex items-center">
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

          {/* Search Bar - Centered on desktop, full width on mobile */}
          <div className="flex-1 w-full max-w-[45vw]  mx-8 hidden md:block">
            <Suspense fallback={<SearchSkeleton />}>
              <Search />
            </Suspense>
          </div>

          {/* Desktop spacing for social icons */}
          <div className="hidden md:block w-24"></div>
        </div>

        {/* Mobile Search */}
        <div className="mt-2 md:hidden">
          <Suspense fallback={<SearchSkeleton />}>
            <Search />
          </Suspense>
        </div>
      </div>

      {/* Category Navigation */}
      <nav className="bg-white">
        <div className="flex items-center justify-between h-12">
          {/* Categories - Scrollable on mobile */}
          <div className="flex-1 overflow-x-auto scrollbar-hide">
            <CategoryNavLinks items={menu3 ?? []} />
          </div>

          {/* Social Media Icons - Hidden on mobile, visible on md+ */}
          <div className="hidden md:flex items-center space-x-4 ml-4">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-500 transition-colors">
              <TwitterIconn />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary transition-colors">
              <FacebookIconn />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-pink-600 transition-colors">
              <InstagramIconn />
            </a>
          </div>
        </div>
        
        {/* Mobile Social Media Icons */}
        {/* <div className="flex md:hidden items-center justify-center space-x-6 pb-3 border-t border-gray-100 mt-2 pt-3">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-500 transition-colors">
            <TwitterIconn />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary transition-colors">
            <FacebookIconn />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-pink-600 transition-colors">
            <InstagramIconn />
          </a>
        </div> */}
      </nav>
    </header>
  );
}
