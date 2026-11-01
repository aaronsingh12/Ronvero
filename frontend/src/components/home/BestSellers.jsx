import ProductRail from './ProductRail.jsx';

export default function BestSellers({ products, loading }) {
  return (
    <ProductRail
      eyebrow="Proven favorites"
      title="Best sellers"
      products={products}
      loading={loading}
      viewAllLink="/shop?sort=bestselling"
    />
  );
}
