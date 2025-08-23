'use client';

import { PartyPopperIcon } from '@/components/ui/party-popper';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import ShoppingCartIcon from 'components/icons/shopping-cart-icon';
import LoadingDots from 'components/loading-dots';
import Price from 'components/price';
import { DEFAULT_OPTION } from 'lib/constants';
import { createUrl } from 'lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { createCartAndSetCookie, redirectToCheckout } from './actions';
import { useCart } from './cart-context';
import { DeleteItemButton } from './delete-item-button';
import { EditItemQuantityButton } from './edit-item-quantity-button';
import OpenCart from './open-cart';

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function CartModal() {
  const { cart, updateCartItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  useEffect(() => {
    if (!cart) {
      createCartAndSetCookie();
    }
  }, [cart]);

  console.log("cart here", cart);

  // Removed auto-open on quantity change to avoid opening the cart after add

  return (
    <>
      <button aria-label="Open cart" onClick={openCart}>
        <OpenCart quantity={cart?.totalQuantity} />
        {/* <animated-icons
          src="https://animatedicons.co/get-icon?name=Cart&style=minimalistic&token=46475390-3e9d-4ccd-9834-a94888682feb"
          trigger="hover"
          attributes='{"variationThumbColour":"#536DFE","variationName":"Two Tone","variationNumber":2,"numberOfGroups":2,"backgroundIsGroup":true,"strokeWidth":2,"defaultColours":{"group-1":"#000000","group-2":"#0493D7FF","background":"#FFFFFF"}}'
          height="30"
          width="30"
          className="cursor-pointer p-2 w-full bg-primary/40 rounded-xl"
        ></animated-icons> */}
      </button>
      <Transition show={isOpen}>
        <Dialog onClose={closeCart} className="relative z-50 font-primary">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="fixed bottom-0 right-0 top-0 flex h-full w-full flex-col border-l border-neutral-200 bg-white/80 p-6 text-black backdrop-blur-xl md:w-[390px] dark:border-neutral-700 dark:bg-black/80 dark:text-white">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">My Cart</p>
                <button aria-label="Close cart" onClick={closeCart}>
                  <CloseCart />
                </button>
              </div>

              {!cart || cart.lines.length === 0 ? (
                <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
                  <ShoppingCartIcon className="h-16" />
                  <p className="mt-6 text-center text-2xl font-semibold">
                    Your cart is empty.
                  </p>
                </div>
              ) : (
                <div className="flex h-full flex-col justify-between overflow-hidden p-1">
                  <ul className="grow overflow-auto scrollbar-hide py-4">
                    {cart.lines
                      .sort((a, b) =>
                        a.merchandise.product.title.localeCompare(
                          b.merchandise.product.title
                        )
                      )
                      .map((item, i) => {
                        const merchandiseSearchParams =
                          {} as MerchandiseSearchParams;

                        item.merchandise.selectedOptions.forEach(
                          ({ name, value }) => {
                            if (value !== DEFAULT_OPTION) {
                              merchandiseSearchParams[name.toLowerCase()] =
                                value;
                            }
                          }
                        );

                        const merchandiseUrl = createUrl(
                          `/product/${item.merchandise.product.handle}`,
                          new URLSearchParams(merchandiseSearchParams)
                        );
                        // const price = item.merchandise ? item.merchandise.priceRange.maxVariantPrice.amount : "emtpy";
                        console.log("item hereeee", item.merchandise.product.priceRange.maxVariantPrice.amount);

                        const fullProductTitle = item.merchandise.product.title;
                        const truncatedProductTitle =
                          fullProductTitle.length > 30
                            ? fullProductTitle.slice(0, 30) + '...'
                            : fullProductTitle;

                        return (
                          <li
                            key={i}
                            className="flex w-full flex-col border-b border-neutral-300 dark:border-neutral-700"
                          >
                            <div className="relative flex w-full flex-row justify-between px-1 py-4">
                              <div className="flex flex-row">
                                <div className="relative h-28 min-w-18 overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                                  <Image
                                    className="h-full w-full object-cover"
                                    width={64}
                                    height={64} 
                                    alt={
                                      item.merchandise.product.featuredImage
                                        .altText ||
                                      item.merchandise.product.title
                                    }
                                    src={
                                      item.merchandise.product.featuredImage.url
                                    }
                                  />
                                </div>
                                <div className='flex flex-col gap-2'>
                                <Link
                                  href={merchandiseUrl}
                                  onClick={closeCart}
                                  className="z-30 ml-2 flex  h-fit flex-col gap-2"
                                >
                                  <div className="flex flex-1 flex-col text-base">
                                    <span className="leading-tight">
                                      {truncatedProductTitle}
                                    </span>
                                    {item.merchandise.title !==
                                    DEFAULT_OPTION ? (
                                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                        {item.merchandise.title}
                                      </p>
                                    ) : null}
                                  </div>
                                  <span className='text-gray-700 text-sm'>Rs. {item.merchandise.product.priceRange.maxVariantPrice.amount}</span>
                                </Link>
                                <div className='flex gap-2 items-center'>
                                  <div className="flex h-fit w-fit ml-2 flex-row items-center rounded-full border-2 border-neutral-200 dark:border-neutral-700">
                                    <EditItemQuantityButton
                                      item={item}
                                      type="minus"
                                      optimisticUpdate={updateCartItem}
                                    />
                                    <p className="w-6 text-center">
                                      <span className="w-full text-sm">
                                        {item.quantity}
                                      </span>
                                    </p>
                                    <EditItemQuantityButton
                                      item={item}
                                      type="plus"
                                      optimisticUpdate={updateCartItem}
                                    />
                                  </div>
                                  {/* <DeleteIcon /> */}
                                  <DeleteItemButton
                                  item={item}
                                  optimisticUpdate={updateCartItem}
                                />
                                  </div>
                                  </div>
                              </div>
                              <div className="flex h-16 flex-col justify-between">
                                <Price
                                  className="flex justify-end space-y-2 text-right text-sm"
                                  amount={item.cost.totalAmount.amount}
                                  currencyCode={
                                    item.cost.totalAmount.currencyCode
                                  }
                                />
                              </div>
                            </div>
                          </li>
                        );
                      })}
                  </ul>
                  <div className="py-4 text-sm text-neutral-500 dark:text-neutral-400">
                    {/* not confirm if needed or not */}
                    {/* <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 dark:border-neutral-700">
                      <p>Taxes</p>
                      <Price
                        className="text-right text-base text-black dark:text-white"
                        amount={cart.cost.totalTaxAmount.amount}
                        currencyCode={cart.cost.totalTaxAmount.currencyCode}
                      />
                    </div> */}
                    <div className='flex w-full justify-center'>
                    <div className="flex items-center gap-2 text-primary bg-primary/5  rounded-t-xl pt-2 pb-1.5 px-4">
                      <PartyPopperIcon size={20} />
                      <p>Free Freebies</p>
                    </div>
                    </div>
                    <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-2 dark:border-neutral-700">
                      <p>Shipping</p>
                      <p className="text-right">Calculated at checkout</p>
                    </div>
                    <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                      <p>Total</p>
                      <Price
                        className="text-right text-base text-black dark:text-white"
                        amount={cart.cost.totalAmount.amount}
                        currencyCode={cart.cost.totalAmount.currencyCode}
                      />
                    </div>
                  </div>
                  <form action={redirectToCheckout}>
                    <CheckoutButton />
                  </form>
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}

function CloseCart({ className }: { className?: string }) {
  return (
    <div className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white">
      <XMarkIcon
        className={clsx(
          'h-6 transition-all ease-in-out hover:scale-110',
          className
        )}
      />
    </div>
  );
}

function CheckoutButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="btn-primary cursor-pointer text-white py-3 px-4 rounded-lg leading-tight w-full text-lg font-medium transition duration-200 "
      type="submit"
      disabled={pending}
    >
      {pending ? <LoadingDots className="bg-white" /> : 'Proceed to Checkout'}
    </button>
  );
}
