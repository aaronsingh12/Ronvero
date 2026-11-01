import ProductRail from './ProductRail.jsx';

export default function TrendingProducts({ products, loading }) {
  return (
    <ProductRail
      eyebrow="Right now"
      title="Trending this week"
      products={products}
      loading={loading}
      viewAllLink="/shop?sort=trending"
    />
  );
}
