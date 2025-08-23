import ProductComponent from 'components/(sharedComponents)/ProductComponent';
import { getProductFromSameAuthor } from 'lib/shopify';

const SameAuthorProducts = async ({ id, authorName }: { id: string, authorName: string }) => {
    if (!authorName) return null;
    
    const relatedProducts = await getProductFromSameAuthor(authorName);
    if (!relatedProducts.length) return null;
  return (
    <div className="grid 
          gap-4
          w-full
          grid-cols-2 
          sm:grid-cols-3 
          md:grid-cols-4 
          lg:grid-cols-6
          auto-rows-fr
          ">
    {relatedProducts.slice(0, 6).map((product) => (
      <ProductComponent key={product.id} product={product} />
    ))}
  </div>
  )
}

export default SameAuthorProducts