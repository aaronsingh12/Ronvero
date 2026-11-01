import ProductRail from './ProductRail.jsx';

export default function NewArrivals({ products, loading }) {
  return (
    <ProductRail
      eyebrow="Just landed"
      title="New arrivals"
      products={products}
      loading={loading}
      viewAllLink="/shop?sort=newest"
    />
  );
}
