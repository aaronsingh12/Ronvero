import { useEffect, useState } from 'react';
import Hero from '../components/home/Hero.jsx';
import FeaturedCategories from '../components/home/FeaturedCategories.jsx';
import CollectionBanner from '../components/home/CollectionBanner.jsx';
import TrendingProducts from '../components/home/TrendingProducts.jsx';
import NewArrivals from '../components/home/NewArrivals.jsx';
import BestSellers from '../components/home/BestSellers.jsx';
import PromoBanner from '../components/home/PromoBanner.jsx';
import LifestyleSection from '../components/home/LifestyleSection.jsx';
import FeaturedCollection from '../components/home/FeaturedCollection.jsx';
import Testimonials from '../components/home/Testimonials.jsx';
import InstagramGallery from '../components/home/InstagramGallery.jsx';
import Newsletter from '../components/home/Newsletter.jsx';

import { bannerService } from '../services/bannerService.js';
import { categoryService } from '../services/categoryService.js';
import { collectionService } from '../services/collectionService.js';
import { productService } from '../services/productService.js';
import { testimonialService } from '../services/testimonialService.js';
import { useCatalogStore } from '../store/useCatalogStore.js';

const sampleHeroBanner = {
  eyebrow: 'New season',
  title: 'Train in motion.',
  subtitle: 'Performance activewear engineered for the mile, the lift, and everything after.',
  image: { url: '/images/hero/run-at-dawn-desktop.jpg' },
  mobileImage: { url: '/images/hero/run-at-dawn-mobile.jpg' },
  ctaText: 'Shop the drop',
  ctaLink: '/shop',
};

const emptyState = {
  heroBanner: sampleHeroBanner,
  promoBanner: null,
  lifestyleBanner: null,
  categories: [],
  collectionForBanner: null,
  featuredCollection: null,
  trending: [],
  newArrivals: [],
  bestSellers: [],
  testimonials: [],
};

export default function Home() {
  const catalogVersion = useCatalogStore((state) => state.version);
  const [data, setData] = useState(emptyState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [heroRes, promoRes, lifestyleRes, categoriesRes, collectionsRes, trendingRes, newRes, bestRes, testimonialsRes] =
          await Promise.all([
            bannerService.list('hero'),
            bannerService.list('promo'),
            bannerService.list('lifestyle'),
            categoryService.list({ featured: true }),
            collectionService.list({ featured: true }),
            productService.list({ isFeatured: true, limit: 8 }),
            productService.list({ isNewArrival: true, limit: 8 }),
            productService.list({ isBestSeller: true, limit: 8 }),
            testimonialService.list(),
          ]);

        let featuredCollection = null;
        if (collectionsRes.collections?.[0]) {
          const detail = await collectionService.getBySlug(collectionsRes.collections[0].slug);
          featuredCollection = detail.collection;
        }

        if (cancelled) return;
        setData({
          heroBanner: heroRes.banners?.[0] || sampleHeroBanner,
          promoBanner: promoRes.banners?.[0] || null,
          lifestyleBanner: lifestyleRes.banners?.[0] || null,
          categories: categoriesRes.categories || [],
          collectionForBanner: collectionsRes.collections?.[1] || collectionsRes.collections?.[0] || null,
          featuredCollection,
          trending: trendingRes.products || [],
          newArrivals: newRes.products || [],
          bestSellers: bestRes.products || [],
          testimonials: testimonialsRes.testimonials || [],
        });
      } catch (err) {
        // Backend not reachable yet (e.g. Mongo not seeded) — sections render their empty/loading states gracefully
        console.error('Failed to load homepage data:', err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [catalogVersion]);

  return (
    <div>
      <Hero banner={data.heroBanner} />
      <FeaturedCategories categories={data.categories} loading={loading} />
      <CollectionBanner collection={data.collectionForBanner} loading={loading} />
      <TrendingProducts products={data.trending} loading={loading} />
      <NewArrivals products={data.newArrivals} loading={loading} />
      <BestSellers products={data.bestSellers} loading={loading} />
      <PromoBanner banner={data.promoBanner} loading={loading} />
      <LifestyleSection banner={data.lifestyleBanner} loading={loading} />
      <FeaturedCollection collection={data.featuredCollection} loading={loading} />
      <Testimonials testimonials={data.testimonials} loading={loading} />
      <InstagramGallery />
      <Newsletter />
    </div>
  );
}
