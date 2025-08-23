'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { addItem } from 'components/cart/actions';
import { useProduct } from 'components/product/product-context';
import { Product, ProductVariant } from 'lib/shopify/types';
import { AnimatePresence, motion } from 'motion/react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useCart } from './cart-context';

function SubmitButton({
  availableForSale,
  selectedVariantId,
  addedRecently,
  isMutating
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
  addedRecently: boolean;
  isMutating: boolean;
}) {
  const { pending } = useFormStatus();
  const buttonClasses =
    'w-full bg-white hover:bg-primary/10 border border-primary text-primary font-semibold py-2 px-4 rounded-md transition-colors font-primary cursor-pointer';
  const disabledClasses = 'cursor-not-allowed opacity-60 hover:opacity-60';

  if (!availableForSale) {
    return (
      <button disabled className={clsx(buttonClasses, disabledClasses)}>
        Out Of Stock
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-label="Please select an option"
        disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        <div className="absolute left-0 ml-4">
          <PlusIcon className="h-5" />
        </div>
        Add To Cart
      </button>
    );
  }

  return (
    <button
      aria-label="Add to cart"
      className={clsx(buttonClasses, {
        'hover:opacity-90': true,
        'opacity-75': pending || isMutating
      })}
      type="submit"
      disabled={pending || isMutating}
    >
      <div className="absolute left-0 ml-4">
        <PlusIcon className="h-5" />
      </div>
      <span className="block w-full text-center">
        <span
          className="relative inline-block overflow-hidden align-middle"
          style={{ minWidth: 88, height: '1.5em' }}
        >
          <AnimatePresence initial={false} mode="wait">
            {(() => {
              const isLoading = pending || isMutating;
              const label = isLoading ? 'Adding' : addedRecently ? 'Added' : 'Add To Cart';
              return (
                <motion.span
                  key={label}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.18, ease: 'easeInOut' }}
                  className="inline-block"
                >
                  {label}
                </motion.span>
              );
            })()}
          </AnimatePresence>
        </span>
      </span>
    </button>
  );
}

export function AddToCart({ product }: { product: Product }) {
  const { variants, availableForSale } = product;
  const { addCartItem, addedRecently, notifyAdded, beginCartMutation, endCartMutation, isMutating } = useCart();
  const { state } = useProduct();
  const [message, formAction] = useActionState(addItem, null);

  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === state[option.name.toLowerCase()]
    )
  );
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  const addItemAction = formAction.bind(null, selectedVariantId);
  const finalVariant = variants.find(
    (variant) => variant.id === selectedVariantId
  )!;

  return (
    <form
      action={async () => {
        beginCartMutation();
        addCartItem(finalVariant, product);
        await addItemAction();
        notifyAdded();
        endCartMutation();
      }}
    >
      <SubmitButton
        availableForSale={availableForSale}
        selectedVariantId={selectedVariantId}
        addedRecently={addedRecently}
        isMutating={isMutating}
      />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
