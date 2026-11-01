import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon } from '../components/ui/Icons.jsx';
import ProductGrid from '../components/product/ProductGrid.jsx';
import { useWishlistStore } from '../store/useWishlistStore.js';
import { productService } from '../services/productService.js';

export default function Wishlist() {
  const productIds = useWishlistStore((s) => s.productIds);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productIds.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    productService
      .getByIds(productIds)
      .then((data) => setProducts(data.products))
      .finally(() => setLoading(false));
  }, [productIds]);

  if (!loading && productIds.length === 0) {
    return (
      <div className="mx-auto flex max-w-8xl flex-col items-center gap-4 px-5 py-28 text-center">
        <HeartIcon size={32} className="text-char/30" />
        <h1 className="font-display text-2xl text-char">Your wishlist is empty</h1>
        <Link to="/shop" className="btn-primary">
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-8xl px-5 py-10 md:px-8">
      <h1 className="mb-8 font-display text-3xl font-semibold text-char md:text-4xl">Your wishlist</h1>
      <ProductGrid products={products} loading={loading} columns={4} />
    </div>
  );
}
