import ProductComponent from "components/(sharedComponents)/ProductComponent";
import { getCollection, getCollectionProducts } from "lib/shopify";
import { Metadata } from "next";
export const dynamic = "force-dynamic";

// Dynamic metadata generation
export async function generateMetadata(props: { params: Promise<{ page: string }> }): Promise<Metadata> {
  const params = await props.params;
  const formattedHandle = decodeURIComponent(params.page)
    .toLowerCase()
    .replace(/\s+/g, '-');
  try {
    const collectionDetails = await getCollection(formattedHandle);

    if (collectionDetails) {
      return {
        title: collectionDetails.title || "Best Sellers",
        description: collectionDetails.description || collectionDetails.seo?.description || "Browse our best-selling books loved by thousands of readers. Discover new favorites and timeless classics.",
      };
    }
  } catch (error) {
    console.error("Error fetching collection metadata", error);
  }

  // Fallback metadata
  return {
    title: "Best Sellers",
    description: "Browse our best-selling books loved by thousands of readers. Discover new favorites and timeless classics.",
  };
}

// Book image sizes for different breakpoints
const BOOK_SIZE_CLASSES =
  "w-[120px] h-[170px] sm:w-[150px] sm:h-[210px] md:w-[180px] md:h-[260px]";

const Page = async (props: { params: Promise<{ page: string }> }) => {
  const params = await props.params;
  const formattedHandle = decodeURIComponent(params.page)
    .toLowerCase()
    .replace(/\s+/g, '-');
  let products: any[] = [];
  let collectionDetails: any;
  try {
    products = await getCollectionProducts({ collection: formattedHandle });
    collectionDetails = await getCollection(formattedHandle);
    console.log("collectionDetails", collectionDetails);
  } catch (error) {
    console.error("Error fetching collections", error);
  }

  if (!products || products.length === 0) {
    return (
      <div className="container py-10 text-center">
        <h1 className="text-2xl font-semibold">No products found.</h1>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="primary-heading">{collectionDetails.title}</h1>
      {/* Responsive grid for products */}
      <div
        className="
          grid 
          gap-6 
          w-full
          grid-cols-2 
          sm:grid-cols-3 
          md:grid-cols-4 
          lg:grid-cols-6
        "
      >
        {products.map((product) => (
          <ProductComponent key={product.id} product={product} BOOK_SIZE_CLASSES={BOOK_SIZE_CLASSES} />
        ))}
      </div>
    </div>
  );
};

export default Page;
