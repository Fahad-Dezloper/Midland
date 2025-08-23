import { Product } from "lib/shopify/types"; // Adjust import if needed
import Image from "next/image";
import Link from "next/link";
import { BookQuickAddDetachedSheet } from "silk/DetachedSheet/BookQuickAddDetachedSheet";

type ProductComponentProps = {
  product: Product;
  BOOK_SIZE_CLASSES?: string;
};

const ProductComponent = ({ product, BOOK_SIZE_CLASSES = "" }: ProductComponentProps) => {
  return (
    <div
      key={product.id}
      className="
        group 
        flex 
        flex-col 
        items-center
        rounded-2xl 
        overflow-hidden 
        transition 
        w-fit
        h-full
        min-h-[38vh]
        shrink-0
        grow-0
      "
    >
      <div
        className={`
          flex
          justify-center
          items-center
          rounded-2xl
          overflow-hidden
          relative
          group
          mb-2
          w-fit
          h-full
          ${BOOK_SIZE_CLASSES}
        `}
      >
        <Link href={`/product/${product.handle}`} className="w-fit h-full">
          <Image
            src={product.featuredImage?.url || "/placeholder.jpg"}
            alt={product.title}
            width={180}
            height={260}
            className="object-contain w-fit h-full rounded-xl"
            priority={false}
          />
        </Link>
        <div className="absolute -bottom-12 px-4 group-hover:bottom-4 transition-all duration-200 ease-in-out w-full h-fit flex items-center justify-center">
          <BookQuickAddDetachedSheet product={product} />
        </div>
      </div>
      <div className="p-2 h-fit gap-2 flex flex-col items-center justify-between w-full flex-1">
        <Link href={`/product/${product.handle}`} className="w-full">
          <h2 className="text-sm font-medium line-clamp-2 text-center leading-tight">{product.title}</h2>
        </Link>
        <div className="flex w-full items-center">
          <p className="text-gray-800 duration-200 ease-in-out leading-tight underline hover:text-primary text-sm text-center w-full">{product.vendor}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductComponent;