'use client';

import { GridTileImage } from 'components/grid/tile';
import { useProduct, useUpdateURL } from 'components/product/product-context';
import Image from 'next/image';
// @ts-ignore

export function Gallery({ images }: { images: { src: string; altText: string }[] }) {
  const { state, updateImage } = useProduct();
  const updateURL = useUpdateURL();
  const imageIndex = state.image ? parseInt(state.image) : 0;

  const handleThumbnailHover = (index: number) => {
    const newState = updateImage(index.toString());
    updateURL(newState);
  };

  const currentImage = images[imageIndex];

  return (
    <div className="flex flex-col">
      {/* Main Image with Zoom */}
      <div className="relative w-full flex items-center justify-center ">
        {currentImage && (
          <Image
            src={currentImage.src}
            alt={currentImage.altText}
            width={200}
            height={400}
           />
        )}
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 ? (
        <ul className="my-8 flex items-center justify-center gap-3 overflow-x-auto py-1 lg:mb-0">
          {images.map((image, index) => {
            const isActive = index === imageIndex;
            return (
              <li key={image.src} className="h-24 w-24">
                <div
                  onMouseEnter={() => handleThumbnailHover(index)}
                  className="h-full w-full cursor-pointer"
                >
                  <GridTileImage
                    alt={image.altText}
                    src={image.src}
                    width={96}
                    height={96}
                    active={isActive}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
