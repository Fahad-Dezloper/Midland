'use client';

import { removeItem } from 'components/cart/actions';
import DeleteIcon from 'components/icons/deleteIcon';
import type { CartItem } from 'lib/shopify/types';
import { useActionState } from 'react';

export function DeleteItemButton({
  item,
  optimisticUpdate
}: {
  item: CartItem;
  optimisticUpdate: any;
}) {
  const [message, formAction] = useActionState(removeItem, null);
  const merchandiseId = item.merchandise.id;
  const removeItemAction = formAction.bind(null, merchandiseId);

  return (
    <form
      action={async () => {
        optimisticUpdate(merchandiseId, 'delete');
        removeItemAction();
      }}
    >
      <button
        type="submit"
        aria-label="Remove cart item"
        className="flex p-1 items-center justify-center rounded-lg bg-neutral-200 hover:bg-red-500/20"
      >
        <DeleteIcon />
      </button>
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
