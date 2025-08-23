import ProductComponent from "components/(sharedComponents)/ProductComponent";
import { getAuthorDetailsAndBooks } from "lib/shopify";
import { parseRichTextDescription } from "lib/utils";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    authorName: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const authorName = resolvedParams.authorName?.replace(/-/g, " ") || "";
  
  if (!authorName) {
    return {
      title: "Author Not Found",
    };
  }

  const { author } = await getAuthorDetailsAndBooks(authorName);

  if (!author) {
    return {
      title: "Author Not Found",
    };
  }

  const parsedDescription = parseRichTextDescription(author.description);
  const plainTextDescription = parsedDescription.replace(/<[^>]*>/g, '').substring(0, 160);
  
  return {
    title: `Books by ${author.name} | Midland`,
    description: author.description 
      ? `${author.name} - ${plainTextDescription}...`
      : `Explore books by ${author.name} at Midland.`,
    openGraph: {
      title: `Books by ${author.name}`,
      description: author.description 
        ? plainTextDescription
        : `Explore books by ${author.name}`,
      images: author.image ? [author.image.url] : [],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const authorName = resolvedParams.authorName?.replace(/-/g, " ") || "";
  
  if (!authorName) {
    notFound();
  }

  const { author, books } = await getAuthorDetailsAndBooks(authorName);

  if (!author || !books.length) {
    notFound();
  }

  return (
    <div className="container flex gap-12 py-8">
      {/* Author Header Section */}
      <div className="flex flex-col w-full max-w-[30vw] rounded-lg border h-fit p-6">
        {/* Name on top */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{author.name}</h1>
                 {/* Author description with image */}
         {author.description && (
           <div className="relative">
                           {author.image && (
                <div className="float-left mr-4 w-40 h-40">
                 <Image
                   src={author.image.url}
                   alt={author.image.altText || author.name}
                   className="w-full h-full rounded-lg object-cover"
                   width={160}
                   height={160}
                   priority
                 />
               </div>
             )}
                           <div className="text-gray-600 prose leading-relaxed !mt-0 pt-0">
                <div className="author-card" dangerouslySetInnerHTML={{ __html: parseRichTextDescription(author.description) }} />
              </div>
             <div className="clear-both" />
           </div>
         )}
      </div>

      {/* Books Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Books by {author.name}</h2>
        <div className="grid 
          gap-4
          grid-cols-2 
          sm:grid-cols-3 
          md:grid-cols-4 
          lg:grid-cols-5
          xl:grid-cols-4
          auto-rows-fr
        ">
          {books.map((product) => (
            <ProductComponent key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}