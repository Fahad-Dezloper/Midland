import ProductComponent from 'components/(sharedComponents)/ProductComponent';
import { getProductRecommendations } from 'lib/shopify';

const ReleatedProducts = async ({ id }: { id: string }) => {
    const relatedProducts = await getProductRecommendations(id);

    if (!relatedProducts.length) return null;
  return (
    <div className="grid 
          gap-4
          w-full
          grid-cols-2 
          sm:grid-cols-3 
          md:grid-cols-4 
          lg:grid-cols-6
          auto-rows-fr">
    {relatedProducts.slice(0, 6).map((product) => (
      <ProductComponent key={product.id} product={product} />
    ))}
  </div>
  )
}

export default ReleatedProducts