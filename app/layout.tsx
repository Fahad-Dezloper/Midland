import { CartProvider } from 'components/cart/cart-context';
import Footer from 'components/layout/footer';
import { Navbar } from 'components/layout/navbar';
import { WelcomeToast } from 'components/welcome-toast';
import { getCart } from 'lib/shopify';
import { baseUrl } from 'lib/utils';
import { Josefin_Sans, Roboto } from 'next/font/google';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';
import './globals.css';

const { SITE_NAME } = process.env;
const josefinsans = Josefin_Sans({ weight: ['100', '200', '300', '500', '600', '700'], subsets: ['latin'], variable: '--font-primary' });
const roboto = Roboto({ weight: ['100', '200', '300', '500', '600', '700', '800', '900'], subsets: ['latin'], variable: '--font-body' });



export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`
  },
  robots: {
    follow: true,
    index: true
  }
};

export default async function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  // Don't await the fetch, pass the Promise to the context provider
  const cart = getCart();

  return (
    <html lang="en" className={josefinsans.variable} suppressHydrationWarning>
      <body suppressHydrationWarning className={`${roboto.variable} antialiased !overflow-x-hidden w-full text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white`}>
        <CartProvider cartPromise={cart}>
          <Navbar />
          <main className='md:px-24 px-4'>
            {children}
            <Toaster closeButton />
            <WelcomeToast />
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
