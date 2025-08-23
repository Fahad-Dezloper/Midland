import CollectionSection from 'components/(landingPage)/CollectionSection';
import BannerSlider from 'components/(landingPage)/Slider';
import { Carousel } from 'components/carousel';
import { ThreeItemGrid } from 'components/grid/three-items';

export const metadata = {
  description:
    'High-performance ecommerce store built with Next.js, Vercel, and Shopify.',
  openGraph: {
    type: 'website'
  }
};

export default function HomePage() {
  return (
    <div className='flex flex-col gap-12'>
      <BannerSlider />
      <CollectionSection section="best-sellers" title="Best Seller" />
      <CollectionSection section="midlands-this-week-recommendation" title="Midland's This Week Recommendation" />
      <CollectionSection section="kids-and-children" title="Kids And Children" />
      <ThreeItemGrid />
      <Carousel />
    </div>
  );
}
